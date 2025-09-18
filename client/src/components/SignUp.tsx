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

interface SignUpProps {
  onLogin: (success: boolean, userData?: { id: string; email: string; full_name: string }) => void;
  isAuthenticated: boolean;
}

export default function SignUp({ onLogin, isAuthenticated }: SignUpProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      // Call your backend auth endpoint
      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: `${formData.firstName} ${formData.lastName}`,
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
        setError(errorData.detail || "Signup failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
    
    setIsLoading(false);
  };

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
            id="signup-pattern"
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
        <rect fill="url(#signup-pattern)" width="100%" height="100%" strokeWidth={0} />
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
            {/* Sign Up Form */}
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

            {/* Sign Up Form Container */}
            <div className="bg-white border border-gray-300 rounded-lg p-8 flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  Create account <span className="text-xl text-gray-500 font-normal">(Disabled for Demo)</span>
                  <InformationCircleIcon className="ml-2 h-5 w-5 text-blue-500" />
                </h1>
                <p className="text-sm text-gray-600 mt-2">
                  Join our AI-powered document assistant platform
                </p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      disabled={true}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      disabled={true}
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={true}
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                    placeholder="Enter email address"
                  />
                </div>

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
                    disabled={true}
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Choose a username"
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
                      disabled={true}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                      placeholder="Create a password"
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
                    <span className="text-sm text-gray-500">Min. 6 characters</span>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      disabled={true}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
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
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Sign Up Button */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={true}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-500 bg-gray-300 cursor-not-allowed"
                  >
                    Create account (Demo)
                  </button>
                </div>

                {/* Sign In Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/signin" className="text-blue-600 hover:text-blue-500 font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="mt-6 text-xs text-gray-500">
              <p>
                By creating an account, you agree to our{" "}
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
                <h2 className="text-2xl font-bold mb-4">Join Our Platform</h2>
                <p className="text-base mb-6 opacity-90">
                  Get started with our AI-powered document assistant. Upload PDFs, ask questions, and get intelligent answers from your own knowledge base.
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
