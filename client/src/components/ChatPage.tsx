import { useCallback } from "react";
import { API_URLS, DEMO_CONFIG } from "../config";
import { TEMPLATE_QUESTIONS } from "../services/mockResponses";
import { fetchWithSmartRouting } from "../services/smartApi";
import { useInternetConnection } from "../hooks/useInternetConnection";
import { useChatPage } from "../hooks/useChatPage";
import ChatHeader from "./chat/ChatHeader";
import ChatMessage from "./chat/ChatMessage";
import ChatInput from "./chat/ChatInput";
import TemplateSidebar from "./chat/TemplateSidebar";
import MobileMenu from "./chat/MobileMenu";
import { useEffect, useRef } from "react";

interface ChatProps {
  recentChats: Array<{ id: string; title: string; confidence?: 'high' | 'medium' | 'low' }>;
  setRecentChats: React.Dispatch<React.SetStateAction<Array<{ id: string; title: string; confidence?: 'high' | 'medium' | 'low' }>>>;
  onQuerySent?: () => void;
  onResponseTime?: (time: number) => void;
  onConfidenceLevel?: (level: 'high' | 'medium' | 'low') => void;
  recentChat?: { id: string; title: string; confidence?: 'high' | 'medium' | 'low' };
}

export default function ChatPage({ 
  setRecentChats, 
  onQuerySent, 
  onResponseTime,
  onConfidenceLevel,
  recentChat
}: ChatProps) {
  // Custom hooks
  const { chat, ui, actions } = useChatPage({
    onQuerySent,
    onResponseTime,
    onConfidenceLevel,
  });

  // Internet connection hook
  const { isOnline, isChecking } = useInternetConnection();

  // Ref to track processed recent chat to prevent infinite loops
  const processedRecentChatRef = useRef<string | null>(null);

  // Quick template questions for demo - imported from mock responses service
  const quickTemplates = TEMPLATE_QUESTIONS;

  // Enhanced sendQuery function that integrates with hooks
  const sendQuery = useCallback(async (question: string) => {
    if (!question.trim()) return;
    
    // Start timing the response
    const startTime = Date.now();
    
    // Only proceed if we have internet connection
    if (!isOnline) {
      chat.addMessage({
        type: "assistant",
        content: "⚠️ No internet connection detected. Please check your connection and try again.",
      });
      return;
    }

    // Add user message
    chat.addMessage({
      type: "user",
      content: question,
    });

    // Clear input and set querying state
    chat.setInputValue("");
    chat.setIsQuerying(true);

    // Add typing indicator
    const typingMessage = {
      id: "typing-" + Date.now().toString(),
      type: "assistant" as const,
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    chat.setMessages((prev) => [...prev, typingMessage]);

    try {
      // Use streaming endpoint
      console.log('🔍 Sending query:', question);
      console.log('🔍 Mock config:', { ENABLED: DEMO_CONFIG.ENABLED, MOCK_ALL_QUERIES: DEMO_CONFIG.MOCK_ALL_QUERIES });
      
      const response = await fetchWithSmartRouting(`${API_URLS.QUERY}/stream`, {
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

      // Remove typing indicator
      chat.setMessages((prev) => prev.filter(msg => msg.id !== typingMessage.id));

      // Create the assistant message with a fixed ID
      const assistantMessageId = (Date.now() + 1).toString();
      let currentContent = '';
      let confidenceData: { level: string; explanation: string } | undefined = undefined;

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      
      // Check if this is a regular JSON response (from mock) or streaming response
      const firstChunk = await reader.read();
      if (firstChunk.done) {
        throw new Error('Empty response');
      }
      
      const firstChunkText = decoder.decode(firstChunk.value);
      
      // If it's a regular JSON response (not streaming), handle it directly
      if (!firstChunkText.includes('data: ')) {
        try {
          const jsonResponse = JSON.parse(firstChunkText);
          
          // Add assistant message (user message already added above)
          chat.addMessage({
            type: "assistant",
            content: jsonResponse.answer,
            sources: jsonResponse.sources || [],
            confidence: jsonResponse.confidence,
          });
          
          // Track confidence level for mock responses
          if (onConfidenceLevel && jsonResponse.confidence?.level) {
            const level = jsonResponse.confidence.level.toLowerCase() as 'high' | 'medium' | 'low';
            onConfidenceLevel(level);
          }
          
          // Add to recent chats for mock responses
          setRecentChats(prev => {
            // Remove if already exists (to move to top)
            const filtered = prev.filter(chat => chat.title !== question);
            // Add to beginning and limit to 6 items
            const newChat = {
              id: Date.now().toString(),
              title: question.length > 50 ? question.substring(0, 50) + "..." : question,
              confidence: jsonResponse.confidence?.level?.toLowerCase() as 'high' | 'medium' | 'low'
            };
            return [newChat, ...filtered].slice(0, 6);
          });
          
          return;
        } catch (error) {
          console.error('Failed to parse JSON response:', error);
          throw new Error('Invalid response format');
        }
      }
      
      // Handle streaming response
      const decoder2 = new TextDecoder();
      let buffer = firstChunkText;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder2.decode(value);
        const lines = buffer.split('\n');
        
        // Keep the last incomplete line in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'start') {
                // Initialize the message
                chat.setMessages((prev) => [...prev, {
                  id: assistantMessageId,
                  type: "assistant" as const,
                  content: "",
                  timestamp: new Date(),
                  sources: [],
                  confidence: undefined,
                  isStreaming: true,
                }]);
              } else if (data.type === 'content') {
                // Update content as it streams
                currentContent = data.full_content;
                chat.setMessages((prev) => 
                  prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: currentContent, isStreaming: true }
                      : msg
                  )
                );
              } else if (data.type === 'complete') {
                // Finalize the message
                confidenceData = data.confidence;
                
                if (data.cached) {
                  // Cached response - show instantly without streaming animation
                  chat.setMessages((prev) => [...prev, {
                    id: assistantMessageId,
                    type: "assistant" as const,
                    content: data.answer,
                    timestamp: new Date(),
                    sources: data.sources || [],
                    confidence: confidenceData || undefined,
                    isStreaming: false,
                  }]);
                } else {
                  // Streaming response - update existing message
                  chat.setMessages((prev) => 
                    prev.map(msg => 
                      msg.id === assistantMessageId 
                        ? { 
                            ...msg, 
                            content: data.answer, 
                            confidence: confidenceData || undefined,
                            isStreaming: false 
                          }
                        : msg
                    )
                  );
                }
              } else if (data.type === 'metadata') {
                // Update message with sources and metadata
                chat.setMessages((prev) => 
                  prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { 
                          ...msg, 
                          sources: data.sources || [],
                          confidence: data.confidence || msg.confidence
                        }
                      : msg
                  )
                );
              } else if (data.type === 'error') {
                // Handle errors
                chat.setMessages((prev) => 
                  prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { 
                          ...msg, 
                          content: `Error: ${data.error}`, 
                          isStreaming: false 
                        }
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error('Error parsing streaming data:', e);
            }
          }
        }
      }
      
      // Process any remaining buffer
      if (buffer.trim()) {
        const lines = buffer.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              // Handle any remaining data if needed
              console.log('Final buffer data:', data);
            } catch (e) {
              console.error('Error parsing final buffer data:', e);
            }
          }
        }
      }

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
      
      // Add to recent chats for all queries (not just templates)
      setRecentChats(prev => {
        // Remove if already exists (to move to top)
        const filtered = prev.filter(chat => chat.title !== question);
        // Add to beginning and limit to 6 items
        const newChat = {
          id: Date.now().toString(),
          title: question.length > 50 ? question.substring(0, 50) + "..." : question,
          confidence: confidenceData?.level?.toLowerCase() as 'high' | 'medium' | 'low'
        };
        return [newChat, ...filtered].slice(0, 6);
      });

    } catch (error) {
      console.error("Query error:", error);
      
      // Remove typing indicator
      chat.setMessages((prev) => prev.filter(msg => msg.id !== typingMessage.id));
      
      chat.addMessage({
        type: "assistant",
        content: "Sorry, I encountered an error while processing your question. Please try again.",
      });
    } finally {
      chat.setIsQuerying(false);
    }
  }, [isOnline, onResponseTime, onConfidenceLevel, chat, setRecentChats]);

  // Replay recent chat when provided
  useEffect(() => {
    if (recentChat && recentChat.title && processedRecentChatRef.current !== recentChat.id) {
      // Mark this chat as processed
      processedRecentChatRef.current = recentChat.id;
      
      // Clear existing messages
      chat.setMessages([]);
      // Replay the question using the actual API call
      sendQuery(recentChat.title);
    }
  }, [recentChat]);

  const handleSendMessage = useCallback(() => {
    if (chat.inputValue.trim() && !chat.isQuerying) {
      sendQuery(chat.inputValue);
    }
  }, [chat.inputValue, chat.isQuerying, sendQuery]);

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
    chat.setInputValue(template);
    sendQuery(template);
    
    // Increment query count
    if (onQuerySent) {
      onQuerySent();
    }
    
    // Recent chat addition is now handled in sendQuery function
  }, [sendQuery, onQuerySent, chat]);

  return (
    <div className="flex w-full h-full" style={{ backgroundColor: '#f7f6f4' }}>
      {/* Templates Sidebar - Hidden on mobile */}
      <TemplateSidebar
        templates={quickTemplates}
        onTemplateClick={handleTemplateClick}
        isQuerying={chat.isQuerying}
        isOnline={isOnline}
      />

      {/* Chat Interface */}
      <div className="flex flex-col h-full flex-1">
        {/* Chat Header */}
        <ChatHeader
          isOnline={isOnline}
          isChecking={isChecking}
          onToggleMobileMenu={ui.toggleMobileMenu}
        />

        {/* Chat Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl space-y-4">
            {/* Chat messages */}
            {chat.messages.length > 0 && (
              chat.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onCopy={actions.handleCopy}
                  onLike={actions.handleLike}
                  onDislike={actions.handleDislike}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat Input Area */}
        <ChatInput
          value={chat.inputValue}
          onChange={chat.setInputValue}
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
          isQuerying={chat.isQuerying}
          disabled={true}
        />
      </div>

      {/* Mobile Templates Overlay */}
      <MobileMenu
        isOpen={ui.isMobileMenuOpen}
        onClose={ui.toggleMobileMenu}
        templates={quickTemplates}
        onTemplateClick={handleTemplateClick}
        isQuerying={chat.isQuerying}
        isOnline={isOnline}
      />
    </div>
  );
}
