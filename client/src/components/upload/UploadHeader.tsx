import { SparklesIcon } from "@heroicons/react/24/outline";

export default function UploadHeader() {
  return (
    <div className="w-full max-w-2xl mb-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 text-left">
          Upload Documents
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-base text-gray-600 max-w-md text-left">
          Transform your documents into an intelligent knowledge base
        </p>
        <button
          onClick={() => window.location.href = '/dashboard?tab=chat'}
          className="flex items-center text-base hover:underline transition-colors cursor-pointer"
          style={{ color: '#D9664A' }}
        >
          <SparklesIcon className="h-5 w-5 mr-2" />
          Chat with AI
        </button>
      </div>
      
      <div className="mt-4 p-3 rounded-lg border" style={{ backgroundColor: '#fefce8', borderColor: '#fde047' }}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5" style={{ color: '#ca8a04' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium" style={{ color: '#713f12' }}>
              Sample Docs Loaded
            </p>
            <p className="text-sm mt-1" style={{ color: '#a16207' }}>
              Ready to explore! Focus on the AI chat - that's where the magic happens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
