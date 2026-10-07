import { notFound } from "next/navigation";
import { getBlogById } from "@/lib/blogs";
import { likeBlogAction } from "@/lib/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";


export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blogId = Number(id);
  const blog = getBlogById(blogId);

  if (!blog) {
    notFound();
  }

  return (
    <div className="py-8 max-w-2xl">
      <Link
        href="/blogs"
        className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 mb-6 inline-block"
      >
        &larr; Back to blogs
      </Link>
      <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800 space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {blog.title}
        </h1>
        <p className="text-base text-zinc-700 dark:text-zinc-300">
          Author: <span className="font-semibold">{blog.author}</span>
        </p>
        <p className="text-base text-zinc-700 dark:text-zinc-300">
          URL:{" "}
          <a
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {blog.url}
          </a>
        </p>
        <div className="flex items-center gap-4 pt-2">
          <span className="text-base text-zinc-800 dark:text-zinc-200 font-medium">
            {blog.likes} {blog.likes === 1 ? "like" : "likes"}
          </span>
          <form action={likeBlogAction}>
            <input type="hidden" name="id" value={blog.id} />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Like
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
