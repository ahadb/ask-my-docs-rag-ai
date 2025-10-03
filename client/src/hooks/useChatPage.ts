import { useChat } from './useChat';
import { useChatUI } from './useChatUI';
import { useChatActions } from './useChatActions';

export interface ChatPageProps {
  onQuerySent?: () => void;
  onResponseTime?: (time: number) => void;
  onConfidenceLevel?: (level: 'high' | 'medium' | 'low') => void;
  onMessageSent?: (message: any) => void;
  onMessageReceived?: (message: any) => void;
}

export interface UseChatPageReturn {
  // Chat state and actions
  chat: ReturnType<typeof useChat>;
  
  // UI state and actions
  ui: ReturnType<typeof useChatUI>;
  
  // Action handlers
  actions: ReturnType<typeof useChatActions>;
  
  // Combined convenience methods
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  toggleMobileMenu: () => void;
  openSources: (message: any) => void;
  closeSources: () => void;
}

export function useChatPage(props: ChatPageProps = {}): UseChatPageReturn {
  // Initialize all hooks
  const chat = useChat();
  const ui = useChatUI();
  const actions = useChatActions({
    onQuerySent: props.onQuerySent,
    onResponseTime: props.onResponseTime,
    onConfidenceLevel: props.onConfidenceLevel,
    onMessageSent: props.onMessageSent,
    onMessageReceived: props.onMessageReceived,
  });

  // Combined convenience methods
  const sendMessage = async (content: string) => {
    await actions.handleSendMessage(content);
    await chat.sendMessage(content);
  };

  const clearChat = () => {
    chat.clearMessages();
    actions.handleClearHistory();
  };

  const toggleMobileMenu = () => {
    ui.toggleMobileMenu();
  };

  const openSources = (message: any) => {
    ui.openSources(message);
  };

  const closeSources = () => {
    ui.closeSources();
  };

  return {
    // Individual hooks
    chat,
    ui,
    actions,
    
    // Combined convenience methods
    sendMessage,
    clearChat,
    toggleMobileMenu,
    openSources,
    closeSources,
  };
}
