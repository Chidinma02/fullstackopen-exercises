"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createBlogAction, BlogActionState } from "@/lib/actions";

const initialState: BlogActionState = {};

export default function NewBlogPage() {
  const [state, formAction, isPending] = useActionState(
    createBlogAction,
    initialState
  );

  return (
    <div className="py-8 max-w-lg mx-auto">
      <Link
        href="/blogs"
        className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 mb-6 inline-flex items-center gap-1 transition-colors"
      >
        &larr; Back to blogs
      </Link>
      <h1 className="text-3xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-zinc-100">
        Create New Blog
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        Share an article or tutorial with the community.
      </p>

      <form action={formAction} noValidate className="space-y-5 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-xs">
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
            defaultValue={state?.values?.title || ""}
            className="w-full px-3.5 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Blog Title (at least 5 characters)"
          />
          {state?.errors?.title && (
            <p
              data-testid="title-error"
              className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium"
            >
              {state.errors.title}
            </p>
          )}
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
            defaultValue={state?.values?.author || ""}
            className="w-full px-3.5 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Author Name (at least 5 characters)"
          />
          {state?.errors?.author && (
            <p
              data-testid="author-error"
              className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium"
            >
              {state.errors.author}
            </p>
          )}
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
            defaultValue={state?.values?.url || ""}
            className="w-full px-3.5 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="https://example.com/article"
          />
          {state?.errors?.url && (
            <p
              data-testid="url-error"
              className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium"
            >
              {state.errors.url}
            </p>
          )}
        </div>

        <button
          type="submit"
          data-testid="create-blog-button"
          disabled={isPending}
          className="w-full px-5 py-2.5 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors cursor-pointer text-sm"
        >
          {isPending ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
