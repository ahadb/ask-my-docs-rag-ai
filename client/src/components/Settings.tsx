import { useState, useEffect } from "react";
import { API_URLS } from "../config";

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

export default function Settings() {
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
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch(API_URLS.SETTINGS);
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

  const saveSettings = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(API_URLS.SETTINGS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage("Settings saved successfully!");
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.detail}`);
      }
    } catch (error) {
      setMessage("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = async () => {
    try {
      const response = await fetch(API_URLS.SETTINGS_RESET, {
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900">
              Settings
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          {/* Document Processing Settings */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl p-5 shadow-md">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">Document Processing</h2>
              <p className="text-sm text-gray-600">Configure how your documents are chunked and processed</p>
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
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
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
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                  min="0"
                  max={settings.chunk_size - 100}
                />
                <p className="text-xs text-gray-500">
                  Overlap between chunks
                </p>
              </div>
            </div>
          </div>

          {/* AI & Query Settings */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl p-5 shadow-md">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">AI & Query</h2>
              <p className="text-sm text-gray-600">Fine-tune AI behavior and retrieval parameters</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
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
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
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
          <div className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl p-5 shadow-md">
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
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
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
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
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
          <div className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl p-5 shadow-md">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">AI Model & API</h2>
              <p className="text-sm text-gray-600">Configure your AI model and API settings</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Advanced AI models require Pro Plan</p>
                  <p className="text-xs text-gray-600">Upgrade to access GPT-4, Claude-3, and other premium AI models for enhanced document processing and responses.</p>
                </div>
              </div>
              <button
                type="button"
                className="bg-emerald-500 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>

          {/* Data Management Section */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl p-5 shadow-md">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">Data Management</h2>
              <p className="text-sm text-gray-600">Manage your document collections and data</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-500 rounded-lg flex items-center justify-center">
                  <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Export document collection</p>
                  <p className="text-xs text-gray-600">Download all your processed documents, embeddings, and settings as a backup or for migration purposes.</p>
                </div>
              </div>
              <button
                type="button"
                className="bg-gray-500 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
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
              onClick={saveSettings}
              disabled={isSaving}
              className="px-6 py-2.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-all duration-200 font-medium"
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
