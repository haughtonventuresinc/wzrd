import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/app/icon.png";
import config from "@/config";

const Sidebar = ({ isOpen, toggleSidebar, setActiveContent }) => {
  return (
    <nav
      className={`fixed left-0 top-0 md:block h-full w-[200px] md:w-[300px] bg-black text-white transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "md:translate-x-0 -translate-x-full"
      }`}
    >
      <div className="pl-4 md:pl-10 pt-5">
        {/* Only show the toggle button on small screens */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-2xl"
          aria-label="Toggle Sidebar"
        >
          &#8801;
        </button>
        <Link
          className="flex items-center gap-2 shrink-0 "
          href="/dashboard"
          title={`${config.appName} homepage`}
        >
          <Image
            src={logo}
            alt={`${config.appName} logo`}
            className="w-5 md:w-12"
            placeholder="blur"
            priority={true}
            width={42}
            height={42}
          />
          <span className="font-extrabold text-lg">{config.appName}</span>
        </Link>
      </div>
      <ul className="flex flex-col items-center h-full">
        <li className="my-4">
          <button onClick={() => setActiveContent("wizardGpt")}>
            WizardGPT
          </button>
        </li>
        <li className="my-4">
          <button onClick={() => setActiveContent("riskReward")}>
            Risk Reward
          </button>
        </li>
        <li className="my-4">
          <button onClick={() => setActiveContent("algos")}>Algos</button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
