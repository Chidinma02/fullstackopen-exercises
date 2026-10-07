import { db } from "@/db";
import { users, User } from "@/db/schema";
import { eq } from "drizzle-orm";

export type { User };

export async function getUsers() {
  const allUsers = await db.query.users.findMany({
    with: {
      blogs: true,
    },
  });
  return allUsers;
}

export async function getUserByUsername(username: string) {
  return db.query.users.findFirst({
    where: eq(users.username, username),
    with: {
      blogs: true,
    },
  });
}
