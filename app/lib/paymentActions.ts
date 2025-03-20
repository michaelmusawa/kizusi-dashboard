import axios from "axios";
import pool from "./db";
import { NextResponse } from "next/server";
import { BookingState } from "./definitions";

let booking: BookingState;

export const initiatePayment = async (body: any) => {
  const {
    bookingId,
    amount,
    email,
    phoneNumber,
    reference,
    description,
    callbackUrl,
    userId,
    carId,
    bookingDate,
    bookingEndDate,
    departureLatitude,
    departureLongitude,
    destinationLatitude,
    destinationLongitude,
    departure,
    destination,
    bookType,
    paymentType,
    addons,
    image,
    first_name,
    last_name,
  } = body;

  const name = `${first_name} ${last_name}`;

  try {
    // 🔹 Start database transaction
    const client = await pool.connect();
    try {
      // Check if user exists first
      const userResult = await client.query(
        `SELECT * FROM "User" WHERE id = $1`,
        [userId]
      );
      if (userResult.rowCount === 0) {
        await client.query(
          `INSERT INTO "User" (id, name, email, phone, image, "clerkId") 
            VALUES ($1, $2, $3, $4, $5, $6)`,
          [userId, name, email, phoneNumber, image, userId]
        );
      }

      // Check if transaction exists first
      const bookingResult = await client.query(
        `SELECT * FROM "Booking" WHERE id = $1`,
        [bookingId]
      );

      if (bookingResult.rowCount === 0) {
        // 🔹 Start transaction

        await client.query("BEGIN"); // Start transaction

        // ✅ Create booking in database BEFORE sending payment request
        const bookingQuery = `
      INSERT INTO "Booking" (
        id,
       "userId", 
       "carId", 
       "bookingDate", 
       "bookingEndDate",
       amount, 
       "departure", 
       "destination", 
       "paymentStatus", 
       "bookType", 
       "paymentType", 
       "departureLatitude",
      "departureLongitude",
      "destinationLatitude", 
      "destinationLongitude")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING', $9, $10, $11, $12, $13, $14)
      RETURNING id;
    `;

        const bookingResult = await pool.query(bookingQuery, [
          reference,
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
        ]);

        const bookingId = bookingResult.rows[0].id;

        // ✅ Insert addons into "BookingAddon" table
        if (addons && addons.length > 0) {
          // Get addon IDs from addon names
          const addonIds = [];
          for (const addonName of addons) {
            const addonResult = await pool.query(
              `SELECT id FROM "Addon" WHERE "addonName" = $1`,
              [addonName]
            );
            if (addonResult.rows.length > 0) {
              addonIds.push(addonResult.rows[0].id);
            } else {
              throw new Error(`Addon '${addonName}' not found.`);
            }
          }

          // Insert addons into BookingAddon table
          if (addonIds.length > 0) {
            const addonQuery = `
        INSERT INTO "BookingAddon" ("bookingId", "addonId")
        VALUES ${addonIds.map((_, index) => `($1, $${index + 2})`).join(", ")}
      `;

            await pool.query(addonQuery, [bookingId, ...addonIds]);
          }
        }

        await client.query("COMMIT"); // Commit transaction
        client.release(); // Release DB connection
      } else {
        booking = bookingResult.rows[0];
      }

      // Prepare the payment request payload
      const paymentRequest = {
        id: reference,
        currency: "KES",
        amount: amount ?? booking.amount,
        description: description,
        callback_url: callbackUrl,
        notification_id: "f0ac0077-baac-4e26-97f7-dc08b374c44d",
        billing_address: {
          email_address: email,
          phone_number: phoneNumber,
          country_code: "KE",
          first_name: first_name,
          last_name: last_name,
        },
      };

      // Send payment request to Pesapal
      const paymentResponse = await axios.post(
        `https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest`,
        paymentRequest,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = {
        order_tracking_id: paymentResponse.data.order_tracking_id,
        merchant_reference: paymentResponse.data.merchant_reference,
        redirect_url: paymentResponse.data.redirect_url,
        status: paymentResponse.data.status,
        error: paymentResponse.data.error,
      };

      return responseData;
    } catch (error) {
      await client.query("ROLLBACK"); // Rollback transaction on error
      client.release(); // Release DB connection
      console.error("Database transaction error:", error);
      return { error: "Failed to create booking.", status: 500 };
    }
  } catch (error) {
    console.error("Pesapal payment initiation error:", error);
    return { error: "Failed to initiate payment with Pesapal.", status: 500 };
  }
};

export const handlePaymentCallback = async (body: any) => {
  const { OrderTrackingId, OrderMerchantReference } = body;

  console.log("toke:", `${await getToken()}`);
  console.log("order nmarchar", OrderMerchantReference);
  console.log("trackingid", OrderTrackingId);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Send payment request to Pesapal
    const statusResponse = await axios.get(
      `https://cybqa.pesapal.com/pesapalv3/api/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`,
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the payment was successful

    console.log("payment response from pesapal", statusResponse);

    const paymentStatus =
      statusResponse.data.status_code === 1 ? "CONFIRMED" : "FAILED";

    if (paymentStatus === "CONFIRMED") {
      if (booking) {
        // Update the booking status when booking is available
        const updateBookingQuery = `
        UPDATE "Booking"
        SET "paymentType" = $1, amount = $2, "paymentStatus" = $3
        WHERE id = $4
        RETURNING id;
      `;
        const updateResult = await client.query(updateBookingQuery, [
          "full",
          statusResponse.data.amount * 2,
          paymentStatus, // Adding paymentStatus to keep it up to date
          booking.id,
        ]);

        if (updateResult.rowCount === 0) {
          throw new Error("Booking not found.");
        }
      } else {
        // Handle case where booking is not found
        const updateBookingQuery = `
        UPDATE "Booking"
        SET "paymentStatus" = $1
        WHERE id = $2
        RETURNING id;
      `;
        const updateResult = await client.query(updateBookingQuery, [
          paymentStatus,
          OrderMerchantReference,
        ]);

        if (updateResult.rowCount === 0) {
          throw new Error("Booking not found.");
        }
      }

      const transactionQuery = `
      INSERT INTO "Transaction" ("bookingId", amount, status, reference, "confirmationCode", "paymentMethod")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;

      const bookingId =
        booking && booking.id ? booking.id : OrderMerchantReference;
      const newTransaction = await client.query(transactionQuery, [
        bookingId,
        statusResponse.data.amount,
        "SUCCESS",
        OrderTrackingId,
        statusResponse.data.confirmation_code,
        statusResponse.data.payment_method,
      ]);

      if (!newTransaction.rows[0]) {
        throw new Error("Error creating transaction.");
      }
    } else if (paymentStatus === "FAILED") {
      // Handle failed payment status
      if (booking) {
        // Update the booking status to "FAILED" when booking is available
        const updateBookingQuery = `
        UPDATE "Booking"
        SET "paymentStatus" = $1
        WHERE id = $2
        RETURNING id;
      `;
        const updateResult = await client.query(updateBookingQuery, [
          paymentStatus,
          booking.id,
        ]);

        if (updateResult.rowCount === 0) {
          throw new Error("Booking not found.");
        }
      } else {
        // Handle case where booking is not found
        const updateBookingQuery = `
        UPDATE "Booking"
        SET "paymentStatus" = $1
        WHERE id = $2
        RETURNING id;
      `;
        const updateResult = await client.query(updateBookingQuery, [
          paymentStatus,
          OrderMerchantReference,
        ]);

        if (updateResult.rowCount === 0) {
          throw new Error("Booking not found.");
        }
      }

      const transactionQuery = `
      INSERT INTO "Transaction" ("bookingId", amount, status, reference, "confirmationCode", "paymentMethod")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;

      const bookingId =
        booking && booking.id ? booking.id : OrderMerchantReference;
      const newTransaction = await client.query(transactionQuery, [
        bookingId,
        statusResponse.data.amount,
        "FAILED", // Mark the transaction as failed
        OrderTrackingId,
        statusResponse.data.confirmation_code,
        statusResponse.data.payment_method,
      ]);

      if (!newTransaction.rows[0]) {
        throw new Error("Error creating transaction.");
      }
    }

    await client.query("COMMIT");

    // Send a response back to Pesapal
    return {
      orderNotificationType: "IPNCHANGE",
      orderTrackingId: OrderTrackingId,
      orderMerchantReference: OrderMerchantReference,
      status: 200,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction failed, rolled back:", error);
    return "Failed to process IPN.";
  } finally {
    client.release();
  }
};

const getToken = async () => {
  const pesapalConsumerKey = "qkio1BGGYAXTu2JOfm7XSXNruoZsrqEW";
  const pesapalConsumerSecret = "osGQ364R49cXKeOYSpaOnT++rHs=";
  const pesapalEndpoint = "https://cybqa.pesapal.com/pesapalv3";

  // Access Token
  try {
    const tokenResponse = await axios.post(
      `${pesapalEndpoint}/api/Auth/RequestToken`,
      {
        consumer_key: pesapalConsumerKey,
        consumer_secret: pesapalConsumerSecret,
      }
    );

    const accessToken = tokenResponse.data.token;

    if (accessToken) {
      return accessToken; // Return the access token
    } else {
      throw new Error("Failed to retrieve access token from Pesapal.");
    }
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
