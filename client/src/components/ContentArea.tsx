import { useState, useCallback, useRef, useEffect } from "react";
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { API_URLS } from "../config";

export default function ContentArea() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [leftWidth, setLeftWidth] = useState(40); // 40% default
  const [isResizing, setIsResizing] = useState(false);
  const [chunksCreated, setChunksCreated] = useState<number>(0);

  
  const [chunkPreviews, setChunkPreviews] = useState<{
    [key: string]: Array<{
      index: number;
      preview: string;
      full_length: number;
    }>;
  }>({});

  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number; // An object where each key is a filename (string) and the value is the upload progress (number)
  }>({});
  const [uploadTimestamps, setUploadTimestamps] = useState<{
    [key: string]: string; // An object where each key is a filename (string) and the value is the timestamp (string)
  }>({});
  const [processingSteps, setProcessingSteps] = useState<{
    [key: string]: Array<{
      step: string;
      status: "pending" | "completed" | "error";
    }>;
  }>({});
  
  // State for expandable chunks
  const [, setExpandedChunks] = useState<{
    [key: string]: boolean;
  }>({});

  // Mock data for demonstration (visualization only)
  useEffect(() => {
    // Add mock chunk data if none exists (for visualization purposes only)
    if (Object.keys(chunkPreviews).length === 0) {
      const mockChunkPreviews = {
        "sample_document.pdf": Array.from({ length: 15 }, (_, index) => ({
          index: index,
          preview: `This is chunk ${index + 1} of the sample document. It contains sample text content that demonstrates how the chunking visualization works. Each chunk represents a meaningful segment of the document that can be processed by the RAG system.`,
          full_length: Math.floor(Math.random() * 200) + 150 // Random length between 150-350 chars
        }))
      };
      
      setChunkPreviews(mockChunkPreviews);
      // Don't set chunksCreated here - it should start at 0 and update from service
    }
  }, [chunkPreviews]);
  // Chat states
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      type: "user" | "assistant";
      content: string;
      timestamp: Date;
      sources?: Array<any>;
    }>
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);

  // Typewriter effect state
  const [typingStates, setTypingStates] = useState<{
    [key: string]: { text: string; isTyping: boolean };
  }>({});

  // Expanded sources state
  const [expandedSources, setExpandedSources] = useState<{
    [key: string]: boolean;
  }>({});

  // Typewriter effect function
  const toggleSources = useCallback((messageId: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  }, []);

  const startTyping = useCallback(
    (messageId: string, fullText: string, speed: number = 30) => {
      setTypingStates((prev) => ({
        ...prev,
        [messageId]: { text: "", isTyping: true },
      }));

      let index = 0;
      const timer = setInterval(() => {
        setTypingStates((prev) => {
          if (index < fullText.length) {
            return {
              ...prev,
              [messageId]: {
                text: fullText.slice(0, index + 1),
                isTyping: true,
              },
            };
          } else {
            clearInterval(timer);
            return {
              ...prev,
              [messageId]: { text: fullText, isTyping: false },
            };
          }
        });
        index++;
      }, speed);
    },
    []
  );

  const containerRef = useRef<HTMLDivElement>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);
  const lastUpdateRef = useRef(0);

  const uploadFile = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

      // Initialize processing steps for this file
      const initialSteps = [
        { step: "uploading_file", status: "completed" as const },
        { step: "parsing_text", status: "pending" as const },
        { step: "creating_chunks", status: "pending" as const },
        { step: "generating_embeddings", status: "pending" as const },
        { step: "storing_in_vector_db", status: "pending" as const },
      ];

      setProcessingSteps((prev) => ({
        ...prev,
        [file.name]: initialSteps,
      }));

      const response = await fetch(API_URLS.UPLOAD, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));

      // Set timestamp for successful upload
      const timestamp = new Date().toLocaleString();
      setUploadTimestamps((prev) => ({ ...prev, [file.name]: timestamp }));

      // Update chunks count if the response includes it
      if (result.num_chunks) {
        setChunksCreated((prev) => prev + result.num_chunks);
      } else {
        // If no chunks count returned, calculate from chunk previews if available
        if (result.chunk_previews && Array.isArray(result.chunk_previews)) {
          setChunksCreated((prev) => prev + result.chunk_previews.length);
        }
      }

      // Store chunk previews if the response includes them
      if (result.chunk_previews) {
        setChunkPreviews((prev) => ({
          ...prev,
          [file.name]: result.chunk_previews,
        }));
      }

      // Store processing steps if the response includes them
      if (result.processing_steps) {
        setProcessingSteps((prev) => ({
          ...prev,
          [file.name]: result.processing_steps,
        }));
      }

      return result;
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress((prev) => ({ ...prev, [file.name]: -1 })); // -1 indicates error
      throw error;
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );

      if (validFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...validFiles]);

        // Reset chunks count, previews, timestamps, and processing steps for new upload session
        setChunksCreated(0);
        setChunkPreviews({});
        setUploadTimestamps({});
        setProcessingSteps({});

        // Batch upload all files simultaneously
        try {
          if (validFiles.length === 1) {
            // Single file - use regular upload
            await uploadFile(validFiles[0]);
          } else {
            // Multiple files - use batch endpoint
            const formData = new FormData();
            validFiles.forEach((file) => {
              formData.append("files", file);
            });

            const response = await fetch(API_URLS.UPLOAD_BATCH, {
              method: "POST",
              body: formData,
            });

            if (!response.ok) {
              throw new Error(`Batch upload failed: ${response.statusText}`);
            }

            const batchResult = await response.json();

            // Process batch results
            batchResult.batch_results.forEach((result: any) => {
              if (result.error) {
                console.error(
                  `Failed to upload ${result.filename}:`,
                  result.error
                );
              } else {
                // Update states for successful uploads
                setUploadProgress((prev) => ({
                  ...prev,
                  [result.filename]: 100,
                }));

                const timestamp = new Date().toLocaleString();
                setUploadTimestamps((prev) => ({
                  ...prev,
                  [result.filename]: timestamp,
                }));

                if (result.num_chunks) {
                  setChunksCreated((prev) => prev + result.num_chunks);
                }

                if (result.chunk_previews) {
                  setChunkPreviews((prev) => ({
                    ...prev,
                    [result.filename]: result.chunk_previews,
                  }));
                }

                if (result.processing_steps) {
                  setProcessingSteps((prev) => ({
                    ...prev,
                    [result.filename]: result.processing_steps,
                  }));
                }
              }
            });
          }
        } catch (error) {
          console.error("Batch upload error:", error);
        }
      }
    },
    [uploadFile]
  );

  // const toggleChunkExpansion = useCallback((filename: string) => {
  //   setExpandedChunks(prev => ({
  //     ...prev,
  //     [filename]: !prev[filename]
  //   }));
  // }, []);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const validFiles = files.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );

      if (validFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...validFiles]);

        // Reset chunks count, previews, timestamps, and processing steps for new upload session
        setChunksCreated(0);
        setChunkPreviews({});
        setUploadTimestamps({});
        setProcessingSteps({});

        // Batch upload all files simultaneously
        try {
          if (validFiles.length === 1) {
            // Single file - use regular upload
            await uploadFile(validFiles[0]);
          } else {
            // Multiple files - use batch endpoint
            const formData = new FormData();
            validFiles.forEach((file) => {
              formData.append("files", file);
            });

            const response = await fetch(API_URLS.UPLOAD_BATCH, {
              method: "POST",
              body: formData,
            });

            if (!response.ok) {
              throw new Error(`Batch upload failed: ${response.statusText}`);
            }

            const batchResult = await response.json();

            // Process batch results
            batchResult.batch_results.forEach((result: any) => {
              if (result.error) {
                console.error(
                  `Failed to upload ${result.filename}:`,
                  result.error
                );
              } else {
                // Update states for successful uploads
                setUploadProgress((prev) => ({
                  ...prev,
                  [result.filename]: 100,
                }));

                const timestamp = new Date().toLocaleString();
                setUploadTimestamps((prev) => ({
                  ...prev,
                  [result.filename]: timestamp,
                }));

                if (result.num_chunks) {
                  setChunksCreated((prev) => prev + result.num_chunks);
                }

                if (result.chunk_previews) {
                  setChunkPreviews((prev) => ({
                    ...prev,
                    [result.filename]: result.chunk_previews,
                  }));
                }

                if (result.processing_steps) {
                  setProcessingSteps((prev) => ({
                    ...prev,
                    [result.filename]: result.processing_steps,
                  }));
                }
              }
            });
          }
        } catch (error) {
          console.error("Batch upload error:", error);
        }
      }
    },
    [uploadFile]
  );

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearAllData = useCallback(async () => {
    try {
      const response = await fetch(API_URLS.UPLOAD_CLEAR, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear backend data");
      }

      setUploadedFiles([]);
      setUploadProgress({});
      setUploadTimestamps({});
      setChunksCreated(0);
      setChunkPreviews({});
      setProcessingSteps({});
      setMessages([]);
      setExpandedChunks({});
    } catch (error) {
      console.error("Error clearing data:", error);
      setUploadedFiles([]);
      setUploadProgress({});
      setUploadTimestamps({});
      setChunksCreated(0);
      setChunkPreviews({});
      setProcessingSteps({});
      setMessages([]);
      setExpandedChunks({});
    }
  }, []);

  // Chat functions
  const sendQuery = useCallback(async (question: string) => {
    if (!question.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsQuerying(true);

    try {
      const response = await fetch(API_URLS.QUERY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          top_k: null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Query failed: ${response.statusText}`);
      }

      const result = await response.json();

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant" as const,
        content:
          result.answer || "Sorry, I couldn't find an answer to your question.",
        timestamp: new Date(),
        sources: result.sources || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Start typewriter effect for the new assistant message
      setTimeout(() => {
        startTyping(assistantMessage.id, assistantMessage.content, 30);
      }, 100);
    } catch (error) {
      console.error("Query error:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant" as const,
        content:
          "Sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Start typewriter effect for the error message
      setTimeout(() => {
        startTyping(errorMessage.id, errorMessage.content, 30);
      }, 100);
    } finally {
      setIsQuerying(false);
    }
  }, []);

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() && !isQuerying) {
      sendQuery(inputValue);
    }
  }, [inputValue, isQuerying, sendQuery]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const now = Date.now();
      if (now - lastUpdateRef.current < 16) return; // ~60fps throttling
      lastUpdateRef.current = now;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Limit the width between 20% and 80%
      if (newLeftWidth >= 20 && newLeftWidth <= 80) {
        setLeftWidth(newLeftWidth);
      }
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="flex w-full h-[calc(100vh-4rem)] lg:pl-72 bg-gray-50"
    >
      {/* Left Column */}
              <div
          className="p-6 border-r border-gray-200 flex flex-col overflow-y-auto relative"
          style={{ 
            width: `${leftWidth}%`,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"></div>
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-200/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-pink-200/60 to-transparent"></div>
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl transform -translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
          </div>
                 <div className="flex flex-col items-center w-full">
                     {/* Main Heading Section */}
          <div className="w-full max-w-2xl mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900 text-left">
                Upload Documents
              </h1>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-base text-gray-600 max-w-md text-left">
                Transform your PDFs and Word documents into an intelligent knowledge base
              </p>
              <button
                onClick={clearAllData}
                className="text-sm text-gray-500 hover:text-red-600 hover:underline transition-colors"
              >
                Clear all data
              </button>
            </div>
          </div>

          {/* Upload Stats and Controls */}
          <div className="w-full max-w-2xl mb-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Documents Card */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <DocumentTextIcon className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">Documents</p>
                    <p className="text-xl font-bold text-indigo-600">{uploadedFiles.length}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    {uploadedFiles.length === 0 
                      ? "No documents uploaded yet"
                      : uploadedFiles.length === 1 
                      ? "1 document uploaded"
                      : `${uploadedFiles.length} documents uploaded`
                    }
                  </p>
                </div>
              </div>

              {/* Chunks Card */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{chunksCreated}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">Chunks</p>
                    <p className="text-xl font-bold text-green-600">{chunksCreated}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    {chunksCreated === 0 
                      ? "No chunks created yet"
                      : chunksCreated === 1 
                      ? "1 chunk created"
                      : `${chunksCreated} chunks created`
                    }
                  </p>
                </div>
              </div>
                        </div>
          </div>

          {/* Drag & Drop Area */}
          <div className="w-full max-w-2xl mb-2">
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                isDragOver
                  ? "border-indigo-400 bg-indigo-50 scale-105 shadow-lg"
                  : "border-gray-300 hover:border-indigo-300 hover:bg-gray-50 bg-white shadow-sm hover:shadow-md"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CloudArrowUpIcon className={`mx-auto h-12 w-12 mb-4 transition-colors ${
                isDragOver ? "text-indigo-500" : "text-gray-400"
              }`} />
              <div className="text-base text-gray-700 mb-4">
                <p className="font-semibold mb-2">Drop your files here or</p>
                <label
                  htmlFor="file-upload"
                  className="text-indigo-600 hover:text-indigo-500 cursor-pointer font-medium underline decoration-2 underline-offset-2"
                >
                  browse files
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.docx"
                />
              </div>
              <div className="flex items-center justify-center space-x-3">
                <span className="inline-flex items-center px-2 py-1 text-sm font-medium bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                  <DocumentTextIcon className="h-4 w-4 mr-2 text-red-500" />
                  PDF
                </span>
                <span className="inline-flex items-center px-2 py-1 text-sm font-medium bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                  <DocumentIcon className="h-4 w-4 mr-2 text-blue-500" />
                  DOCX
                </span>
              </div>
            </div>
          </div>

          {/* Uploaded Files List */}
          <div className="w-full max-w-2xl mb-4">
            {uploadedFiles.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      {file.type === "application/pdf" ? (
                        <div className="p-1.5 bg-red-100 rounded-lg flex-shrink-0">
                          <DocumentTextIcon className="h-5 w-5 text-red-600" />
                        </div>
                      ) : (
                        <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
                          <DocumentIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 truncate">
                            {file.size < 1024 * 1024
                              ? `${(file.size / 1024).toFixed(2)} KB`
                              : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                          </span>
                          {uploadTimestamps[file.name] && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500 truncate">
                                {uploadTimestamps[file.name]}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {uploadProgress[file.name] === 100 ? (
                            <span className="text-green-600 font-medium">
                              ✓ Upload successful
                            </span>
                          ) : uploadProgress[file.name] === -1 ? (
                            <span className="text-red-600 font-medium">✗ Upload failed</span>
                          ) : uploadProgress[file.name] > 0 ? (
                            <span className="text-blue-600 font-medium">
                              Uploading... {uploadProgress[file.name]}%
                            </span>
                          ) : (
                            <span className="text-gray-500">Pending upload</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex-shrink-0 ml-2"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

                               {/* Chunk Distribution Visualization */}
          <div className="w-full max-w-2xl mb-4">
            {uploadedFiles.length > 0 ? (
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm">
                {/* Chunk Distribution Chart */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Chunk Distribution</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {Object.values(chunkPreviews).reduce((total, previews) => total + previews.length, 0)} total chunks
                    </span>
                  </div>
                  
                  {/* Visual Chunk Bars */}
                  <div className="space-y-3">
                    {Object.entries(chunkPreviews).map(([filename, previews]) => (
                      <div key={filename} className="space-y-2">
                        <div className="mb-2">
                          <span className="text-gray-700 font-semibold truncate max-w-32 text-xs">
                            {filename}
                          </span>
                        </div>
                        
                        {/* Chunk Bar Visualization */}
                        <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div className="absolute inset-0 flex">
                            {previews.map((_, index) => (
                              <div
                                key={index}
                                className="h-full border-r border-white/80 last:border-r-0 transition-all duration-300 ease-out shadow-sm"
                                style={{
                                  width: `${100 / previews.length}%`,
                                  backgroundColor: `hsl(210, ${60 + (index * 5)}%, ${35 + (index * 4)}%)`
                                }}
                              />
                            ))}
                          </div>
                          
                          {/* Enhanced hover effect overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
                        </div>
                        
                        {/* Chunk Details */}
                        <div className="text-xs text-gray-600">
                          <span className="inline-flex items-center space-x-1">
                            <div className="w-2 h-2 bg-blue-600 rounded-full shadow-sm"></div>
                            <span>Avg: {Math.round(previews.reduce((sum, p) => sum + p.full_length, 0) / previews.length)} chars per chunk</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                

              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-6 flex items-center justify-center shadow-sm">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Document Processing Ready
                  </p>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Upload documents to begin intelligent chunking and vectorization
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Embeddings Visualization */}
          <div className="w-full max-w-2xl mb-4">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Semantic Embeddings Space</span>
                  {uploadedFiles.length > 0 && (
                    <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                      {Object.values(chunkPreviews).reduce((total, previews) => total + previews.length, 0)} vectors
                    </span>
                  )}
                </div>
                
                {/* 2D Embeddings Scatter Plot */}
                <div className="relative h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-gray-200 overflow-hidden">
                  {/* Grid lines */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full" style={{
                      backgroundImage: `
                        linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }} />
                  </div>
                  
                  {/* Embedding points - only show when files are uploaded */}
                  {uploadedFiles.length > 0 ? (
                    <>
                      {Object.entries(chunkPreviews).map(([filename, previews]) => (
                        previews.map((_, index) => {
                          // Generate mock 2D coordinates for visualization
                          const x = 20 + (Math.random() * 60) + (index % 3) * 15; // 20-80% with some clustering
                          const y = 20 + (Math.random() * 60) + (Math.floor(index / 3) * 15); // 20-80% with some clustering
                          const size = Math.random() * 8 + 4; // 4-12px
                          const opacity = 0.7 + (Math.random() * 0.3); // 0.7-1.0
                          
                          return (
                            <div
                              key={`${filename}-${index}`}
                              className="absolute rounded-full cursor-pointer transition-all duration-300 hover:scale-125 hover:shadow-lg"
                              style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                width: `${size}px`,
                                height: `${size}px`,
                                backgroundColor: `hsl(210, ${60 + (index * 5)}%, ${35 + (index * 4)}%)`,
                                opacity: opacity,
                                transform: 'translate(-50%, -50%)',
                                zIndex: Math.floor(opacity * 10)
                              }}
                              title={`${filename} - Chunk ${index + 1}`}
                            />
                          );
                        })
                      ))}
                      
                      {/* Center reference point */}
                      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-indigo-600 rounded-full transform -translate-x-1 -translate-y-1 opacity-60" />
                      
                      {/* Hover overlay for interaction */}
                      <div className="absolute inset-0 bg-transparent hover:bg-black/5 transition-colors duration-200" />
                    </>
                  ) : (
                    /* Empty state when no files uploaded */
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-500">
                          Upload documents to view semantic embeddings
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Legend and Info */}
                <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span>Center</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Chunks</span>
                    </span>
                  </div>
                  <span className="text-gray-500">
                    Hover over points to see chunk details
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Documents with Steps */}
          <div className="w-full max-w-2xl mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      uploadedFiles.length > 0
                        ? "bg-blue-500 animate-pulse"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <div>
                    <span className="text-base font-bold text-gray-800">
                      {uploadedFiles.length > 0
                        ? "Processing Documents"
                        : "Document Processing"}
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      {uploadedFiles.length > 0
                        ? "Creating searchable chunks for AI queries"
                        : "Upload documents to begin processing"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {/* <p className="text-2xl font-bold text-blue-600">
                    {chunksCreated}
                  </p>
                  <p className="text-xs text-gray-600 font-medium">
                    chunks created
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {uploadedFiles.length > 0 && chunksCreated > 0
                      ? "Ready for AI queries"
                      : uploadedFiles.length > 0
                      ? "Processing..."
                      : "Waiting for upload"}
                  </p> */}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">
                    Processing Progress
                  </span>
                  <span className="text-xs text-gray-600">
                    {Object.keys(processingSteps).length > 0
                      ? `${
                          Object.values(processingSteps)
                            .flat()
                            .filter((step) => step.status === "completed").length
                        }/${Object.values(processingSteps).flat().length} steps`
                      : "0/0 steps"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${
                        Object.keys(processingSteps).length > 0
                          ? (Object.values(processingSteps)
                              .flat()
                              .filter((step) => step.status === "completed")
                              .length /
                              Object.values(processingSteps).flat().length) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Processing Steps */}
              <div className="space-y-1.5 max-h-24 overflow-y-auto">
                {Object.keys(processingSteps).length > 0 ? (
                  Object.entries(processingSteps).map(([filename, steps]) => (
                    <div
                      key={filename}
                      className="bg-white rounded p-2 border border-blue-200"
                    >
                      <h4 className="text-xs font-semibold text-gray-700 mb-1.5">
                        {filename}
                      </h4>
                      <div className="space-y-1">
                        {steps.map((step) => (
                          <div
                            key={step.step}
                            className="flex items-center space-x-2"
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                step.status === "completed"
                                  ? "bg-green-500"
                                  : step.status === "error"
                                  ? "bg-red-500"
                                  : step.status === "pending"
                                  ? "bg-gray-300"
                                  : "bg-blue-400 animate-pulse"
                              }`}
                            ></div>
                            <span
                              className={`text-xs capitalize ${
                                step.status === "completed"
                                  ? "text-green-600 font-medium"
                                  : step.status === "error"
                                  ? "text-red-600 font-medium"
                                  : step.status === "pending"
                                  ? "text-gray-500"
                                  : "text-blue-600 font-medium"
                              }`}
                            >
                              {step.step.replace(/_/g, " ")}
                            </span>
                            {step.status === "completed" && (
                              <span className="text-xs text-green-600 font-bold">✓</span>
                            )}
                            {step.status === "error" && (
                              <span className="text-xs text-red-600 font-bold">✗</span>
                            )}
                            {step.status === "pending" && (
                              <span className="text-xs text-gray-400">...</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded p-3 border border-blue-200 text-center">
                    <DocumentTextIcon className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-600 font-medium">
                      No processing steps available
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Upload files to see processing steps
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resizable Divider */}
      <div
        className="w-1 bg-gray-300 cursor-col-resize hover:bg-gray-400 transition-colors select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="w-full h-full flex items-center justify-center select-none">
          <div className="w-1 h-8 bg-gray-400 rounded-full select-none"></div>
        </div>
      </div>

      {/* Right Column - Chatbot */}
      <div
        className="flex flex-col h-full bg-white"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {/* Chat Header */}
        <div className="p-6 border-b border-indigo-600 bg-indigo-600">
          <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
          <p className="text-sm text-indigo-100">
            Ask questions about your uploaded documents
          </p>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.length === 0 ? (
              /* Welcome Message */
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">AI</span>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-gray-900">
                    Hello! I'm here to help you with your documents. Upload some
                    files on the left and then ask me questions about them.
                  </p>
                </div>
              </div>
            ) : (
              /* Chat Messages */
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.type === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user"
                        ? "bg-indigo-600"
                        : "bg-indigo-500"
                    }`}
                  >
                    <span className="text-white text-sm font-medium">
                      {message.type === "user" ? "You" : "AI"}
                    </span>
                  </div>
                  <div
                    className={`rounded-lg p-3 max-w-xs ${
                      message.type === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">
                      {message.type === "assistant"
                        ? typingStates[message.id]?.text || message.content
                        : message.content}
                      {message.type === "assistant" &&
                        typingStates[message.id]?.isTyping && (
                          <span className="inline-block w-0.5 h-4 bg-gray-500 ml-1 animate-pulse"></span>
                        )}
                    </p>
                    {message.sources &&
                      message.sources.length > 0 &&
                      !typingStates[message.id]?.isTyping && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <button
                            onClick={() => toggleSources(message.id)}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors mb-2"
                          >
                            <span className="font-medium">
                              {expandedSources[message.id] ? "Hide" : "Show"} Sources ({message.sources.length})
                            </span>
                            <svg
                              className={`w-3 h-3 transition-transform ${
                                expandedSources[message.id] ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {expandedSources[message.id] && (
                            <div className="space-y-1 mb-2">
                              {message.sources.map((source, index) => (
                                <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded border-l-2 border-indigo-300">
                                  <span className="font-medium text-gray-700">{source.file_name}</span>
                                  <span className="text-gray-500 ml-2">(chunk {source.chunk_index + 1})</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              ))
            )}

            {/* Loading indicator */}
            {isQuerying && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">AI</span>
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your documents..."
              disabled={isQuerying}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isQuerying}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isQuerying ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
