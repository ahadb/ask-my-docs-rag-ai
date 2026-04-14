import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../HomePage';
import SignInPage from '../SignInPage';
import SignUpPage from '../SignUpPage';
import DemoPage from '../DemoPage';
import ContentArea from '../ContentArea';
import DocumentLibraryPage from '../DocumentLibraryPage';
import SettingsPage from '../SettingsPage';
import DashboardLayout from './DashboardLayout';
import ProtectedRoute from '../ui/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

export default function AppRouter() {
  const { isAuthenticated, login } = useAuth();
  
  // Wrapper function to match the expected signature for page components
  const handleLogin = (success: boolean, userData?: { id: string; email: string; full_name: string }) => {
    if (success && userData) {
      login(userData);
    }
  };

  return (
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
          <SignInPage
            onLogin={handleLogin}
            isAuthenticated={isAuthenticated}
          />
        } 
      />

      {/* Sign Up Route */}
      <Route 
        path="/signup" 
        element={
          <SignUpPage
            onLogin={handleLogin}
            isAuthenticated={isAuthenticated}
          />
        } 
      />

      {/* Demo Route */}
      <Route 
        path="/demo" 
        element={
          <ProtectedRoute>
            <DemoPage />
          </ProtectedRoute>
        } 
      />

      {/* Dashboard Route */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ContentArea />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Document Library Route */}
      <Route 
        path="/library" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DocumentLibraryPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Settings Route */}
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Chat Route */}
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ContentArea />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
