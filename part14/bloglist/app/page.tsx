import Link from "next/link";

export default function Home() {
  return (
    <div className="py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">
        Welcome to BlogApp
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl">
        This is a Next.js application built as part of the Full Stack Open course.
        Explore the hardcoded list of blogs or manage your favorite reading materials.
      </p>
      <Link
        href="/blogs"
        className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
      >
        View Blogs
      </Link>
    </div>
  );
}
