import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getAuthToken } from '../utils/auth';
import { API_CONFIG } from '../config';

// Types
interface User {
  id: string;
  email: string;
  full_name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth token on app load
  const checkAuthStatus = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        // Validate token with backend
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth validation failed:', error);
        // Clear invalid token
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  // Login function
  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('authToken');
    // Redirect to sign in page
    window.location.href = '/signin';
  };

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
