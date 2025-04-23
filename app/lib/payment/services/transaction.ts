// src/lib/services/transaction.ts

import pool from "../../db";
import { getTransactionStatus } from "../pesapal-client";

export async function handleCallbackFlow(body: any) {
  const { OrderTrackingId, OrderMerchantReference } = body;

  const statusData = await getTransactionStatus(OrderTrackingId);

  const isConfirmed = statusData.status_code === 1;
  const paymentStatus = isConfirmed ? "CONFIRMED" : "FAILED";

  const client = await pool.connect();

  // lookup the mapping first
  const mapRes = await client.query(
    `SELECT booking_id FROM "PesapalMapping" WHERE merchant_reference = $1`,
    [OrderMerchantReference]
  );
  if (mapRes.rowCount === 0) throw new Error("No mapping for this reference");
  const bookingId = mapRes.rows[0].booking_id;

  // now fetch + update the Booking by bookingId exactly as above…

  const existing = await client.query(`SELECT * FROM "Booking" WHERE id = $1`, [
    bookingId,
  ]);
  const booking = existing.rows[0];

  try {
    await client.query("BEGIN");

    // Update booking
    if (isConfirmed && booking.paymentStatus !== "PENDING") {
      // first half paid earlier, now completing full payment
      await client.query(
        `UPDATE "Booking"
       SET "paymentType" = $1,
           amount         = $2,
           "paymentStatus"= $3
     WHERE id = $4`,
        [
          "full",
          booking.amount * 2, //if you always double
          paymentStatus,
          booking.id,
        ]
      );
    } else {
      // fallback single-shot payment or mark failed
      await client.query(
        `UPDATE "Booking"
       SET "paymentStatus" = $1
     WHERE id = $2`,
        [paymentStatus, OrderMerchantReference]
      );
    }

    // Log transaction
    await client.query(
      `INSERT INTO "Transaction"("bookingId",amount,status,reference,"confirmationCode","paymentMethod")
       VALUES($1,$2,$3,$4,$5,$6)`,
      [
        bookingId,
        statusData.amount,
        isConfirmed ? "SUCCESS" : "FAILED",
        OrderTrackingId,
        statusData.confirmation_code,
        statusData.payment_method,
      ]
    );

    await client.query("COMMIT");

    return {
      orderNotificationType: "IPNCHANGE",
      orderTrackingId: OrderTrackingId,
      orderMerchantReference: OrderMerchantReference,
      status: 200,
    };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
