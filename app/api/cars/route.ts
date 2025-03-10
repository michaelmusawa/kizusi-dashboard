// app/api/cars/route.ts
import { fetchFilteredCars } from "@/app/lib/carActions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "";
  const query = searchParams.get("query") || "";
  const limit = searchParams.get("limit") || "";

  console.log("the request for cars", filter, query, limit);
  try {
    const cars = await fetchFilteredCars(filter, query, limit);
    return NextResponse.json(cars);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}
