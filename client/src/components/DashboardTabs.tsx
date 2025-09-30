import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CloudArrowUpIcon, FolderIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

interface DashboardTabsProps {
  children: {
    upload: React.ReactNode;
    library: React.ReactNode;
    chat: React.ReactNode;
  };
}

export default function DashboardTabs({ children }: DashboardTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'upload' | 'library' | 'chat'>('upload');

  // Initialize active tab from URL params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['upload', 'library', 'chat'].includes(tabParam)) {
      setActiveTab(tabParam as 'upload' | 'library' | 'chat');
    } else {
      // Default to upload if no valid tab param
      setActiveTab('upload');
    }
  }, [searchParams]);

  // Handle tab change and update URL
  const handleTabChange = (tabId: 'upload' | 'library' | 'chat') => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const tabs = [
    {
      id: 'upload' as const,
      name: 'Upload',
      icon: CloudArrowUpIcon,
    },
    {
      id: 'library' as const,
      name: 'Document Library',
      icon: FolderIcon,
    },
    {
      id: 'chat' as const,
      name: 'Chat',
      icon: ChatBubbleLeftRightIcon,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="px-6 py-4 border-b" style={{ borderColor: '#dddddd', backgroundColor: 'transparent' }}>
        <div className="flex space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? ''
                    : 'hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: isActive ? '#e9e7e3' : 'transparent',
                  color: isActive ? '#D9664A' : '#4A4A4A'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#D9664A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#4A4A4A';
                  }
                }}
              >
                <Icon 
                  className="h-4 w-4" 
                  style={{
                    color: isActive ? '#D9664A' : '#4A4A4A'
                  }}
                />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'upload' && (
          <div className="h-full">
            {children.upload}
          </div>
        )}
        
        {activeTab === 'library' && (
          <div className="h-full">
            {children.library}
          </div>
        )}
        
        {activeTab === 'chat' && (
          <div className="h-full">
            {children.chat}
          </div>
        )}
      </div>
    </div>
  );
}
