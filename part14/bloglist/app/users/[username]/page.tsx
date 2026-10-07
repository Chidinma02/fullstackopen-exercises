import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/users";

export const dynamic = "force-dynamic";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  return (
    <div className="py-8 max-w-2xl">
      <Link
        href="/users"
        className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 mb-6 inline-block"
      >
        &larr; Back to users
      </Link>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
        {user.name}
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-6 font-mono text-sm">
        @{user.username}
      </p>

      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
        Added blogs
      </h2>

      {user.blogs.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No blogs added yet.</p>
      ) : (
        <ul className="space-y-3">
          {user.blogs.map((blog) => (
            <li
              key={blog.id}
              className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800 flex justify-between items-center"
            >
              <div>
                <Link
                  href={`/blogs/${blog.id}`}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {blog.title}
                </Link>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2">
                  by {blog.author}
                </span>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                ❤️ {blog.likes}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
