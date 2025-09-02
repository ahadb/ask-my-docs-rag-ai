import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ContentArea from "./components/ContentArea";
import Settings from "./components/Settings";
import HomePage from "./components/HomePage";

// Protected Route component
function ProtectedRoute({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

// Dashboard Layout component
function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const showHeader = location.pathname === "/settings" || location.pathname === "/dashboard";

  return (
    <div>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {showHeader && (
        <Header
          setSidebarOpen={setSidebarOpen}
          onNavigateHome={() => window.location.href = "/"}
        />
      )}
      {children}
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
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

        {/* Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardLayout>
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
              <DashboardLayout>
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
