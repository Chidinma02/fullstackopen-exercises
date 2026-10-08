import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 403 }
    );
  }

  try {
    const { username, name, password } = await request.json();

    if (!username || !name || !password) {
      return NextResponse.json(
        { error: "Username, name, and password are required" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [newUser] = await db
      .insert(users)
      .values({
        username,
        name,
        passwordHash,
      })
      .returning();

    return NextResponse.json(
      {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create user" },
      { status: 500 }
    );
  }
}
