// API Configuration
export const API_CONFIG = {
  // Use environment variable or fallback to localhost for development
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",

  // API Endpoints
  ENDPOINTS: {
    UPLOAD: "/upload",
    UPLOAD_BATCH: "/upload/batch",
    UPLOAD_CLEAR: "/upload/clear",
    QUERY: "/query",
    SETTINGS: "/settings",
    SETTINGS_RESET: "/settings/reset",
  },
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
  QUERY: buildApiUrl(API_CONFIG.ENDPOINTS.QUERY),
  SETTINGS: buildApiUrl(API_CONFIG.ENDPOINTS.SETTINGS),
  SETTINGS_RESET: buildApiUrl(API_CONFIG.ENDPOINTS.SETTINGS_RESET),
};
