// src/lib/services/booking.ts
import pool from "../../db";
import { submitOrder } from "../pesapal-client";
import { ensureUserExists } from "./user";

export async function initiateBookingFlow(body: any) {
  const {
    bookingId,
    userId,
    first_name,
    last_name,
    email,
    phoneNumber,
    image,
    carId,
    bookingDate,
    bookingEndDate,
    departure,
    destination,
    bookType,
    paymentType,
    amount,
    reference,
    description,
    callbackUrl,
    departureLatitude,
    departureLongitude,
    destinationLatitude,
    destinationLongitude,
    addons = [],
  } = body;

  // 1. Ensure user record
  await ensureUserExists({
    userId,
    name: `${first_name} ${last_name}`,
    email,
    phone: phoneNumber,
    image,
  });

  // 2. Create booking & addons if new
  await createBookingIfNotExists({
    reference,
    bookingId,
    userId,
    carId,
    bookingDate,
    bookingEndDate,
    amount,
    departure,
    destination,
    bookType,
    paymentType,
    departureLatitude,
    departureLongitude,
    destinationLatitude,
    destinationLongitude,
    addons,
  });

  // 3. Send to Pesapal
  const paymentRequest = {
    id: reference,
    currency: "KES",
    amount,
    description,
    callback_url: callbackUrl,
    notification_id: "d41a4afa-0e37-4438-99ff-dbe3c06b6468",
    billing_address: {
      email_address: email,
      phone_number: phoneNumber,
      country_code: "KE",
      first_name,
      last_name,
    },
  };
  const resp = await submitOrder(paymentRequest);

  const useBookingId = bookingId || reference;

  await pool.query(
    `INSERT INTO "PesapalMapping" 
       (merchant_reference, order_tracking_id, booking_id)
     VALUES ($1,$2,$3)`,
    [resp.merchant_reference, resp.order_tracking_id, useBookingId]
  );

  return {
    order_tracking_id: resp.order_tracking_id,
    merchant_reference: resp.merchant_reference,
    redirect_url: resp.redirect_url,
    status: resp.status,
    error: resp.error,
  };
}

async function createBookingIfNotExists(opts: {
  reference: string;
  bookingId: string;
  userId: string;
  carId: string;
  bookingDate: string;
  bookingEndDate: string;
  amount: number;
  departure: string;
  destination: string;
  bookType: string;
  paymentType: string;
  departureLatitude: number;
  departureLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  addons: string[];
}) {
  const client = await pool.connect();
  try {
    const exists = await client.query(`SELECT 1 FROM "Booking" WHERE id=$1`, [
      opts.bookingId,
    ]);
    if (exists.rowCount) return;

    await client.query("BEGIN");
    await client.query(
      `INSERT INTO "Booking"(id,"userId","carId","bookingDate","bookingEndDate",
        amount,"departure","destination","paymentStatus","bookType","paymentType",
        "departureLatitude","departureLongitude","destinationLatitude","destinationLongitude")
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,'PENDING',$9,$10,$11,$12,$13,$14)`,
      [
        opts.reference,
        opts.userId,
        opts.carId,
        opts.bookingDate,
        opts.bookingEndDate,
        opts.amount,
        opts.departure,
        opts.destination,
        opts.bookType,
        opts.paymentType,
        opts.departureLatitude,
        opts.departureLongitude,
        opts.destinationLatitude,
        opts.destinationLongitude,
      ]
    );

    if (opts.addons.length) {
      const { rows } = await client.query(
        `SELECT id FROM "Addon" WHERE "addonName" = ANY($1)`,
        [opts.addons]
      );
      const ids = rows.map((r) => r.id);
      if (ids.length !== opts.addons.length) throw new Error("Invalid addon");
      const placeholders = ids.map((_, i) => `($1, $${i + 2})`).join(",");
      await client.query(
        `INSERT INTO "BookingAddon"("bookingId","addonId") VALUES ${placeholders}`,
        [opts.bookingId, ...ids]
      );
    }

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
