"use client";

import { SessionProvider } from "next-auth/react";

export default function LayoutPrivate({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
