"use client";
import React, { useState } from "react";
import ButtonAccount from "@/components/ButtonAccount";
import Sidebar from "./components/Sidebar";
import ActiveTab from "./components/ActiveTab";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeContent, setActiveContent] = useState("wizardGpt");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <main className="min-h-screen p-8 pb-24">
      <div>
        <a href="#" className="md:hidden text-2xl" onClick={toggleSidebar}>
          &#8801;
        </a>
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
