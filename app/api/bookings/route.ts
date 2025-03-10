// app/api/bookings/route.ts
import { fetchFilteredBookings } from "@/app/lib/bookingAction";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "";
    const query = searchParams.get("query") || "";

    const bookings = await fetchFilteredBookings(filter, query);
    return NextResponse.json(bookings);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
