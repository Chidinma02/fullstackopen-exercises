import { notFound } from "next/navigation";
import { getBlogById } from "@/lib/blogs";
import { likeBlogAction, addToReadingListAction } from "@/lib/actions";
import { auth } from "@/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blogId = Number(id);
  const blog = await getBlogById(blogId);

  if (!blog) {
    notFound();
  }

  const session = await auth();
  const currentUserId = session?.user?.id ? Number(session.user.id) : null;
  const isCreator = currentUserId !== null && blog.userId === currentUserId;
  const canAddToReadingList = !!session?.user && !isCreator;

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <Link
        href="/blogs"
        className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 mb-6 inline-flex items-center gap-1 transition-colors"
      >
        &larr; Back to blogs
      </Link>

      <div
        data-testid="blog-detail"
        className="p-8 border border-gray-200 rounded-xl bg-white shadow-xs dark:bg-zinc-900 dark:border-zinc-800 space-y-6"
      >
        <div>
          <h1
            data-testid="blog-title"
            className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight"
          >
            {blog.title}
          </h1>
          <p
            data-testid="blog-author"
            className="text-base text-zinc-600 dark:text-zinc-400 mt-2"
          >
            Author: <span className="font-semibold text-zinc-900 dark:text-zinc-200">{blog.author}</span>
          </p>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-950/60 rounded-lg border border-gray-100 dark:border-zinc-800/80">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">
            Website URL
          </span>
          <a
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400 text-sm font-medium break-all"
          >
            {blog.url}
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
              ❤️ {blog.likes} {blog.likes === 1 ? "like" : "likes"}
            </span>
            <form action={likeBlogAction}>
              <input type="hidden" name="id" value={blog.id} />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
              >
                Like
              </button>
            </form>
          </div>

          {canAddToReadingList && (
            <form action={addToReadingListAction}>
              <input type="hidden" name="blogId" value={blog.id} />
              <button
                type="submit"
                data-testid="add-to-reading-list-button"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
              >
                Add to reading list
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
