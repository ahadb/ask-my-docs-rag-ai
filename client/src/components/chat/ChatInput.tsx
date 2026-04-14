import { ArrowUpIcon } from "@heroicons/react/24/outline";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isQuerying: boolean;
  disabled?: boolean;
}

export default function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  onKeyPress, 
  isQuerying, 
  disabled = false 
}: ChatInputProps) {
  return (
    <div className="p-4 border-t border-gray-200">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyPress={onKeyPress}
            placeholder={disabled ? "Chat input disabled for demo - use quick templates on the left" : "Ask me anything about your documents..."}
            disabled={disabled}
            rows={1}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none transition-all duration-200 bg-white shadow-sm"
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />
          <button
            onClick={onSend}
            disabled={disabled}
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
          {disabled ? "Demo mode - Chat input disabled. Use quick templates to interact with the AI." : "DocChat can make mistakes. Consider checking important information."}
        </p>
      </div>
    </div>
  );
}
