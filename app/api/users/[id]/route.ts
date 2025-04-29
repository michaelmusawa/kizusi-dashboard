// app/api/users/[id]/route.ts
import { getUserById, updateUserById } from "@/app/lib/userActions";
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
    const user = await getUserById(id);
    if (!user) {
      console.log("im here");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

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
    const body = await request.json();
    console.log("body", body);
    const updatedUser = await updateUserById(id, body);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
