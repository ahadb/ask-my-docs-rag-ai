import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showDemoModal, setShowDemoModal, recentChats, setSelectedChat } = useApp();

  const showHeader = location.pathname === "/settings" || 
                    location.pathname === "/dashboard" || 
                    location.pathname === "/library";

  const handleChatClick = (chat: { id: string; title: string; confidence?: 'high' | 'medium' | 'low' }) => {
    // Set the selected chat
    setSelectedChat(chat);
    
    // Navigate to chat page (don't reorder recent chats)
    navigate('/chat');
  };

  return (
    <div>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={logout}
        recentChats={recentChats}
        onChatClick={handleChatClick}
      />
      {showHeader && (
        <Header
          setSidebarOpen={setSidebarOpen}
          onNavigateHome={() => window.location.href = "/"}
          onLogout={logout}
          user={user}
          showDemoModal={showDemoModal}
          setShowDemoModal={setShowDemoModal}
        />
      )}
      {children}
    </div>
  );
}
