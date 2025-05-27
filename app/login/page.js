"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import config from "@/config";
import Link from "next/link";
import axios from "axios";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    
    // Password validation for signup and login
    if (!forgotPassword && (password.length < 6)) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }
    
    // Password reset mode with token
    if (forgotPassword && resetToken) {
      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters long");
        setIsLoading(false);
        return;
      }
      
      try {
        // Use local backend for testing
// Use the correct backend URL
const BACKEND_API = process.env.NODE_ENV === 'production' ? 'https://index-wzrdbackend-production.up.railway.app' : 'http://localhost:3001';
        const response = await axios.post(`${BACKEND_API}/api/v1/users/reset-password`, {
          token: resetToken,
          password: newPassword
        }, {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        setSuccessMessage("Password has been reset successfully. You can now log in with your new password.");
        setForgotPassword(false);
        setResetToken("");
        setNewPassword("");
        setIsLoginMode(true);
        setIsLoading(false);
        return;
      } catch (error) {
        console.error("Password reset error:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Failed to reset password. Token may be invalid or expired.");
        setIsLoading(false);
        return;
      }
    }
    
    // Forgot password mode (requesting reset token)
    if (forgotPassword && !resetToken) {
      try {
        // Use local backend for testing
// Use the correct backend URL
const BACKEND_API = process.env.NODE_ENV === 'production' ? 'https://index-wzrdbackend-production.up.railway.app' : 'http://localhost:3001';
        const response = await axios.post(`${BACKEND_API}/api/v1/users/forgot-password`, {
          email
        }, {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        setSuccessMessage("Password reset instructions have been sent. Please check your email and enter the reset token below.");
        setResetToken(""); // Clear any existing token
        setIsLoading(false);
        return;
      } catch (error) {
        console.error("Forgot password error:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Failed to process password reset request.");
        setIsLoading(false);
        return;
      }
    }
    
    try {
      // Use local backend for testing
// Use the correct backend URL
const BACKEND_API = process.env.NODE_ENV === 'production' ? 'https://index-wzrdbackend-production.up.railway.app' : 'http://localhost:3001';
      
      // Login mode
      if (isLoginMode) {
        try {
          const loginResponse = await axios.post(`${BACKEND_API}/api/v1/users/login`, {
            email,
            password
          }, {
            timeout: 15000,
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          console.log("Login response:", loginResponse.data);
          
          if (loginResponse.data.success) {
            // Store user data
            localStorage.setItem("user", JSON.stringify(loginResponse.data.data));
            
            // Sign in with credentials
            const signInResult = await signIn("credentials", {
              email,
              password,
              redirect: false,
            });
            
            if (signInResult?.error) {
              setError("Authentication failed. Please try again.");
              setIsLoading(false);
              return;
            }
            
            // Redirect to dashboard after successful authentication
            console.log("Authentication successful, redirecting to dashboard...");
            setIsLoading(false);
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Login error:", error.response?.data || error.message);
          setError(error.response?.data?.message || "Invalid email or password. Please try again.");
          setIsLoading(false);
        }
      } 
      // Signup mode
      else {
        try {
          const signupResponse = await axios.post(`${BACKEND_API}/api/v1/users/signup`, {
            email,
            password
          }, {
            timeout: 15000,
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          console.log("Signup response:", signupResponse.data);
          
          if (signupResponse.data.success) {
            setSuccessMessage("Account created successfully! You can now log in.");
            setIsLoginMode(true);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Signup error:", error.response?.data || error.message);
          if (error.response?.status === 409) {
            setError("This email is already registered. Please log in instead.");
            setIsLoginMode(true);
          } else {
            setError(error.response?.data?.message || "Failed to create account. Please try again.");
          }
          setIsLoading(false);
          return;
        }
      }
      
      // If we get here, something went wrong
      setError("Failed to authenticate. Please try again or contact support.");
      setIsLoading(false);
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

  // Toggle between login and signup modes
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
    setSuccessMessage("");
  };
  
  // Toggle forgot password mode
  const toggleForgotPassword = () => {
    setForgotPassword(!forgotPassword);
    setResetToken("");
    setNewPassword("");
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-6 text-center font-bold">
          {forgotPassword 
            ? (resetToken ? "Reset Password" : "Forgot Password") 
            : (isLoginMode ? "Login" : "Sign Up")}
        </h2>
        
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
        
        <form onSubmit={handleSubmit} className="mb-6">
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
          
          {/* Password field - show for login, signup, and reset password */}
          {(!forgotPassword || resetToken) && (
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {resetToken ? "New Password" : "Password"}
              </label>
              <div className="relative">
                <input
                  type={resetToken ? (showNewPassword ? "text" : "password") : (showPassword ? "text" : "password")}
                  id={resetToken ? "newPassword" : "password"}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                  value={resetToken ? newPassword : password}
                  onChange={(e) => resetToken ? setNewPassword(e.target.value) : setPassword(e.target.value)}
                  placeholder={resetToken ? "Enter new password" : "Enter your password"}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => resetToken ? setShowNewPassword(!showNewPassword) : setShowPassword(!showPassword)}
                >
                  {resetToken ? 
                    (showNewPassword ? 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    : 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )
                  : 
                    (showPassword ? 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    : 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )
                  }
                </button>
              </div>
            </div>
          )}
          
          {/* Reset token field - only show when in forgot password mode and after requesting token */}
          {forgotPassword && successMessage && !resetToken && (
            <div className="mb-4">
              <label
                htmlFor="resetToken"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reset Token
              </label>
              <input
                type="text"
                id="resetToken"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Enter reset token from email"
              />
            </div>
          )}
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-800 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : (
              forgotPassword 
                ? (resetToken ? "Reset Password" : "Request Reset Link")
                : (isLoginMode ? "Login" : "Sign Up")
            )}
          </button>
        </form>
        
        {/* Toggle between login and signup */}
        {!forgotPassword && (
          <div className="text-center text-sm text-gray-500 mb-4">
            <p>
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={toggleMode} 
                className="text-indigo-600 hover:text-indigo-500 font-medium"
                type="button"
              >
                {isLoginMode ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        )}
        
        {/* Forgot password link */}
        {!forgotPassword && isLoginMode ? (
          <div className="text-center text-sm text-gray-500 mb-4">
            <button 
              onClick={toggleForgotPassword} 
              className="text-indigo-600 hover:text-indigo-500 font-medium"
              type="button"
            >
              Forgot your password?
            </button>
          </div>
        ) : forgotPassword ? (
          <div className="text-center text-sm text-gray-500 mb-4">
            <button 
              onClick={toggleForgotPassword} 
              className="text-indigo-600 hover:text-indigo-500 font-medium"
              type="button"
            >
              Back to login
            </button>
          </div>
        ) : null}
        
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
