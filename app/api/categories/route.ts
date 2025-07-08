// app/api/categories/route.ts
import { fetchFilteredCategories } from "@/app/lib/categoryActions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await fetchFilteredCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
