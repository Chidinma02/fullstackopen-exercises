import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, readingLists } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateTokenAction, markAsReadAction } from "@/lib/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = Number(session.user.id);
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!currentUser) {
    redirect("/login");
  }

  const userReadingList = await db.query.readingLists.findMany({
    where: eq(readingLists.userId, userId),
    with: {
      blog: true,
    },
  });

  const unreadList = userReadingList.filter((item) => !item.read);
  const readList = userReadingList.filter((item) => item.read);
  const isReadingListEmpty = userReadingList.length === 0;

  return (
    <div className="py-8 max-w-3xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
          Personal Dashboard
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Manage your profile, API developer credentials, and reading list.
        </p>
      </div>

      {/* User Profile Section */}
      <section
        data-testid="user-profile"
        className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xs"
      >
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 pb-3 border-b border-gray-100 dark:border-zinc-800">
          User Profile
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-zinc-500 dark:text-zinc-400 block text-xs uppercase tracking-wider mb-1">
              Name
            </span>
            <span
              data-testid="user-name"
              className="text-base font-medium text-zinc-900 dark:text-zinc-100"
            >
              {currentUser.name}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 dark:text-zinc-400 block text-xs uppercase tracking-wider mb-1">
              Username
            </span>
            <span
              data-testid="user-username"
              className="text-base font-mono text-zinc-800 dark:text-zinc-200"
            >
              {currentUser.username}
            </span>
          </div>
        </div>
      </section>

      {/* API Token Section */}
      <section
        data-testid="api-token-section"
        className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xs space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              API Token
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Use this bearer token to authenticate programmatic requests to <code className="text-blue-600 dark:text-blue-400 font-mono">/api/me</code>.
            </p>
          </div>
          <form action={generateTokenAction}>
            <button
              type="submit"
              data-testid="generate-token-button"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors cursor-pointer shadow-xs"
            >
              {currentUser.token ? "Regenerate Token" : "Generate Token"}
            </button>
          </form>
        </div>

        {currentUser.token ? (
          <div data-testid="token-display" className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800 flex items-center justify-between">
            <code
              data-testid="api-token"
              className="font-mono text-sm text-blue-600 dark:text-blue-400 break-all select-all"
            >
              {currentUser.token}
            </code>
          </div>
        ) : (
          <div
            data-testid="no-token-message"
            className="p-4 text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/50 rounded-lg border border-dashed border-gray-300 dark:border-zinc-800"
          >
            No token has been generated yet. Click the button above to generate one.
          </div>
        )}
      </section>

      {/* Reading List Section */}
      <section
        data-testid="reading-list-section"
        className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xs space-y-6"
      >
        <div className="pb-3 border-b border-gray-100 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Reading List
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Articles and blogs you have saved to read or mark as finished.
          </p>
        </div>

        {isReadingListEmpty ? (
          <div
            data-testid="empty-reading-list"
            className="p-8 text-center border border-dashed border-gray-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-500 dark:text-zinc-400"
          >
            Your reading list is currently empty. Visit the <Link href="/blogs" className="text-blue-600 dark:text-blue-400 hover:underline">blogs page</Link> to add some!
          </div>
        ) : (
          <div className="space-y-6">
            {/* Unread Section */}
            <div data-testid="unread-section" className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Unread ({unreadList.length})
              </h3>
              {unreadList.length === 0 ? (
                <p
                  data-testid="no-unread-blogs"
                  className="p-4 text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 rounded-lg border border-gray-200 dark:border-zinc-800"
                >
                  No unread blogs.
                </p>
              ) : (
                <div className="space-y-2">
                  {unreadList.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-zinc-50 dark:bg-zinc-950/60 border border-gray-200 dark:border-zinc-800 rounded-lg flex items-center justify-between gap-4"
                    >
                      <div>
                        <Link
                          href={`/blogs/${item.blog.id}`}
                          className="font-medium text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {item.blog.title}
                        </Link>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          by {item.blog.author}
                        </p>
                      </div>
                      <form action={markAsReadAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          data-testid={`mark-read-${item.id}`}
                          className="px-3 py-1.5 text-xs font-semibold rounded-md bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                        >
                          Mark as read
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Read Section */}
            <div data-testid="read-section" className="space-y-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Read ({readList.length})
              </h3>
              {readList.length === 0 ? (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  No read blogs yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {readList.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-zinc-50 dark:bg-zinc-950/30 border border-gray-200/80 dark:border-zinc-800/60 rounded-lg flex items-center justify-between gap-4 opacity-75"
                    >
                      <div>
                        <Link
                          href={`/blogs/${item.blog.id}`}
                          className="font-medium text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {item.blog.title}
                        </Link>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          by {item.blog.author}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded">
                        ✓ Read
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
