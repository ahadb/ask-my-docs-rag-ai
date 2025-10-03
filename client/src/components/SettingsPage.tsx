import { useState, useEffect } from "react";
import { API_URLS } from "../config";
import { fetchWithAuth } from "../utils/auth";

interface Settings {
  chunk_size: number;
  chunk_overlap: number;
  top_k_retrieval: number;
  temperature: number;
  model: string;
  typewriter_speed: number;
  theme: string;
  batch_processing: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    chunk_size: 1000,
    chunk_overlap: 200,
    top_k_retrieval: 10,
    temperature: 0.7,
    model: "gpt-3.5-turbo",
    typewriter_speed: 50,
    theme: "light",
    batch_processing: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  // const [, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetchWithAuth(API_URLS.SETTINGS);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const saveSettings = async () => {
  //   setIsSaving(true);
  //   setMessage("");

  //   try {
  //     const response = await fetchWithAuth(API_URLS.SETTINGS, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(settings),
  //     });

  //     if (response.ok) {
  //       setMessage("Settings saved successfully!");
  //     } else {
  //       const error = await response.json();
  //       setMessage(`Error: ${error.detail}`);
  //     }
  //   } catch (error) {
  //     setMessage("Error saving settings");
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  const resetSettings = async () => {
    try {
      const response = await fetchWithAuth(API_URLS.SETTINGS_RESET, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        setMessage("Settings reset to defaults!");
      }
    } catch (error) {
      setMessage("Error resetting settings");
    }
  };

  const handleInputChange = (
    field: keyof Settings,
    value: string | number | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="w-full h-full p-6 overflow-y-auto overflow-x-hidden relative" style={{ backgroundColor: '#f7f6f4' }}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#D9664A' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-4rem)] lg:pl-70 overflow-x-hidden" style={{ backgroundColor: '#f7f6f4' }}>
      <div className="w-full h-full p-6 overflow-y-auto overflow-x-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"></div>
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-200/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-pink-200/60 to-transparent"></div>
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl transform -translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="flex flex-col items-center w-full max-w-4xl mx-auto min-w-0">
          {/* Main Heading Section */}
          <div className="w-full max-w-2xl mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900 text-left">
                Settings
              </h1>
            </div>
            <p className="text-sm text-gray-600 text-left">
              Configure your document processing and AI settings
            </p>
            
          </div>

          {/* Main Content */}
          <div className="w-full max-w-2xl">
        {message && (
          <div
            className={`mb-8 p-4 rounded-xl border ${
              message.includes("Error")
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-green-50 text-green-700 border-green-200"
            }`}
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${
                message.includes("Error") ? "bg-red-500" : "bg-green-500"
              }`}></div>
              {message}
            </div>
          </div>
        )}

        <form className="space-y-8">
          {/* General Settings */}
          <div className="border border-gray-300 rounded-xl p-5 shadow-md">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">General Settings</h2>
              <p className="text-sm text-gray-600">Configure your search mode, AI model, and context settings</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Search Mode
                </label>
                <select
                  value="Semantic"
                  disabled
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  style={{ backgroundColor: '#f0efec' }}
                >
                  <option value="Semantic">Semantic</option>
                  <option value="Keyword">Keyword</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                <p className="text-xs text-gray-500">
                  How documents are searched and retrieved
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  AI Model
                </label>
                <select
                  value="GPT-4"
                  disabled
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  style={{ backgroundColor: '#f0efec' }}
                >
                  <option value="GPT-4">GPT-4</option>
                  <option value="GPT-3.5">GPT-3.5</option>
                  <option value="Claude-3">Claude-3</option>
                  <option value="Gemini Pro">Gemini Pro</option>
                </select>
                <p className="text-xs text-gray-500">
                  AI model used for generating responses
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Context
                </label>
                <select
                  value="Multi-doc"
                  disabled
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  style={{ backgroundColor: '#f0efec' }}
                >
                  <option value="Multi-doc">Multi-doc</option>
                  <option value="Single-doc">Single-doc</option>
                  <option value="Global">Global</option>
                </select>
                <p className="text-xs text-gray-500">
                  Context scope for AI responses
                </p>
              </div>
            </div>
          </div>

          {/* AI & Document Processing Settings */}
          <div className="border border-gray-300 rounded-xl p-5 shadow-md">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">AI & Document Processing</h2>
              <p className="text-sm text-gray-600">Configure how your documents are processed and how AI responds to queries</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Chunk Size
                </label>
                <input
                  type="number"
                  value={settings.chunk_size}
                  onChange={(e) =>
                    handleInputChange("chunk_size", parseInt(e.target.value))
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  style={{ backgroundColor: '#f0efec' }}
                  disabled={true}
                  min="100"
                  max="5000"
                />
                <p className="text-xs text-gray-500">
                  Characters per chunk (100-5000)
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Chunk Overlap
                </label>
                <input
                  type="number"
                  value={settings.chunk_overlap}
                  onChange={(e) =>
                    handleInputChange("chunk_overlap", parseInt(e.target.value))
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  style={{ backgroundColor: '#f0efec' }}
                  disabled={true}
                  min="0"
                  max={settings.chunk_size - 100}
                />
                <p className="text-xs text-gray-500">
                  Overlap between chunks
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Top-K Retrieval
                </label>
                <input
                  type="number"
                  value={settings.top_k_retrieval}
                  onChange={(e) =>
                    handleInputChange("top_k_retrieval", parseInt(e.target.value))
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  style={{ backgroundColor: '#f0efec' }}
                  disabled={true}
                  min="1"
                  max="100"
                />
                <p className="text-xs text-gray-500">
                  Number of chunks to retrieve
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Temperature
                </label>
                <input
                  type="number"
                  value={settings.temperature}
                  onChange={(e) =>
                    handleInputChange("temperature", parseFloat(e.target.value))
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  style={{ backgroundColor: '#f0efec' }}
                  disabled={true}
                  min="0"
                  max="2"
                  step="0.1"
                />
                <p className="text-xs text-gray-500">
                  AI response creativity (0-2)
                </p>
              </div>
            </div>
          </div>

          {/* User Experience Settings */}
          <div className="border border-gray-300 rounded-xl p-5 shadow-md">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">User Experience</h2>
              <p className="text-sm text-gray-600">Personalize your interface and interaction preferences</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Typewriter Speed
                </label>
                <input
                  type="number"
                  value={settings.typewriter_speed}
                  onChange={(e) =>
                    handleInputChange("typewriter_speed", parseInt(e.target.value))
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  style={{ backgroundColor: '#f0efec' }}
                  disabled={true}
                  min="10"
                  max="200"
                />
                <p className="text-xs text-gray-500">
                  Characters per second (10-200)
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleInputChange("theme", e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  style={{ backgroundColor: '#f0efec' }}
                  disabled={true}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.batch_processing}
                  onChange={(e) =>
                    handleInputChange("batch_processing", e.target.checked)
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all duration-200"
                />
                <span className="text-sm font-medium text-gray-700">
                  Enable batch processing for multiple files
                </span>
              </label>
            </div>
          </div>

          {/* AI Model & API Section */}
          <div className="border border-gray-300 rounded-xl p-5 shadow-md">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">AI Model & API</h2>
              <p className="text-sm text-gray-600">Configure your AI model and API settings</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 mr-4">
                <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-800">Advanced AI models require Pro Plan - Upgrade to access GPT-4, Claude-3, and other premium AI models for enhanced document processing and responses.</p>
                </div>
              </div>
              <button
                type="button"
                className="bg-emerald-500 text-white rounded-md px-3 py-1.5 text-xs font-medium hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 whitespace-nowrap flex-shrink-0"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>

          {/* Data Management Section */}
          <div className="border border-gray-300 rounded-xl p-5 shadow-md">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">Data Management</h2>
              <p className="text-sm text-gray-600">Manage your document collections and data</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 mr-4">
                <div className="w-5 h-5 bg-gray-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-800">Export document collection - Download all your processed documents, embeddings, and settings as a backup or for migration purposes.</p>
                </div>
              </div>
              <button
                type="button"
                className="bg-gray-500 text-white rounded-md px-3 py-1.5 text-xs font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 whitespace-nowrap flex-shrink-0"
              >
                Export Data
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 pt-6">
            <button
              type="button"
              onClick={resetSettings}
              className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 font-medium"
            >
              Reset to Defaults
            </button>
            <button
              type="button"
              onClick={() => {}}
              disabled={true}
              className="px-6 py-2.5 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed disabled:opacity-50 transition-all duration-200 font-medium"
            >
              Save Settings (Demo)
            </button>
          </div>
        </form>
          </div>
        </div>
      </div>
    </div>
  );
}
