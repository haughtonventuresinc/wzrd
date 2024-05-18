"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LayoutPrivate({ children }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      const buyerName = localStorage.getItem("buyerName");
      if (!buyerName) {
        router.push("/#pricing");
      }
    }
  }, [router]);

  // Only render children if `localStorage` is accessible and buyerName exists
  if (!isClient || typeof window === "undefined") {
    return null;
  }

  return <>{localStorage.getItem("buyerName") ? children : null}</>;
}
