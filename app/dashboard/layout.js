"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LayoutPrivate({ children }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      const loginStatus = localStorage.getItem("loginStatus");
      if (loginStatus !== "200") {
        router.push("/#pricing");
      }
    }
  }, [router]);

  // Only render children if `localStorage` is accessible and loginStatus is valid
  if (!isClient || typeof window === "undefined") {
    return null;
  }

  return <>{localStorage.getItem("loginStatus") === "200" ? children : null}</>;
}
