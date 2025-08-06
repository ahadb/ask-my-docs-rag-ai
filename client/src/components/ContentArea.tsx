import { useState, useCallback, useRef, useEffect } from "react";
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  DocumentTextIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

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
  const [isUploading, setIsUploading] = useState(false);
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

  // Typewriter effect function
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

      const response = await fetch("http://localhost:8000/upload", {
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
        setIsUploading(true);

        // Reset chunks count, previews, timestamps, and processing steps for new upload session
        setChunksCreated(0);
        setChunkPreviews({});
        setUploadTimestamps({});
        setProcessingSteps({});

        // Upload each file
        for (const file of validFiles) {
          try {
            await uploadFile(file);
          } catch (error) {
            console.error(`Failed to upload ${file.name}:`, error);
          }
        }

        setIsUploading(false);
      }
    },
    [uploadFile]
  );

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
        setIsUploading(true);

        // Reset chunks count, previews, timestamps, and processing steps for new upload session
        setChunksCreated(0);
        setChunkPreviews({});
        setUploadTimestamps({});
        setProcessingSteps({});

        // Upload each file
        for (const file of validFiles) {
          try {
            await uploadFile(file);
          } catch (error) {
            console.error(`Failed to upload ${file.name}:`, error);
          }
        }

        setIsUploading(false);
      }
    },
    [uploadFile]
  );

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearAllData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/upload/clear", {
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
    } catch (error) {
      console.error("Error clearing data:", error);
      setUploadedFiles([]);
      setUploadProgress({});
      setUploadTimestamps({});
      setChunksCreated(0);
      setChunkPreviews({});
      setProcessingSteps({});
      setMessages([]);
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
      const response = await fetch("http://localhost:8000/query", {
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
      className="flex w-full h-screen lg:pl-72 xl:pl-96 bg-gray-50"
    >
      {/* Left Column */}
      <div
        className="p-6 border-r border-gray-200 flex flex-col items-center justify-center"
        style={{ width: `${leftWidth}%` }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Upload Documents
          </h2>
          <button
            onClick={clearAllData}
            disabled={
              uploadedFiles.length === 0 &&
              Object.keys(chunkPreviews).length === 0 &&
              Object.keys(processingSteps).length === 0
            }
            className={`transition-colors p-1 rounded-full ${
              uploadedFiles.length > 0 ||
              Object.keys(chunkPreviews).length > 0 ||
              Object.keys(processingSteps).length > 0
                ? "text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                : "text-gray-300 cursor-not-allowed"
            }`}
            title={
              uploadedFiles.length > 0 ||
              Object.keys(chunkPreviews).length > 0 ||
              Object.keys(processingSteps).length > 0
                ? "Clear all data"
                : "No data to clear"
            }
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Drag & Drop Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors w-10/12 mx-auto ${
            isDragOver
              ? "border-indigo-400 bg-indigo-50"
              : "border-gray-300 hover:border-gray-400 bg-gray-100"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-sm text-gray-600 mb-4">
            <p className="font-medium">Drop files here or</p>
            <label
              htmlFor="file-upload"
              className="text-indigo-600 hover:text-indigo-500 cursor-pointer"
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
          <p className="text-xs text-gray-500">
            Supports{" "}
            <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 border border-gray-300 rounded-md text-gray-700">
              PDF
            </span>{" "}
            and{" "}
            <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 border border-gray-300 rounded-md text-gray-700">
              DOCX
            </span>{" "}
            files only
          </p>
        </div>

        {/* Uploaded Files List */}
        <div className="mt-4 w-10/12 mx-auto">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Uploaded Files
          </h3>
          {uploadedFiles.length > 0 ? (
            <div className="space-y-1.5">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {file.type === "application/pdf" ? (
                      <DocumentTextIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <DocumentIcon className="h-5 w-5 text-blue-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                        {uploadTimestamps[file.name] && (
                          <span className="text-xs text-gray-500 font-normal ml-2">
                            • {uploadTimestamps[file.name]}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file.size < 1024 * 1024
                          ? `${(file.size / 1024).toFixed(2)} KB`
                          : `${(file.size / 1024 / 1024).toFixed(2)} MB`}{" "}
                        •{" "}
                        {uploadProgress[file.name] === 100 ? (
                          <span className="text-green-600">
                            ✓ Upload successful
                          </span>
                        ) : uploadProgress[file.name] === -1 ? (
                          <span className="text-red-600">✗ Upload failed</span>
                        ) : uploadProgress[file.name] > 0 ? (
                          <span className="text-blue-600">
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
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <p className="text-sm text-gray-500">No files uploaded yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Upload files to see them here
              </p>
            </div>
          )}
        </div>

        {/* Chunk Previews */}
        <div className="mt-4 w-10/12 mx-auto">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Chunk Previews
          </h3>
          {Object.keys(chunkPreviews).length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-3 h-32 overflow-y-auto">
              <div className="space-y-3">
                {Object.entries(chunkPreviews).map(([filename, previews]) => (
                  <div
                    key={filename}
                    className="bg-gray-50 border border-gray-100 rounded-lg p-3"
                  >
                    <h4 className="text-xs font-medium text-gray-700 mb-2">
                      {filename} ({previews.length} previews)
                    </h4>
                    <div className="space-y-2">
                      {previews.map((preview) => (
                        <div
                          key={preview.index}
                          className="bg-white border border-gray-200 rounded p-2"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-600">
                              Chunk {preview.index + 1}
                            </span>
                            <span className="text-xs text-gray-500">
                              {preview.full_length} chars
                            </span>
                          </div>
                          <p className="text-xs text-gray-800 leading-relaxed">
                            {preview.preview}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-3 h-32 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  No chunk previews available
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Upload and process files to see chunk previews
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Processing Documents with Steps */}
        <div className="mt-4 w-10/12 mx-auto">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 shadow-sm">
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
                  <span className="text-sm font-semibold text-gray-800">
                    {uploadedFiles.length > 0
                      ? "Processing Documents"
                      : "Document Processing"}
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {uploadedFiles.length > 0
                      ? "Creating searchable chunks"
                      : "Upload documents to begin processing"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {chunksCreated}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  chunks created
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {uploadedFiles.length > 0 && chunksCreated > 0
                    ? "Ready for AI queries"
                    : uploadedFiles.length > 0
                    ? "Processing..."
                    : "Waiting for upload"}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">
                  Processing Progress
                </span>
                <span className="text-xs text-gray-500">
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
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
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
            <div className="space-y-1.5">
              {Object.keys(processingSteps).length > 0 ? (
                Object.entries(processingSteps).map(([filename, steps]) => (
                  <div
                    key={filename}
                    className="bg-white rounded-lg p-2 border border-gray-200"
                  >
                    <h4 className="text-xs font-medium text-gray-700 mb-1.5">
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
                                ? "text-green-600"
                                : step.status === "error"
                                ? "text-red-600"
                                : step.status === "pending"
                                ? "text-gray-500"
                                : "text-blue-600"
                            }`}
                          >
                            {step.step.replace(/_/g, " ")}
                          </span>
                          {step.status === "completed" && (
                            <span className="text-xs text-green-600">✓</span>
                          )}
                          {step.status === "error" && (
                            <span className="text-xs text-red-600">✗</span>
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
                <div className="bg-white rounded-lg p-2 border border-gray-200 text-center">
                  <p className="text-xs text-gray-500">
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
        <div className="p-6 border-b border-indigo-800 bg-indigo-700">
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
                          <p className="text-xs text-gray-500 mb-1">Sources:</p>
                          {message.sources.map((source, index) => (
                            <p key={index} className="text-xs text-gray-500">
                              {source.file_name} (chunk {source.chunk_index + 1}
                              )
                            </p>
                          ))}
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
