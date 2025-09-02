import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

interface HomePageProps {
  onLogin: (success: boolean) => void;
  isAuthenticated: boolean;
}

export default function HomePage({
  onLogin,
  isAuthenticated,
}: HomePageProps) {
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("SecurePass123!");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Hardcoded credentials
  const DEMO_USERNAME = "demo";
  const DEMO_PASSWORD = "SecurePass123!";

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      onLogin(true);
      setShowSignIn(false);
      setUsername("");
      setPassword("");
      // Navigate to dashboard after successful login
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleSignOut = () => {
    onLogin(false);
    setShowSignIn(false);
  };

  const handleNavigateToDashboard = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="relative isolate overflow-hidden bg-white dark:bg-gray-900">
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-gray-200 dark:stroke-white/10"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
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
        <rect fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" width="100%" height="100%" strokeWidth={0} />
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
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:pt-8">
         
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm/6 font-semibold text-indigo-600 ring-1 ring-indigo-600/20 ring-inset dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/25">
                What's new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm/6 font-medium text-gray-600 dark:text-gray-300">
                <span>Just shipped v1.0</span>
                <CheckCircleIcon aria-hidden="true" className="size-5 text-gray-400 dark:text-gray-500" />
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl dark:text-white">
            Supercharge your Documents with AI
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
          Transform any document into an intelligent AI assistant. Upload PDFs and ask questions in plain English. Get intelligent, AI-powered answers with source citations from your own knowledge base.
          </p>
                     <div className="mt-10 flex items-center gap-x-6">
             {isAuthenticated ? (
               <button
                 onClick={handleNavigateToDashboard}
                 className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
               >
                 Go to Dashboard
               </button>
             ) : (
               <button
                 onClick={() => setShowSignIn(true)}
                 className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
               >
                 Get started
               </button>
             )}
            <a href="#" className="text-sm/6 font-semibold text-gray-900 dark:text-white">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <img
              alt="App screenshot"
              src="app.png"
              width={2432}
              height={1442}
              className="w-304 rounded-md bg-gray-50 shadow-xl ring-1 ring-gray-900/10 dark:hidden"
            />
            <img
              alt="App screenshot"
              src="app.png"
              width={2432}
              height={1442}
              className="w-304 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 not-dark:hidden"
            />
          </div>
        </div>
      </div>

      {/* Login Link - Top Right */}
      <div className="absolute top-6 right-6 z-10 relative">
        {isAuthenticated ? (
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 text-sm">
              Welcome, {DEMO_USERNAME}!
            </span>
            <button
              onClick={handleNavigateToDashboard}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors duration-200"
            >
              Dashboard
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </button>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setShowSignIn(!showSignIn)}
              className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-200"
            >
              Sign in →
            </button>
          </div>
        )}

        {/* Sign In Dropdown */}
        {showSignIn && (
          <div className="fixed top-20 right-6 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-6 z-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Sign In
              </h3>
              <button
                onClick={() => setShowSignIn(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Sign In
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  
  );
}
