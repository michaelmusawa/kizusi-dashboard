// app/api/payments/route.ts
import { initiateBookingFlow } from "@/app/lib/payment/services/booking";
// import { initiatePayment } from "@/app/lib/paymentActions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paymentResponse = await initiateBookingFlow(body);

    return NextResponse.json(paymentResponse);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Payment initiation failed" },
      { status: 500 }
    );
  }
}
