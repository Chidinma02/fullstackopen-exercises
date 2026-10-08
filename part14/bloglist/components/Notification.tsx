"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";

export default function Notification() {
  const { notification, notify, clearNotification } = useNotification();
  const pathname = usePathname();

  useEffect(() => {
    // Check if there is a notification cookie set by server actions
    const cookies = document.cookie.split("; ");
    const notifCookie = cookies.find((c) => c.startsWith("notification="));
    if (notifCookie) {
      const val = notifCookie.split("=").slice(1).join("=");
      const message = decodeURIComponent(val);
      document.cookie = "notification=; path=/; max-age=0";
      if (message) {
        notify(message, "success");
      }
    }
  }, [pathname, notify]);

  if (!notification) {
    return null;
  }

  const colorStyles =
    notification.type === "error"
      ? "bg-red-50 text-red-800 border-red-300 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
      : notification.type === "info"
        ? "bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800"
        : "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4">
      <div
        data-testid="notification"
        className={`flex items-center justify-between p-4 border rounded-lg shadow-sm text-sm font-medium transition-all ${colorStyles}`}
      >
        <span>{notification.message}</span>
        <button
          onClick={clearNotification}
          className="ml-4 text-xs font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
