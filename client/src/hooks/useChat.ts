import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<any>;
  confidence?: { level: string; explanation: string };
  isStreaming?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  inputValue: string;
  isQuerying: boolean;
}

export interface ChatActions {
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setInputValue: (value: string) => void;
  setIsQuerying: (querying: boolean) => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  retryMessage: (messageId: string) => Promise<void>;
}

export interface UseChatReturn extends ChatState, ChatActions {}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);

  // Add a new message
  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
  }, []);

  // Update an existing message
  const updateMessage = useCallback((id: string, updates: Partial<ChatMessage>) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, ...updates } : msg
      )
    );
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Send a message (placeholder - will be implemented with actual API)
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isQuerying) return;

    // Add user message
    addMessage({
      type: 'user',
      content: content.trim(),
    });

    // Clear input
    setInputValue('');
    setIsQuerying(true);

    try {
      // This will be replaced with actual API call
      // For now, just simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addMessage({
        type: 'assistant',
        content: 'This is a placeholder response. The actual API integration will be implemented here.',
        confidence: { level: 'high', explanation: 'Mock response' },
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      addMessage({
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      setIsQuerying(false);
    }
  }, [isQuerying, addMessage]);

  // Retry a message
  const retryMessage = useCallback(async (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (!message || message.type !== 'assistant') return;

    // Remove the failed message
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    
    // Resend the previous user message
    const userMessage = messages[messages.findIndex(msg => msg.id === messageId) - 1];
    if (userMessage && userMessage.type === 'user') {
      await sendMessage(userMessage.content);
    }
  }, [messages, sendMessage]);

  return {
    // State
    messages,
    inputValue,
    isQuerying,
    
    // Actions
    setMessages,
    setInputValue,
    setIsQuerying,
    sendMessage,
    clearMessages,
    addMessage,
    updateMessage,
    retryMessage,
  };
}
