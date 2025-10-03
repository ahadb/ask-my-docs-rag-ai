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
        <p className="text-sm font-medium" style={{ color: '#713f12' }}>
          Sample Docs Loaded
        </p>
        <p className="text-sm mt-1" style={{ color: '#a16207' }}>
          Ready to explore! Focus on the AI chat - that's where the magic happens.
        </p>
      </div>
    </div>
  );
}
