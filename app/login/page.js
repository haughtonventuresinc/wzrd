"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import config from "@/config";
import Link from "next/link";
import axios from "axios";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    
    try {
      // Define the callback URL
      const callbackUrl = "/dashboard";
      
      setSuccessMessage("Checking user account...");
      
      // Check if the user exists in MongoDB or create them
      const checkUserResponse = await axios.post("/api/auth/check-user", {
        email,
      }, {
        // Set a timeout for the request
        timeout: 10000 // 10 seconds
      });
      
      if (checkUserResponse.data.success) {
        // Store the email in localStorage for persistence
        localStorage.setItem("userEmail", email);
        
        setSuccessMessage("User verified successfully, signing in...");
        console.log("User verified successfully, now signing in...");
        
        // Sign in with credentials and force redirect
        await signIn("credentials", {
          email,
          redirect: true,
          callbackUrl: callbackUrl
        });
        
        // The above should redirect, but just in case it doesn't
        // we'll add a manual redirect after a short delay
        setTimeout(() => {
          console.log("Fallback redirect to dashboard");
          window.location.href = callbackUrl;
        }, 1000);
        
        return; // Early return since we're redirecting
      } else {
        setError("Email not found in our database. Please try again or contact support.");
      }
    } catch (error) {
      console.error("Login failed", error);
      
      // Check if it's a timeout error
      if (error.code === "ECONNABORTED" || (error.response && error.response.status === 504)) {
        setError("Database connection timed out. This might be due to slow internet or server issues. Please try again.");
      } else if (error.response && error.response.data && error.response.data.message) {
        // Use the error message from the server if available
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: config.auth.callbackUrl || "/dashboard",
      });
    } catch (error) {
      console.error("Google login failed", error);
      setIsLoading(false);
      setError("Google login failed. Please try again.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-6 text-center font-bold">Login or Register</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleEmailLogin} className="mb-6">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-800 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login with Email"}
          </button>
        </form>
        
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>
        
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
          disabled={isLoading}
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          {isLoading ? "Processing..." : "Continue with Google"}
        </button>
        
        <div className="text-center text-sm text-gray-500">
          <p className="mt-2">
            <Link href="/" className="text-indigo-600 hover:text-indigo-500">
              Return to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
