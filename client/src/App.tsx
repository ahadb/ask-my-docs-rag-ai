import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ContentArea from "./components/ContentArea";
import Settings from "./components/Settings";
import HomePage from "./components/HomePage";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home"); // Start with home page
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigateToPage = (page: string) => {
    // Only allow navigation to dashboard if authenticated
    if (page === "dashboard" && !isAuthenticated) {
      return;
    }

    setCurrentPage(page);
    // Close mobile sidebar when navigating
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      setCurrentPage("dashboard");
      // Close mobile sidebar when navigating
      if (sidebarOpen) {
        setSidebarOpen(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            onNavigateToDashboard={() => navigateToPage("dashboard")}
            onLogin={handleLogin}
            isAuthenticated={isAuthenticated}
          />
        );
      case "settings":
        return <Settings />;
      case "dashboard":
      default:
        return <ContentArea />;
    }
  };

  // Don't show sidebar/header on home page
  if (currentPage === "home") {
    return renderPage();
  }

  // Only show Header on settings page, not on dashboard
  const showHeader = currentPage === "settings";

  return (
    <div>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
        setCurrentPage={navigateToPage}
      />
      {showHeader && (
        <Header
          setSidebarOpen={setSidebarOpen}
          onNavigateHome={() => navigateToPage("home")}
        />
      )}
      {renderPage()}
    </div>
  );
}
