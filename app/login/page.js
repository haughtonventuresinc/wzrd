"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.get(
        "https://backend.indexwzrd.com/api/v1/pricing",
        {
          email,
        }
      );
      if (response.status === 200) {
        localStorage.setItem("loginStatus", "200");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login failed", error);
      router.push("/#pricing");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4 text-center">Login</h2>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Login
        </button>
      </div>
    </div>
  );
}
