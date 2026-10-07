"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { likeBlog, addBlog } from "./blogs";

export async function likeBlogAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!isNaN(id)) {
    await likeBlog(id);
    revalidatePath(`/blogs/${id}`);
    revalidatePath("/blogs");
  }
}

export async function createBlogAction(formData: FormData) {
  const title = (formData.get("title")?.toString() || "").trim();
  const author = (formData.get("author")?.toString() || "").trim();
  const url = (formData.get("url")?.toString() || "").trim();

  await addBlog({ title, author, url });
  revalidatePath("/blogs");
  redirect("/blogs");
}

export const createBlog = createBlogAction;

