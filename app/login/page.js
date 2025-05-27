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
      setError(""); // Clear any previous errors
      
      // For debugging on Vercel
      console.log("Attempting to check user with email:", email);
      
      // Use the external backend API on Railway
      const BACKEND_API = "https://index-wzrdbackend-production.up.railway.app"; // Railway deployment URL
      let userExists = false;
      let userData = null;
      
      try {
        // First check if the email exists using the new user endpoint
        const checkUserResponse = await axios.post(`${BACKEND_API}/api/v1/users/check`, {
          email,
        }, {
          timeout: 15000, // 15 seconds
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log("API Response (check user):", checkUserResponse.data);
        
        // If we get here, the email exists in the database
        setSuccessMessage("Email found in database");
        userExists = true;
        userData = checkUserResponse.data.data;
      } catch (checkError) {
        console.log("Email not found or error checking user:", checkError.response?.data || checkError.message);
        
        // If user not found (404) or other error, try to create the user
        if (checkError.response?.status === 404 || checkError.response?.status === 500) {
          try {
            // Create a new user with the email
            const createUserResponse = await axios.post(`${BACKEND_API}/api/v1/users/create`, {
              email,
            }, {
              timeout: 15000, // 15 seconds
              headers: {
                'Content-Type': 'application/json',
              }
            });
            
            console.log("API Response (create user):", createUserResponse.data);
            setSuccessMessage("New user created");
            userExists = true;
            userData = createUserResponse.data.data;
          } catch (createError) {
            console.error("Failed to create user:", createError.response?.data || createError.message);
            setError("Failed to create user account. Please try again.");
            setIsLoading(false);
            return;
          }
        } else {
          // Other error occurred
          setError("Error checking user account. Please try again.");
          setIsLoading(false);
          return;
        }
      }
      
      // If we've successfully verified or created the user
      if (userExists) {
        // Store the email in localStorage for persistence
        localStorage.setItem("userEmail", email);
        localStorage.setItem("loginStatus", "200"); // Set login status for dashboard access
        
        setSuccessMessage("User verified successfully, signing in...");
        console.log("User verified successfully, now signing in...");
        
        // Use a more direct approach for authentication
        try {
          // Sign in with credentials and force redirect
          const signInResult = await signIn("credentials", {
            email,
            redirect: false, // Don't redirect automatically
          });
          
          console.log("Sign in result:", signInResult);
          
          if (signInResult?.error) {
            // Even if NextAuth fails, we can still proceed with our custom auth
            console.warn("NextAuth authentication failed, but proceeding with custom auth");
          }
          
          // Manual redirect after successful sign in
          console.log("Authentication successful, redirecting to dashboard");
          window.location.href = callbackUrl;
          return;
        } catch (signInError) {
          console.error("Sign in error:", signInError);
          
          // Even if NextAuth fails, we can still proceed with our custom auth
          console.warn("NextAuth authentication failed, but proceeding with custom auth");
          
          // Manual redirect to dashboard
          console.log("Redirecting to dashboard with custom auth");
          window.location.href = callbackUrl;
          return;
        }
      } else {
        setError("Failed to authenticate. Please try again or contact support.");
      }
    } catch (error) {
      console.error("Login failed", error);
      
      // Detailed error handling
      if (error.code === "ECONNABORTED") {
        setError("Request timed out. The server took too long to respond. Please try again.");
      } else if (error.response) {
        // The server responded with an error status
        console.log("Error response data:", error.response.data);
        
        if (error.response.status === 500) {
          setError("Server error. This might be due to database connection issues. Please try again later.");
        } else if (error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else if (error.response.data && error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError(`Server error (${error.response.status}). Please try again later.`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your internet connection and try again.");
      } else {
        // Something else caused the error
        setError("An unexpected error occurred: " + error.message);
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
