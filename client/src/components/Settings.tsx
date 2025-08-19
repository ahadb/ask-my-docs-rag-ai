import React, { useState, useEffect } from "react";
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Application Settings
            </h1>
            <p className="text-gray-600">
              Configure your RAG Assistant preferences
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-md ${
                message.includes("Error")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {message}
            </div>
          )}

          <form className="space-y-8">
            {/* Document Processing Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Document Processing
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chunk Size
                  </label>
                  <input
                    type="number"
                    value={settings.chunk_size}
                    onChange={(e) =>
                      handleInputChange("chunk_size", parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="100"
                    max="5000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Characters per chunk (100-5000)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chunk Overlap
                  </label>
                  <input
                    type="number"
                    value={settings.chunk_overlap}
                    onChange={(e) =>
                      handleInputChange(
                        "chunk_overlap",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    max={settings.chunk_size - 100}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Overlap between chunks
                  </p>
                </div>
              </div>
            </div>

            {/* AI & Query Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                AI & Query
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Top-K Retrieval
                  </label>
                  <input
                    type="number"
                    value={settings.top_k_retrieval}
                    onChange={(e) =>
                      handleInputChange(
                        "top_k_retrieval",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="1"
                    max="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Number of chunks to retrieve
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature
                  </label>
                  <input
                    type="number"
                    value={settings.temperature}
                    onChange={(e) =>
                      handleInputChange(
                        "temperature",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    max="2"
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    AI response creativity (0-2)
                  </p>
                </div>
              </div>
            </div>

            {/* User Experience Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                User Experience
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Typewriter Speed
                  </label>
                  <input
                    type="number"
                    value={settings.typewriter_speed}
                    onChange={(e) =>
                      handleInputChange(
                        "typewriter_speed",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="10"
                    max="200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Characters per second (10-200)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleInputChange("theme", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.batch_processing}
                    onChange={(e) =>
                      handleInputChange("batch_processing", e.target.checked)
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Enable batch processing for multiple files
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={resetSettings}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Reset to Defaults
              </button>
              <button
                type="button"
                onClick={saveSettings}
                disabled={isSaving}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
