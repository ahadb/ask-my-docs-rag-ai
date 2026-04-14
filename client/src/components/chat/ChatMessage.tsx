import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ClipboardDocumentIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/outline";

interface ChatMessageProps {
  message: {
    id: string;
    type: "user" | "assistant";
    content: string;
    timestamp: Date;
    sources?: Array<any>;
    confidence?: { level: string; explanation: string };
    isStreaming?: boolean;
  };
  onCopy: (content: string) => void;
  onLike: (messageId: string) => void;
  onDislike: (messageId: string) => void;
}

export default function ChatMessage({ message, onCopy, onLike, onDislike }: ChatMessageProps) {
  return (
    <div
      className={`flex ${
        message.type === "user" ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      <div
        className={`max-w-2xl rounded-lg ${
          message.type === "user"
            ? "px-4 py-2 text-gray-700"
            : "px-0 py-3 text-gray-800"
        }`}
        style={{
          backgroundColor: message.type === "user" ? '#e9e7e3' : 'transparent'
        }}
      >
        <div className={`${message.type === "user" ? "flex items-start space-x-3" : "block"}`}>
          {/* Avatar - only for user messages */}
          {message.type === "user" && (
            <div className="flex-shrink-0">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                style={{
                  backgroundColor: '#4A4A4A',
                  color: 'white'
                }}
              >
                DU
              </div>
            </div>
          )}
          
          {/* Message content */}
          <div className={`text-left ${message.type === "user" ? "flex-1" : "w-full ml-0"}`}>
            {message.isStreaming && !message.content ? (
              // Typing indicator
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-gray-500 ml-2">DocChat is typing...</span>
              </div>
            ) : (
              <div className="text-base leading-relaxed chat-serif prose prose-sm max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ children, ...props }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full border-collapse border border-gray-300 bg-white" {...props}>
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children, ...props }) => (
                      <thead className="bg-gray-50" {...props}>
                        {children}
                      </thead>
                    ),
                    tbody: ({ children, ...props }) => (
                      <tbody className="divide-y divide-gray-200" {...props}>
                        {children}
                      </tbody>
                    ),
                    tr: ({ children, ...props }) => (
                      <tr className="hover:bg-gray-50" {...props}>
                        {children}
                      </tr>
                    ),
                    th: ({ children, ...props }) => (
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300" {...props}>
                        {children}
                      </th>
                    ),
                    td: ({ children, ...props }) => (
                      <td className="px-4 py-2 text-sm text-gray-900 border border-gray-300" {...props}>
                        {children}
                      </td>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {message.type === "assistant" && !message.isStreaming && (
          <div className="text-sm text-gray-500 mt-3 flex items-center justify-end space-x-3">
            {/* Sources - only show if there are actual document sources */}
            {message.sources && message.sources.length > 0 && message.sources.some(source => {
              const fileName = typeof source === 'string' ? source : source.file_name;
              return fileName && fileName !== 'Unknown source';
            }) && (
              <div className="flex items-center space-x-2 mr-auto">
                <div className="text-xs text-gray-500">
                  📄 {typeof message.sources[0] === 'string' ? message.sources[0] : message.sources[0].file_name || 'Unknown source'}
                </div>
                {/* Confidence Badge */}
                {message.confidence && (
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    message.confidence.level === 'High' 
                      ? 'bg-green-100 text-green-800' 
                      : message.confidence.level === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-orange-100 text-orange-800'
                  }`} style={{
                    backgroundColor: message.confidence.level === 'Low' ? '#FED7AA' : undefined,
                    color: message.confidence.level === 'Low' ? '#D9664A' : undefined
                  }}>
                    {message.confidence.level}
                  </div>
                )}
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex items-center">
              <button
                onClick={() => onCopy(message.content)}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Copy message"
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onLike(message.id)}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Like"
              >
                <HandThumbUpIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDislike(message.id)}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Dislike"
              >
                <HandThumbDownIcon className="h-4 w-4" />
              </button>
            </div>
            
            {/* Timestamp */}
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
