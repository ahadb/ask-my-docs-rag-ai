import { useState, useCallback } from 'react';
import type { ChatMessage } from './useChat';

export interface ChatUIState {
  isMobileMenuOpen: boolean;
  showSources: boolean;
  selectedMessage: ChatMessage | null;
  isFullscreen: boolean;
  showConfidence: boolean;
}

export interface ChatUIActions {
  setIsMobileMenuOpen: (open: boolean) => void;
  setShowSources: (show: boolean) => void;
  setSelectedMessage: (message: ChatMessage | null) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setShowConfidence: (show: boolean) => void;
  toggleMobileMenu: () => void;
  toggleSources: () => void;
  toggleFullscreen: () => void;
  toggleConfidence: () => void;
  openSources: (message: ChatMessage) => void;
  closeSources: () => void;
}

export interface UseChatUIReturn extends ChatUIState, ChatUIActions {}

export function useChatUI(): UseChatUIReturn {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showConfidence, setShowConfidence] = useState(true);

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Toggle sources modal
  const toggleSources = useCallback(() => {
    setShowSources(prev => !prev);
    if (showSources) {
      setSelectedMessage(null);
    }
  }, [showSources]);

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Toggle confidence display
  const toggleConfidence = useCallback(() => {
    setShowConfidence(prev => !prev);
  }, []);

  // Open sources for a specific message
  const openSources = useCallback((message: ChatMessage) => {
    setSelectedMessage(message);
    setShowSources(true);
  }, []);

  // Close sources modal
  const closeSources = useCallback(() => {
    setShowSources(false);
    setSelectedMessage(null);
  }, []);

  return {
    // State
    isMobileMenuOpen,
    showSources,
    selectedMessage,
    isFullscreen,
    showConfidence,
    
    // Actions
    setIsMobileMenuOpen,
    setShowSources,
    setSelectedMessage,
    setIsFullscreen,
    setShowConfidence,
    toggleMobileMenu,
    toggleSources,
    toggleFullscreen,
    toggleConfidence,
    openSources,
    closeSources,
  };
}
