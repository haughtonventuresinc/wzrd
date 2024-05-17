"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LayoutPrivate({ children }) {
  const router = useRouter();

  useEffect(() => {
    const buyerName = localStorage.getItem("buyerName");
    if (!buyerName) {
      router.push("/#pricing");
    }
  }, []);

  return <>{localStorage.getItem("buyerName") ? children : null}</>;
}
