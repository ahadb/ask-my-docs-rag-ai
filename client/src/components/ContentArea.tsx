import { useState, useEffect } from "react";
import DocumentLibrary from "./DocumentLibrary";
import DashboardTabs from "./DashboardTabs";
import Upload from "./Upload";
import Chat from "./Chat";

interface ContentAreaProps {
  recentChats: Array<{ id: string; title: string; confidence?: 'high' | 'medium' | 'low' }>;
  setRecentChats: React.Dispatch<React.SetStateAction<Array<{ id: string; title: string; confidence?: 'high' | 'medium' | 'low' }>>>;
}

export default function ContentArea({ recentChats, setRecentChats }: ContentAreaProps) {
  const [documentRefreshTrigger, setDocumentRefreshTrigger] = useState(0);
  const [queryCount, setQueryCount] = useState(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [confidenceLevels, setConfidenceLevels] = useState<{ high: number; medium: number; low: number }>({
    high: 0,
    medium: 0,
    low: 0
  });
  
  // Chat state - moved from Chat component to persist across tab switches
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      type: "user" | "assistant";
      content: string;
      timestamp: Date;
      sources?: Array<any>;
      confidence?: { level: string; explanation: string };
      isStreaming?: boolean;
    }>
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Set up initial assistant message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'initial',
        type: 'assistant',
        content: "Hello! I'm here to help you with your documents. Use the sample docs preloaded and ask questions about them.",
        timestamp: new Date(),
      }]);
    }
  }, [messages.length, setMessages]);

  // Calculate average response time
  const averageResponseTime = responseTimes.length > 0 
    ? (responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length).toFixed(1)
    : "0";

  // Calculate confidence percentages
  const totalConfidence = confidenceLevels.high + confidenceLevels.medium + confidenceLevels.low;
  const confidencePercentages = totalConfidence > 0 ? {
    high: Math.round((confidenceLevels.high / totalConfidence) * 100),
    medium: Math.round((confidenceLevels.medium / totalConfidence) * 100),
    low: Math.round((confidenceLevels.low / totalConfidence) * 100)
  } : { high: 0, medium: 0, low: 0 };





  return (
    <div className="w-full h-[calc(100vh-3rem)] lg:pl-70 overflow-x-hidden" style={{ backgroundColor: '#f7f6f4' }}>
      <DashboardTabs
        children={{
          upload: (
            <Upload 
              onUploadComplete={() => setDocumentRefreshTrigger(prev => prev + 1)}
              documentRefreshTrigger={documentRefreshTrigger}
              queryCount={queryCount}
              averageResponseTime={averageResponseTime}
              confidencePercentages={confidencePercentages}
            />
          ),
          library: (
            <DocumentLibrary />
          ),
          chat: (
            <Chat 
              recentChats={recentChats} 
              setRecentChats={setRecentChats} 
              onQuerySent={() => setQueryCount(prev => prev + 1)}
              onResponseTime={(time) => setResponseTimes(prev => [...prev, time])}
              onConfidenceLevel={(level) => setConfidenceLevels(prev => ({
                ...prev,
                [level]: prev[level] + 1
              }))}
              messages={messages}
              setMessages={setMessages}
              inputValue={inputValue}
              setInputValue={setInputValue}
              isQuerying={isQuerying}
              setIsQuerying={setIsQuerying}
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
          ),
        }}
      />
    </div>
  );
  
}
