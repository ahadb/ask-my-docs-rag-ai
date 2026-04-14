import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import AppRouter from "./components/layout/AppRouter";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import DemoModal from "./components/ui/DemoModal";
import { useAuth } from "./contexts/AuthContext";
import { useApp } from "./contexts/AppContext";

// Main App component that uses contexts
function AppContent() {
  const { isLoading } = useAuth();
  const { showDemoModal, setShowDemoModal } = useApp();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <>
      <AppRouter />
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}
