"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { blogs, users, readingLists } from "@/db/schema";
import { likeBlog, addBlog } from "./blogs";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";

export async function likeBlogAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!isNaN(id)) {
    await likeBlog(id);
    revalidatePath(`/blogs/${id}`);
    revalidatePath("/blogs");
  }
}

export type BlogActionState = {
  errors?: {
    title?: string;
    author?: string;
    url?: string;
  };
  values?: {
    title?: string;
    author?: string;
    url?: string;
  };
};

export async function createBlogAction(
  prevState: BlogActionState | undefined,
  formData: FormData
): Promise<BlogActionState> {
  const title = (formData.get("title")?.toString() || "").trim();
  const author = (formData.get("author")?.toString() || "").trim();
  const url = (formData.get("url")?.toString() || "").trim();

  const errors: Record<string, string> = {};

  if (!title || title.length < 5) {
    errors.title = "Title must be at least 5 characters long";
  }
  if (!author || author.length < 5) {
    errors.author = "Author must be at least 5 characters long";
  }
  if (!url || url.length < 5) {
    errors.url = "URL must be at least 5 characters long";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: { title, author, url },
    };
  }

  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : undefined;

  const newBlog = await addBlog({
    title,
    author,
    url,
    userId,
  });

  // Exercise 20: Each blog that a user adds is added by default to the reading list
  if (userId && newBlog) {
    await db.insert(readingLists).values({
      userId,
      blogId: newBlog.id,
      read: false,
    });
  }

  // Set notification cookie for the client to display
  const cookieStore = await cookies();
  cookieStore.set("notification", `A new blog '${newBlog.title}' by ${newBlog.author} added`, {
    path: "/",
    maxAge: 10,
  });

  revalidatePath("/blogs");
  revalidatePath("/me");
  redirect("/blogs");
}

export const createBlog = createBlogAction;

export type RegisterActionState = {
  errors?: {
    username?: string;
    name?: string;
    password?: string;
    passwordConfirm?: string;
  };
  values?: {
    username?: string;
    name?: string;
  };
};

export async function registerUser(
  prevState: RegisterActionState | undefined,
  formData: FormData
): Promise<RegisterActionState> {
  const username = (formData.get("username")?.toString() || "").trim();
  const name = (formData.get("name")?.toString() || "").trim();
  const password = formData.get("password")?.toString() || "";
  const passwordConfirm = formData.get("passwordConfirm")?.toString() || "";

  const errors: Record<string, string> = {};

  if (!username || username.length < 4) {
    errors.username = "Username must be at least 4 characters long";
  }

  if (!name || name.length === 0) {
    errors.name = "Name is required";
  }

  if (!password || password.length < 4) {
    errors.password = "Password must be at least 4 characters long";
  }

  if (password !== passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: { username, name },
    };
  }

  // Check if username already exists in database
  const existingUser = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (existingUser) {
    return {
      errors: { username: "Username already exists" },
      values: { username, name },
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.insert(users).values({
    username,
    name,
    passwordHash,
  });

  redirect("/login");
}

export async function generateTokenAction() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = Number(session.user.id);
  const newToken = crypto.randomUUID();

  await db
    .update(users)
    .set({ token: newToken })
    .where(eq(users.id, userId));

  revalidatePath("/me");
}

export async function addToReadingListAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const blogId = Number(formData.get("blogId"));
  const userId = Number(session.user.id);

  if (!blogId || isNaN(blogId)) {
    throw new Error("Invalid blog ID");
  }

  // Check if already in reading list
  const existing = await db.query.readingLists.findFirst({
    where: and(
      eq(readingLists.userId, userId),
      eq(readingLists.blogId, blogId)
    ),
  });

  if (!existing) {
    await db.insert(readingLists).values({
      userId,
      blogId,
      read: false,
    });
  }

  revalidatePath(`/blogs/${blogId}`);
  revalidatePath("/me");
}

export async function markAsReadAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const id = Number(formData.get("id"));
  const userId = Number(session.user.id);

  if (!id || isNaN(id)) {
    throw new Error("Invalid reading list item ID");
  }

  await db
    .update(readingLists)
    .set({ read: true })
    .where(and(eq(readingLists.id, id), eq(readingLists.userId, userId)));

  revalidatePath("/me");
}
