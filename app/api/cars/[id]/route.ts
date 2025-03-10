// app/api/cars/[id]/route.ts

import { getCarById } from "@/app/lib/carActions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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
    const car = await getCarById(id);
    if (!car) {
      return NextResponse.json({ message: "Car not found" });
    }
    return NextResponse.json(car);
  } catch (error) {
    console.error("Error fetching car by ID:", error);
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}
