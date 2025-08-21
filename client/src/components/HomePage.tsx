import React, { useState } from "react";
import {
  ArrowRightIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  CloudIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

interface HomePageProps {
  onNavigateToDashboard: () => void;
  onLogin: (success: boolean) => void;
  isAuthenticated: boolean;
}

export default function HomePage({
  onNavigateToDashboard,
  onLogin,
  isAuthenticated,
}: HomePageProps) {
  const [showSignIn, setShowSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    } else {
      setError("Invalid username or password");
    }
  };

  const handleSignOut = () => {
    onLogin(false);
    setShowSignIn(false);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80')`,
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-blue-900/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
                  <CpuChipIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    RAG AI Assistant
                  </h1>
                  <p className="text-sm text-gray-200">
                    Intelligent Document Intelligence
                  </p>
                </div>
              </div>

              {/* Sign In / Dashboard Button */}
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <span className="text-white text-sm">
                      Welcome, {DEMO_USERNAME}!
                    </span>
                    <button
                      onClick={onNavigateToDashboard}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 shadow-lg"
                    >
                      Go to Dashboard
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="inline-flex items-center px-3 py-2 border border-white/30 text-sm font-medium rounded-md text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/500 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowSignIn(!showSignIn)}
                      className="inline-flex items-center px-4 py-2 border border-white/30 text-sm font-medium rounded-md text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/500 transition-colors duration-200"
                    >
                      Sign In
                    </button>

                    {/* Sign In Form */}
                    {showSignIn && (
                      <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-6 z-50">
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
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                          >
                            Sign In
                          </button>
                        </form>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Transform Any Document into an
              <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Intelligent AI Assistant
              </span>
            </h1>

            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed">
              Upload your PDFs and documents, then ask questions in plain
              English. Get intelligent, AI-powered answers with source citations
              from your own knowledge base.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {isAuthenticated ? (
                <button
                  onClick={onNavigateToDashboard}
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <DocumentTextIcon className="mr-3 h-6 w-6" />
                  Go to Dashboard
                </button>
              ) : (
                <button
                  onClick={() => setShowSignIn(true)}
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <DocumentTextIcon className="mr-3 h-6 w-6" />
                  Sign In to Start
                </button>
              )}

              <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-lg font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 backdrop-blur-sm">
                <ChatBubbleLeftRightIcon className="mr-3 h-6 w-6" />
                Learn More
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Smart Document Processing
              </h3>
              <p className="text-gray-200">
                Upload PDFs and DOCX files. Our AI automatically chunks,
                processes, and creates searchable embeddings for lightning-fast
                retrieval.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                AI-Powered Q&A
              </h3>
              <p className="text-gray-200">
                Ask questions in natural language. Get intelligent answers based
                on your documents with source citations and context.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-200 hover:shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <CloudIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Enterprise Ready
              </h3>
              <p className="text-gray-200">
                Built on Supabase with pgvector, auto-scaling, and enterprise
                security. Production-ready from day one.
              </p>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              Built with Modern, Scalable Technology
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
                  <span className="text-blue-300 font-bold text-lg">⚛️</span>
                </div>
                <h4 className="font-semibold text-white">React + TS</h4>
                <p className="text-sm text-gray-300">Modern Frontend</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-green-500/30">
                  <span className="text-green-300 font-bold text-lg">🐍</span>
                </div>
                <h4 className="font-semibold text-white">FastAPI</h4>
                <p className="text-sm text-gray-300">
                  High-Performance Backend
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-purple-500/30">
                  <span className="text-purple-300 font-bold text-lg">🗄️</span>
                </div>
                <h4 className="font-semibold text-white">Supabase</h4>
                <p className="text-sm text-gray-300">Vector Database</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-orange-500/30">
                  <span className="text-orange-300 font-bold text-lg">🤖</span>
                </div>
                <h4 className="font-semibold text-white">OpenAI</h4>
                <p className="text-sm text-gray-300">AI Models</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Experience the Future of Document Intelligence?
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Join the AI revolution and transform how you interact with your
              documents.
            </p>
            {isAuthenticated ? (
              <button
                onClick={onNavigateToDashboard}
                className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-xl font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Go to Dashboard
                <ArrowRightIcon className="ml-3 h-6 w-6" />
              </button>
            ) : (
              <button
                onClick={() => setShowSignIn(true)}
                className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-xl font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign In to Get Started
                <ArrowRightIcon className="ml-3 h-6 w-6" />
              </button>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-black/50 backdrop-blur-md border-t border-white/20 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
                <CpuChipIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                RAG AI Assistant
              </span>
            </div>
            <p className="text-gray-300">Built with modern web technologies</p>
            <p className="text-gray-400 text-sm mt-2">
              © 2025 RAG AI Assistant. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
