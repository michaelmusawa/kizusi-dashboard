// app/api/payments/callback/route.ts
import { handleCallbackFlow } from "@/app/lib/payment/services/transaction";
// import { handlePaymentCallback } from "@/app/lib/paymentActions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const callbackResponse = await handleCallbackFlow(body);
    return NextResponse.json(callbackResponse);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Payment callback failed" },
      { status: 500 }
    );
  }
}
