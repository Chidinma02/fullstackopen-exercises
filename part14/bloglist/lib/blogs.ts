import { db } from "@/db";
import { blogs, Blog } from "@/db/schema";
import { desc, eq, ilike, sql } from "drizzle-orm";

export type { Blog };

export async function getBlogs(filter?: string): Promise<Blog[]> {
  if (filter) {
    return db
      .select()
      .from(blogs)
      .where(ilike(blogs.title, `%${filter}%`))
      .orderBy(desc(blogs.likes));
  }
  return db.select().from(blogs).orderBy(desc(blogs.likes));
}

export async function getBlogById(id: number): Promise<Blog | undefined> {
  const result = await db.select().from(blogs).where(eq(blogs.id, id));
  return result[0];
}

export async function likeBlog(id: number): Promise<void> {
  await db
    .update(blogs)
    .set({ likes: sql`${blogs.likes} + 1` })
    .where(eq(blogs.id, id));
}

export async function addBlog(blog: {
  title: string;
  author: string;
  url: string;
  userId?: number;
}): Promise<Blog> {
  const [newBlog] = await db
    .insert(blogs)
    .values({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: 0,
      userId: blog.userId,
    })
    .returning();
  return newBlog;
}
