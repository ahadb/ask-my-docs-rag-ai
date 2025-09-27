import { useCallback } from "react";
import {
  ClipboardDocumentIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ArrowUpIcon,
  WifiIcon,
  ExclamationTriangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import { API_URLS } from "../config";
import { TEMPLATE_QUESTIONS } from "../services/mockResponses";
import { fetchWithMockRouting } from "../services/mockApi";
import { useInternetConnection } from "../hooks/useInternetConnection";

interface ChatProps {
  recentChats: Array<{ id: string; title: string; confidence?: 'high' | 'medium' | 'low' }>;
  setRecentChats: React.Dispatch<React.SetStateAction<Array<{ id: string; title: string; confidence?: 'high' | 'medium' | 'low' }>>>;
  onQuerySent?: () => void;
  onResponseTime?: (time: number) => void;
  onConfidenceLevel?: (level: 'high' | 'medium' | 'low') => void;
  messages: Array<{
    id: string;
    type: "user" | "assistant";
    content: string;
    timestamp: Date;
    sources?: Array<any>;
    confidence?: { level: string; explanation: string };
    isStreaming?: boolean;
  }>;
  setMessages: React.Dispatch<React.SetStateAction<Array<{
    id: string;
    type: "user" | "assistant";
    content: string;
    timestamp: Date;
    sources?: Array<any>;
    confidence?: { level: string; explanation: string };
    isStreaming?: boolean;
  }>>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  isQuerying: boolean;
  setIsQuerying: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Chat({ 
  setRecentChats, 
  onQuerySent, 
  onResponseTime,
  onConfidenceLevel,
  messages, 
  setMessages, 
  inputValue, 
  setInputValue, 
  isQuerying, 
  setIsQuerying, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}: ChatProps) {
  // Internet connection hook
  const { isOnline, isChecking } = useInternetConnection();

  // Quick template questions for demo - imported from mock responses service
  const quickTemplates = TEMPLATE_QUESTIONS;

  // Chat functions
  const sendQuery = useCallback(async (question: string) => {
    if (!question.trim()) return;
    
    // Start timing the response
    const startTime = Date.now();
    
    // Only proceed if we have internet connection
    if (!isOnline) {
      const offlineMessage = {
        id: Date.now().toString(),
        type: "assistant" as const,
        content: "⚠️ No internet connection detected. Please check your connection and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, offlineMessage]);
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsQuerying(true);

    // Add typing indicator
    const typingMessage = {
      id: "typing-" + Date.now().toString(),
      type: "assistant" as const,
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, typingMessage]);

    try {
      // Use mock API routing (will route to mock or real API based on config)
      const response = await fetchWithMockRouting(API_URLS.QUERY, {
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

      const fullContent = result.answer || "Sorry, I couldn't find an answer to your question.";
      const confidenceData = result.confidence;

      // Remove typing indicator
      setMessages((prev) => prev.filter(msg => msg.id !== typingMessage.id));

      // Create the assistant message with a fixed ID
      const assistantMessageId = (Date.now() + 1).toString();
      
      // Simulate streaming effect
      const words = fullContent.split(' ');
      let currentContent = '';
      
      for (let i = 0; i < words.length; i++) {
        currentContent += (i > 0 ? ' ' : '') + words[i];
        
        const streamingMessage = {
          id: assistantMessageId,
          type: "assistant" as const,
          content: currentContent,
          timestamp: new Date(),
          sources: result.sources || [],
          confidence: confidenceData,
          isStreaming: i < words.length - 1,
        };

        setMessages((prev) => {
          const filtered = prev.filter(msg => msg.id !== assistantMessageId);
          return [...filtered, streamingMessage];
        });

        // Add a small delay between words for streaming effect
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Final update to remove streaming flag
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, isStreaming: false, confidence: confidenceData }
            : msg
        )
      );

      // Calculate and report response time
      const responseTime = (Date.now() - startTime) / 1000; // Convert to seconds
      if (onResponseTime) {
        onResponseTime(responseTime);
      }

      // Track confidence level
      if (onConfidenceLevel && confidenceData?.level) {
        const level = confidenceData.level.toLowerCase() as 'high' | 'medium' | 'low';
        onConfidenceLevel(level);
        
        // Update the most recent chat with the actual confidence level
        setRecentChats(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[0] = { ...updated[0], confidence: level };
          }
          return updated;
        });
      }

    } catch (error) {
      console.error("Query error:", error);
      
      // Remove typing indicator
      setMessages((prev) => prev.filter(msg => msg.id !== typingMessage.id));
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant" as const,
        content:
          "Sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date(),
        isStreaming: false,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsQuerying(false);
    }
  }, [isOnline, onResponseTime, onConfidenceLevel]);

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

  // Handle template click - auto-fill, send, and add to recent chats
  const handleTemplateClick = useCallback((template: string) => {
    setInputValue(template);
    sendQuery(template);
    
    // Increment query count
    if (onQuerySent) {
      onQuerySent();
    }
    
    // Add to recent chats
    const newChat = {
      id: Date.now().toString(),
      title: template.length > 50 ? template.substring(0, 50) + "..." : template
      // No confidence initially - will be added when response comes back
    };
    
    setRecentChats(prev => {
      // Remove if already exists (to move to top)
      const filtered = prev.filter(chat => chat.title !== newChat.title);
      // Add to beginning and limit to 6 items
      return [newChat, ...filtered].slice(0, 6);
    });
  }, [sendQuery, onQuerySent]);

  return (
    <div className="flex w-full h-full" style={{ backgroundColor: '#f7f6f4' }}>
      {/* Templates Sidebar - Hidden on mobile */}
      <div className="hidden lg:block w-80 border-r border-gray-300" style={{ backgroundColor: '#f0efec' }}>
        <div className="p-4 border-b border-gray-300">
          <h3 className="text-lg font-semibold text-gray-800">Template Questions</h3>
          <p className="text-sm text-gray-600">Click any template to get started</p>
        </div>
        <div className="p-4 space-y-0.5 overflow-y-auto h-full">
          {quickTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => handleTemplateClick(template)}
              disabled={isQuerying || !isOnline}
              className="w-full text-left p-3 rounded-lg transition-colors text-sm text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 hover:text-[#D9664A]"
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex flex-col h-full flex-1">
        {/* Chat Header */}
        <div className="p-6 border-b border-gray-300" style={{ backgroundColor: '#e9e7e3' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">AI Assistant</h2>
              <p className="text-sm text-gray-600">
                Ask questions about your uploaded documents
              </p>
              
              {/* AI Templates Badge */}
              <div className="mt-3 inline-block">
                <div className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: '#fefce8', borderColor: '#fde047', color: '#713f12', border: '1px solid #fde047' }}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-2">
                      <svg className="h-4 w-4" style={{ color: '#ca8a04' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Try our AI with our powerful template questions</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Menu Button & Connection Status */}
            <div className="flex items-center space-x-2">
              {/* Mobile Hamburger Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
              
              {/* Connection Status */}
              {isChecking ? (
                <div className="flex items-center text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                  <span className="text-sm">Checking...</span>
                </div>
              ) : isOnline ? (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                  <WifiIcon className="h-3 w-3 mr-1" />
                  <span>Online</span>
                </div>
              ) : (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                  <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                  <span>Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl space-y-4">


            {/* Chat messages */}
            {messages.length > 0 && (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  } animate-fade-in`}
                >
                  <div
                    className={`max-w-2xl rounded-lg ${
                      message.type === "user"
                        ? "px-4 py-2 text-gray-700"
                        : "px-0 py-3 text-gray-800"
                    }`}
                    style={{
                      backgroundColor: message.type === "user" ? '#e9e7e3' : 'transparent'
                    }}
                  >
                    <div className={`${message.type === "user" ? "flex items-start space-x-3" : "block"}`}>
                      {/* Avatar - only for user messages */}
                      {message.type === "user" && (
                        <div className="flex-shrink-0">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                            style={{
                              backgroundColor: '#4A4A4A',
                              color: 'white'
                            }}
                          >
                            DU
                          </div>
                        </div>
                      )}
                      
                      {/* Message content */}
                      <div className={`text-left ${message.type === "user" ? "flex-1" : "w-full ml-0"}`}>
                        {message.isStreaming && !message.content ? (
                          // Typing indicator
                          <div className="flex items-center space-x-1">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <span className="text-sm text-gray-500 ml-2">DocChat is typing...</span>
                          </div>
                        ) : (
                          <div className="text-base leading-relaxed chat-serif">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>

                    {message.type === "assistant" && !message.isStreaming && (
                      <div className="text-sm text-gray-500 mt-3 flex items-center justify-end space-x-3">
                        {/* Sources - only show if there are actual document sources */}
                        {message.sources && message.sources.length > 0 && message.sources.some(source => {
                          const fileName = typeof source === 'string' ? source : source.file_name;
                          return fileName && fileName !== 'Unknown source';
                        }) && (
                          <div className="flex items-center space-x-2 mr-auto">
                            <div className="text-xs text-gray-500">
                              📄 {typeof message.sources[0] === 'string' ? message.sources[0] : message.sources[0].file_name || 'Unknown source'}
                            </div>
                            {/* Confidence Badge */}
                            {message.confidence && (
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                message.confidence.level === 'High' 
                                  ? 'bg-green-100 text-green-800' 
                                  : message.confidence.level === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`} style={{
                                backgroundColor: message.confidence.level === 'Low' ? '#FED7AA' : undefined,
                                color: message.confidence.level === 'Low' ? '#D9664A' : undefined
                              }}>
                                {message.confidence.level}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Action buttons */}
                        <div className="flex items-center">
                          <button
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Copy message"
                          >
                            <ClipboardDocumentIcon className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Like"
                          >
                            <HandThumbUpIcon className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Dislike"
                          >
                            <HandThumbDownIcon className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Timestamp */}
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <textarea
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyPress={handleKeyPress}
                placeholder="This is disabled for demo - use the template questions"
                disabled={true}
                rows={1}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none transition-all duration-200 bg-white shadow-sm"
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
              <button
                onClick={handleSendMessage}
                disabled={true}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isQuerying ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                ) : (
                  <ArrowUpIcon className="h-4 w-4 text-gray-600" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              DocChat can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Templates Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Templates Panel */}
          <div className="relative w-80 h-full bg-white shadow-xl">
            <div className="p-4 border-b border-gray-300" style={{ backgroundColor: '#f0efec' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Template Questions</h3>
                  <p className="text-sm text-gray-600">Click any template to get started</p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-0.5 overflow-y-auto h-full">
              {quickTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleTemplateClick(template);
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isQuerying || !isOnline}
                  className="w-full text-left p-3 rounded-lg transition-colors text-sm text-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 hover:text-[#D9664A]"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
