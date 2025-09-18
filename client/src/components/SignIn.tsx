import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setAuthToken } from "../utils/auth";
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface SignInProps {
  onLogin: (success: boolean, userData?: { id: string; email: string; full_name: string }) => void;
  isAuthenticated: boolean;
}

export default function SignIn({ onLogin, isAuthenticated }: SignInProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded credentials
  // const DEMO_USERNAME = "demo";
  // const DEMO_PASSWORD = "SecurePass123!";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Call your backend auth endpoint
      const response = await fetch("http://localhost:8000/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the JWT token
        setAuthToken(data.access_token);
        onLogin(true, data.user);
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Invalid credentials");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
    
    setIsLoading(false);
  };

  // const handleFillDemo = () => {
  //   setUsername(DEMO_USERNAME);
  //   setPassword(DEMO_PASSWORD);
  //   setError("");
  // };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-white relative isolate overflow-hidden">
      {/* Background Pattern */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-gray-200 dark:stroke-white/10"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="signin-pattern"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-gray-50 dark:fill-gray-800/20">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect fill="url(#signin-pattern)" width="100%" height="100%" strokeWidth={0} />
      </svg>
      <div
        aria-hidden="true"
        className="absolute top-10 left-[calc(50%-4rem)] -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:top-[calc(50%-30rem)] lg:left-48 xl:left-[calc(50%-24rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
          }}
          className="aspect-1108/632 w-277 bg-linear-to-r from-[#80caff] to-[#4f46e5] opacity-20"
        />
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <span className="text-xl font-semibold text-gray-900">DocChat</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-sm text-gray-600 hover:text-gray-900">Provide feedback</button>
              <div className="flex items-center text-sm text-gray-600">
                <span>English</span>
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-64px)] items-start justify-center px-4 sm:px-6 lg:px-8 pt-48">
        <div className="max-w-6xl w-full">
          <div className="flex items-stretch justify-center space-x-8">
            {/* Sign In Form */}
            <div className="flex-1 max-w-md flex flex-col">
            {/* Back to Home Link */}
            <div className="mb-8">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>

            {/* Sign In Form Container */}
            <div className="bg-white border border-gray-300 rounded-lg p-8 flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  User sign in
                  <InformationCircleIcon className="ml-2 h-5 w-5 text-blue-500" />
                </h1>
              </div>

              {/* Demo Credentials Info */}
              {/* <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Demo Credentials:</strong><br />
                  Username: <code className="bg-blue-100 px-1 rounded text-xs">{DEMO_USERNAME}</code><br />
                  Password: <code className="bg-blue-100 px-1 rounded text-xs">{DEMO_PASSWORD}</code>
                </p>
              </div> */}

              <form onSubmit={handleSignIn} className="space-y-6">
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your username"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-600 hover:text-gray-800">Show Password</span>
                    </label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-500 font-medium">Having trouble?</a>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Sign In Button */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </button>
{/* 
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Fill Demo Credentials
                  </button> */}
                </div>

                {/* Create Account Link */}
                <div className="text-center">
                  <Link to="/signup" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                    Create a new account
                  </Link>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="mt-6 text-xs text-gray-500">
              <p>
                By continuing, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
                . This site uses essential cookies. See our{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">Cookie Notice</a>
                {" "}for more information.
              </p>
            </div>
            </div>

            {/* Right Box - Promotional Banner */}
            <div className="hidden lg:block flex-1 max-w-md flex flex-col">
              <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-lg p-8 text-left text-white flex-1 flex flex-col justify-center mt-14 min-h-[400px] relative overflow-hidden">
                {/* Background Pattern - Simple Grid */}
                <div className="absolute inset-0 -z-10 opacity-30">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>
                
                {/* Decorative Shape */}
                <div
                  aria-hidden="true"
                  className="absolute top-4 right-4 -z-10 transform-gpu blur-2xl"
                >
                  <div
                    style={{
                      clipPath:
                        'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
                    }}
                    className="aspect-1108/632 w-40 bg-gradient-to-r from-white/60 to-white/30"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-4">AI-Powered Document Assistant</h2>
                <p className="text-base mb-6 opacity-90">
                  Transform any document into an intelligent AI assistant. Upload PDFs and ask questions in plain English.
                </p>
                <a href="#" className="inline-flex items-center text-white hover:text-gray-200 font-medium">
                  Learn more
                  <span className="ml-1">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
