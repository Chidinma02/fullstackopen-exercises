"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser, RegisterActionState } from "@/lib/actions";

const initialState: RegisterActionState = {};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState
  );

  return (
    <div className="py-12 max-w-md mx-auto">
      <div className="bg-white dark:bg-zinc-900 p-8 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-zinc-100">
          Create an Account
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          Register to publish and curate your blog reading list.
        </p>

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              defaultValue={state?.values?.username || ""}
              className="w-full px-3.5 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
            />
            {state?.errors?.username && (
              <p
                data-testid="username-error"
                className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium"
              >
                {state.errors.username}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={state?.values?.name || ""}
              className="w-full px-3.5 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your full name"
            />
            {state?.errors?.name && (
              <p
                data-testid="name-error"
                className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium"
              >
                {state.errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3.5 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="At least 4 characters"
            />
            {state?.errors?.password && (
              <p
                data-testid="password-error"
                className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium"
              >
                {state.errors.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              required
              className="w-full px-3.5 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
            />
            {state?.errors?.passwordConfirm && (
              <p
                data-testid="passwordConfirm-error"
                className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium"
              >
                {state.errors.passwordConfirm}
              </p>
            )}
          </div>

          <button
            type="submit"
            data-testid="register-button"
            disabled={isPending}
            className="w-full py-2.5 px-4 rounded-md bg-zinc-900 text-white font-medium hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            {isPending ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
