import { createContext, useContext, useState, type ReactNode } from 'react';

// Types
interface Chat {
  id: string;
  title: string;
  confidence?: 'high' | 'medium' | 'low';
}

interface AppContextType {
  showDemoModal: boolean;
  setShowDemoModal: (show: boolean) => void;
  recentChats: Chat[];
  setRecentChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// AppProvider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [recentChats, setRecentChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const value: AppContextType = {
    showDemoModal,
    setShowDemoModal,
    recentChats,
    setRecentChats,
    selectedChat,
    setSelectedChat,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use app context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
