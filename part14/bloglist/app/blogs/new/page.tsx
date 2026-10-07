import Link from "next/link";
import { createBlogAction } from "@/lib/actions";

export default function NewBlogPage() {
  return (
    <div className="py-8 max-w-lg">
      <Link
        href="/blogs"
        className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 mb-6 inline-block"
      >
        &larr; Back to blogs
      </Link>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Blog</h1>

      <form action={createBlogAction} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
            placeholder="Title"
          />
        </div>

        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Author
          </label>
          <input
            id="author"
            name="author"
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
            placeholder="Author"
          />
        </div>

        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            URL
          </label>
          <input
            id="url"
            name="url"
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
            placeholder="URL"
          />
        </div>

        <button
          type="submit"
          className="w-full px-5 py-2.5 rounded-md bg-zinc-900 text-white font-medium hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          Create
        </button>
      </form>
    </div>
  );
}
