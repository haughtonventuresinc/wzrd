"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ButtonAccount from "@/components/ButtonAccount";
import Sidebar from "./components/Sidebar";
import ActiveTab from "./components/ActiveTab";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeContent, setActiveContent] = useState("wizardGpt");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Check if user is authenticated
    if (status === "loading") {
      // Session is still loading, wait
      return;
    }
    
    if (status === "unauthenticated") {
      // User is not authenticated, redirect to login
      console.log("User not authenticated, redirecting to login");
      router.push("/login");
      return;
    }
    
    // User is authenticated
    console.log("User authenticated:", session?.user?.email);
    setIsLoading(false);
    
    // Also check localStorage as a fallback
    const storedEmail = localStorage.getItem("userEmail");
    if (!session?.user?.email && !storedEmail) {
      console.log("No user email found in session or localStorage");
      router.push("/login");
    }
  }, [status, session, router]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 pb-24">
      <div className="flex justify-between items-center mb-6">
        <a href="#" className="md:hidden text-2xl" onClick={toggleSidebar}>
          &#8801;
        </a>
        <div className="ml-auto">
          <p className="text-sm text-gray-600 mb-1">
            Logged in as: {session?.user?.email || localStorage.getItem("userEmail") || "User"}
          </p>
        </div>
      </div>
      
      <Sidebar
        isOpen={isOpen}
        setActiveContent={setActiveContent}
        toggleSidebar={toggleSidebar}
      />
      <ActiveTab activeContent={activeContent} />
    </main>
  );
}
