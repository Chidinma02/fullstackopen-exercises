"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type NotificationType = "success" | "error" | "info";

export interface NotificationState {
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  notification: NotificationState | null;
  notify: (message: string, type?: NotificationType, durationMs?: number) => void;
  clearNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notification, setNotificationState] = useState<NotificationState | null>(
    null,
  );

  const clearNotification = useCallback(() => {
    setNotificationState(null);
  }, []);

  const notify = useCallback(
    (
      message: string,
      type: NotificationType = "success",
      durationMs: number = 5000,
    ) => {
      setNotificationState({ message, type });
      setTimeout(() => {
        setNotificationState((current) => {
          if (current?.message === message) {
            return null;
          }
          return current;
        });
      }, durationMs);
    },
    [],
  );

  return (
    <NotificationContext.Provider
      value={{ notification, notify, clearNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
