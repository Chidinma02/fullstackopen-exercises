import { NextResponse } from "next/server";
import { db } from "@/db";
import { blogs, users, readingLists } from "@/db/schema";

export async function DELETE() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 403 }
    );
  }

  // Delete in order of dependencies (readingLists -> blogs -> users)
  await db.delete(readingLists);
  await db.delete(blogs);
  await db.delete(users);

  return NextResponse.json({ message: "Database reset successful" });
}
