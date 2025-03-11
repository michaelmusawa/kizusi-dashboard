import { cancelBookingById } from "@/app/lib/bookingAction";
import pool from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(
  request: NextRequest,
  props: {
    params?: Promise<{
      id?: string;
    }>;
  }
) {
  const params = await props.params;
  const id = params?.id || "";

  try {
    const { amount, first_name, last_name, remarks } = await request.json();

    const name = `${first_name} ${last_name}`;

    // Query transactions for the booking
    const transactionsResult = await pool.query(
      `SELECT * FROM "Transaction" WHERE "bookingId" = $1`,
      [id]
    );

    if (transactionsResult.rows.length === 0) {
      return NextResponse.json(
        { message: "No transactions found for booking" },
        { status: 404 }
      );
    }

    const transactions = transactionsResult.rows;
    const refundAmount = transactions.length === 2 ? amount / 2 : amount;

    const refundResponses = [];

    // Pesapal credentials
    const pesapalConsumerKey = "qkio1BGGYAXTu2JOfm7XSXNruoZsrqEW";
    const pesapalConsumerSecret = "osGQ364R49cXKeOYSpaOnT++rHs=";
    const pesapalEndpoint = "https://cybqa.pesapal.com/pesapalv3";

    // Get Pesapal access token
    const tokenResponse = await axios.post(
      `${pesapalEndpoint}/api/Auth/RequestToken`,
      {
        consumer_key: pesapalConsumerKey,
        consumer_secret: pesapalConsumerSecret,
      }
    );

    const accessToken = tokenResponse.data.token;

    if (!accessToken) {
      throw new Error("Failed to retrieve access token from Pesapal.");
    }

    // Process refund for each transaction
    for (const transaction of transactions) {
      const refundRequest = {
        confirmation_code: transaction.confirmationCode, // Ensure this is the correct field
        amount: parseFloat(refundAmount), // Ensure amount is a number
        username: name,
        remarks: remarks,
      };

      console.log("Refund request:", refundRequest);

      try {
        const refundResponse = await axios.post(
          `${pesapalEndpoint}/api/Transactions/RefundRequest`,
          refundRequest,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Refund response:", refundResponse.data);
        refundResponses.push(refundResponse.data);
      } catch (error) {
        console.error("Refund request failed:", error);
        refundResponses.push({
          status: "500",
          message: "Refund request failed",
          error,
        });
      }
    }

    // Check refund responses
    if (refundResponses.some((response) => response.status === "200")) {
      const booking = await cancelBookingById(id);
      if (!booking) {
        return NextResponse.json(
          { message: "Booking not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "Booking cancelled successfully",
          booking,
          refundResponses,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Booking cancellation failed",
          refundResponses,
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
