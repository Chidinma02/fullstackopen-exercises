import Link from "next/link";
import { getBlogs } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const blogs = await getBlogs(filter);

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Blogs
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Browse, read, and like insightful articles from authors.
          </p>
        </div>
        <Link
          href="/blogs/new"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors shadow-xs"
        >
          New Blog
        </Link>
      </div>

      <form method="GET" action="/blogs" className="mb-8 flex gap-3 max-w-md">
        <input
          data-testid="filter-input"
          type="text"
          name="filter"
          defaultValue={filter || ""}
          placeholder="Filter by title..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 shadow-2xs"
        />
        <button
          data-testid="search-button"
          type="submit"
          className="px-5 py-2 rounded-lg bg-zinc-900 text-white font-medium text-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors cursor-pointer shadow-xs"
        >
          Search
        </button>
        {filter && (
          <Link
            href="/blogs"
            className="px-4 py-2 rounded-lg border border-gray-300 text-zinc-700 hover:bg-gray-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 text-sm flex items-center transition-colors"
          >
            Clear
          </Link>
        )}
      </form>

      <div data-testid="blogs-list" className="space-y-4">
        {blogs.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-gray-300 dark:border-zinc-800 rounded-xl">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              No blogs found.
            </p>
          </div>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog.id}
              className="p-5 border border-gray-200 rounded-xl bg-white shadow-xs dark:bg-zinc-900 dark:border-zinc-800 transition-all hover:border-gray-300 dark:hover:border-zinc-700"
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
                by <span className="font-medium text-zinc-800 dark:text-zinc-200">{blog.author}</span>
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm pt-3 border-t border-gray-100 dark:border-zinc-800/80">
                <a
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400 text-xs font-mono truncate max-w-xs"
                >
                  {blog.url}
                </a>
                <span className="text-zinc-600 dark:text-zinc-400 font-medium text-xs ml-auto">
                  ❤️ {blog.likes} {blog.likes === 1 ? "like" : "likes"}
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                  #{blog.id}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
