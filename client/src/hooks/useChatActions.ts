import { useCallback } from 'react';
import type { ChatMessage } from './useChat';

export interface ChatActionsProps {
  onQuerySent?: () => void;
  onResponseTime?: (time: number) => void;
  onConfidenceLevel?: (level: 'high' | 'medium' | 'low') => void;
  onMessageSent?: (message: ChatMessage) => void;
  onMessageReceived?: (message: ChatMessage) => void;
}

export interface ChatActionsReturn {
  handleSendMessage: (content: string) => Promise<void>;
  handleRetry: (messageId: string) => Promise<void>;
  handleCopy: (content: string) => Promise<void>;
  handleLike: (messageId: string) => void;
  handleDislike: (messageId: string) => void;
  handleShare: (messageId: string) => Promise<void>;
  handleExport: (format: 'txt' | 'json' | 'pdf') => Promise<void>;
  handleClearHistory: () => void;
  handleToggleConfidence: () => void;
  handleToggleSources: (message: ChatMessage) => void;
}

export function useChatActions({
  onQuerySent,
  onResponseTime,
}: ChatActionsProps = {}): ChatActionsReturn {
  
  // Send a message
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    try {
      onQuerySent?.();
      
      // This would integrate with your actual API
      // For now, just simulate the action
      console.log('Sending message:', content);
      
      // Simulate response time
      const startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 1000));
      const responseTime = Date.now() - startTime;
      
      onResponseTime?.(responseTime);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }, [onQuerySent, onResponseTime]);

  // Retry a message
  const handleRetry = useCallback(async (messageId: string) => {
    try {
      console.log('Retrying message:', messageId);
      // This would retry the actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to retry message:', error);
      throw error;
    }
  }, []);

  // Copy message content to clipboard
  const handleCopy = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      console.log('Message copied to clipboard');
    } catch (error) {
      console.error('Failed to copy message:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }, []);

  // Like a message
  const handleLike = useCallback((messageId: string) => {
    console.log('Liked message:', messageId);
    // This would update the message in your backend
    // For now, just log the action
  }, []);

  // Dislike a message
  const handleDislike = useCallback((messageId: string) => {
    console.log('Disliked message:', messageId);
    // This would update the message in your backend
    // For now, just log the action
  }, []);

  // Share a message
  const handleShare = useCallback(async (messageId: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Chat Message',
          text: `Check out this message from our chat: ${messageId}`,
        });
      } else {
        // Fallback: copy to clipboard
        await handleCopy(`Shared message: ${messageId}`);
      }
    } catch (error) {
      console.error('Failed to share message:', error);
    }
  }, [handleCopy]);

  // Export chat history
  const handleExport = useCallback(async (format: 'txt' | 'json' | 'pdf') => {
    try {
      console.log(`Exporting chat history as ${format}`);
      // This would generate and download the export file
      // For now, just log the action
    } catch (error) {
      console.error('Failed to export chat:', error);
    }
  }, []);

  // Clear chat history
  const handleClearHistory = useCallback(() => {
    console.log('Clearing chat history');
    // This would clear the messages in your state
    // The actual implementation would be handled by the parent component
  }, []);

  // Toggle confidence display
  const handleToggleConfidence = useCallback(() => {
    console.log('Toggling confidence display');
    // This would toggle the confidence display in your UI
  }, []);

  // Toggle sources modal
  const handleToggleSources = useCallback((message: ChatMessage) => {
    console.log('Toggling sources for message:', message.id);
    // This would open/close the sources modal
  }, []);

  return {
    handleSendMessage,
    handleRetry,
    handleCopy,
    handleLike,
    handleDislike,
    handleShare,
    handleExport,
    handleClearHistory,
    handleToggleConfidence,
    handleToggleSources,
  };
}
