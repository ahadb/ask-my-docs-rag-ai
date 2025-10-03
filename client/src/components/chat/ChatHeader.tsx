import { WifiIcon, ExclamationTriangleIcon, Bars3Icon } from "@heroicons/react/24/outline";

interface ChatHeaderProps {
  isOnline: boolean;
  isChecking: boolean;
  onToggleMobileMenu: () => void;
}

export default function ChatHeader({ isOnline, isChecking, onToggleMobileMenu }: ChatHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-300" style={{ backgroundColor: '#e9e7e3' }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">AI Assistant</h2>
          <p className="text-sm text-gray-600">
            Ask questions about your uploaded documents
          </p>
          
          {/* AI Templates Badge */}
          <div className="mt-3 inline-block">
            <div className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: '#fefce8', borderColor: '#fde047', color: '#713f12', border: '1px solid #fde047' }}>
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-2">
                  <svg className="h-4 w-4" style={{ color: '#ca8a04' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Try our AI with our powerful template questions</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Button & Connection Status */}
        <div className="flex items-center space-x-2">
          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          
          {/* Connection Status */}
          {isChecking ? (
            <div className="flex items-center text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
              <span className="text-sm">Checking...</span>
            </div>
          ) : isOnline ? (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
              <WifiIcon className="h-3 w-3 mr-1" />
              <span>Online</span>
            </div>
          ) : (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
              <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
              <span>Offline</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
