import Link from "next/link";
import { getBlogs } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const blogs = getBlogs(filter);

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
        <Link
          href="/blogs/new"
          className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
        >
          New Blog
        </Link>
      </div>

      <form method="GET" action="/blogs" className="mb-8 flex gap-3 max-w-md">
        <input
          type="text"
          name="filter"
          defaultValue={filter || ""}
          placeholder="Filter by title..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-md bg-zinc-900 text-white font-medium hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          Search
        </button>
        {filter && (
          <Link
            href="/blogs"
            className="px-4 py-2 rounded-md border border-gray-300 text-zinc-700 hover:bg-gray-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 text-sm flex items-center"
          >
            Clear
          </Link>
        )}
      </form>

      {blogs.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No blogs found.</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                <Link
                  href={`/blogs/${blog.id}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {blog.title}
                </Link>
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                by <span className="font-medium">{blog.author}</span>
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <a
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {blog.url}
                </a>
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                  ❤️ {blog.likes} {blog.likes === 1 ? "like" : "likes"}
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                  id: {blog.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
