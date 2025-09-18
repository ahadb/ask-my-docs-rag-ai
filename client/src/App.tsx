import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ContentArea from "./components/ContentArea";
import Settings from "./components/Settings";
import HomePage from "./components/HomePage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

// Protected Route component
function ProtectedRoute({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

// Dashboard Layout component
function DashboardLayout({ children, onLogout, user }: { children: React.ReactNode; onLogout: () => void; user: { id: string; email: string; full_name: string } | null }) {
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
        />
      )}
      {children}
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; full_name: string } | null>(null);

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
              <DashboardLayout onLogout={handleLogout} user={user}>
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
              <DashboardLayout onLogout={handleLogout} user={user}>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
