import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ContentArea from "./components/ContentArea";
import Settings from "./components/Settings";
import HomePage from "./components/HomePage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Protected Route component
function ProtectedRoute({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

// Dashboard Layout component
function DashboardLayout({ children, onLogout, user, showDemoModal, setShowDemoModal }: { 
  children: React.ReactNode; 
  onLogout: () => void; 
  user: { id: string; email: string; full_name: string } | null;
  showDemoModal: boolean;
  setShowDemoModal: (show: boolean) => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const showHeader = location.pathname === "/settings" || location.pathname === "/dashboard";

  return (
    <div>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={onLogout}
      />
      {showHeader && (
        <Header
          setSidebarOpen={setSidebarOpen}
          onNavigateHome={() => window.location.href = "/"}
          onLogout={onLogout}
          user={user}
          showDemoModal={showDemoModal}
          setShowDemoModal={setShowDemoModal}
        />
      )}
      {children}
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; full_name: string } | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const handleLogin = (success: boolean, userData?: { id: string; email: string; full_name: string }) => {
    if (success) {
      setIsAuthenticated(true);
      if (userData) {
        setUser(userData);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route 
          path="/" 
          element={
            <HomePage
              onLogin={handleLogin}
              isAuthenticated={isAuthenticated}
            />
          } 
        />

        {/* Sign In Route */}
        <Route 
          path="/signin" 
          element={
            <SignIn
              onLogin={handleLogin}
              isAuthenticated={isAuthenticated}
            />
          } 
        />

        {/* Sign Up Route */}
        <Route 
          path="/signup" 
          element={
            <SignUp
              onLogin={handleLogin}
              isAuthenticated={isAuthenticated}
            />
          } 
        />

        {/* Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardLayout onLogout={handleLogout} user={user} showDemoModal={showDemoModal} setShowDemoModal={setShowDemoModal}>
                <ContentArea />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        {/* Settings Route */}
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardLayout onLogout={handleLogout} user={user} showDemoModal={showDemoModal} setShowDemoModal={setShowDemoModal}>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Demo Features Modal - App Level */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]">
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Demo Version</h2>
                  <p className="text-base text-gray-600 mt-2 leading-relaxed">
                    Experience the power of AI-driven document analysis with DocChat. Upload your PDFs and Word documents, 
                    then engage in intelligent conversations to extract insights, find specific information, and understand 
                    complex content through natural language queries.
                  </p>
                </div>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Three Column Layout */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                {/* Available Features */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Available Features
                  </h3>
                  <div className="space-y-2">
                    <div className="text-base text-gray-700">• Document Upload</div>
                    <div className="text-base text-gray-700">• AI-Powered Chat</div>
                    <div className="text-base text-gray-700">• Semantic Search</div>
                    <div className="text-base text-gray-700">• Document Library</div>
                  </div>
                </div>

                {/* Demo Limitations */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                    Demo Limitations
                  </h3>
                  <div className="space-y-2">
                    <div className="text-base text-yellow-700">• Max 3 documents</div>
                    <div className="text-base text-yellow-700">• No chat history</div>
                    <div className="text-base text-yellow-700">• No settings</div>
                    <div className="text-base text-yellow-700">• No Google Drive</div>
                    <div className="text-base text-yellow-700">• 50MB file limit</div>
                  </div>
                </div>

                {/* Pro Features */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Pro Version
                  </h3>
                  <div className="space-y-2">
                    <div className="text-base text-gray-600">• Unlimited documents</div>
                    <div className="text-base text-gray-600">• Persistent history</div>
                    <div className="text-base text-gray-600">• Advanced AI</div>
                    <div className="text-base text-gray-600">• Team collaboration</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Continue with Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Router>
  );
}
