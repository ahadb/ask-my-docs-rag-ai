// API Configuration
export const API_CONFIG = {
  // Use environment variable or fallback to localhost for development
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",

  // API Endpoints
  ENDPOINTS: {
    UPLOAD: "/upload",
    UPLOAD_BATCH: "/upload/batch",
    UPLOAD_CLEAR: "/upload/clear",
    UPLOAD_DOCUMENTS: "/upload/documents",
    QUERY: "/query",
    QUERY_MOCK: "/mock-demo/query",
    SETTINGS: "/settings",
    SETTINGS_RESET: "/settings/reset",
    AUTH_SIGNIN: "/auth/signin",
    AUTH_SIGNUP: "/auth/signup",
  },
};

// Demo Mode Configuration
export const DEMO_CONFIG = {
  // Enable demo mode for mock responses
  ENABLED: true,
  
  // Whether to use mock responses for template questions only
  MOCK_TEMPLATES_ONLY: true,
  
  // Whether to use mock responses for all queries
  MOCK_ALL_QUERIES: false,
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Pre-built URLs for convenience
export const API_URLS = {
  UPLOAD: buildApiUrl(API_CONFIG.ENDPOINTS.UPLOAD),
  UPLOAD_BATCH: buildApiUrl(API_CONFIG.ENDPOINTS.UPLOAD_BATCH),
  UPLOAD_CLEAR: buildApiUrl(API_CONFIG.ENDPOINTS.UPLOAD_CLEAR),
  UPLOAD_DOCUMENTS: buildApiUrl(API_CONFIG.ENDPOINTS.UPLOAD_DOCUMENTS),
  QUERY: buildApiUrl(API_CONFIG.ENDPOINTS.QUERY),
  QUERY_MOCK: buildApiUrl(API_CONFIG.ENDPOINTS.QUERY_MOCK),
  SETTINGS: buildApiUrl(API_CONFIG.ENDPOINTS.SETTINGS),
  SETTINGS_RESET: buildApiUrl(API_CONFIG.ENDPOINTS.SETTINGS_RESET),
  AUTH_SIGNIN: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH_SIGNIN),
  AUTH_SIGNUP: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH_SIGNUP),
};
