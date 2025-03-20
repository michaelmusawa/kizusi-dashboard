// app/api/payments/callback/route.ts
import { handlePaymentCallback } from "@/app/lib/paymentActions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("the body", body);
    const callbackResponse = await handlePaymentCallback(body);
    return NextResponse.json(callbackResponse);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Payment callback failed" },
      { status: 500 }
    );
  }
}
