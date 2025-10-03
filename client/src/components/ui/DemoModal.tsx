import { XMarkIcon } from '@heroicons/react/24/outline';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]">
      <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Demo Version</h2>
              <p className="text-base text-gray-600 mt-2 leading-relaxed">
                Experience the power of AI-driven document analysis with DocChat. Upload your PDFs and Word documents, 
                then engage in intelligent conversations to extract insights, find specific information, and understand 
                complex content through natural language queries.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Available Features */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Available Features
              </h3>
              <div className="space-y-2">
                <div className="text-base text-gray-700">• Document Upload</div>
                <div className="text-base text-gray-700">• AI-Powered Chat</div>
                <div className="text-base text-gray-700">• Semantic Search</div>
                <div className="text-base text-gray-700">• Document Library</div>
              </div>
            </div>

            {/* Demo Limitations */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                Demo Limitations
              </h3>
              <div className="space-y-2">
                <div className="text-base text-yellow-700">• Max 3 documents</div>
                <div className="text-base text-yellow-700">• No chat history</div>
                <div className="text-base text-yellow-700">• No settings</div>
                <div className="text-base text-yellow-700">• No Google Drive</div>
                <div className="text-base text-yellow-700">• 50MB file limit</div>
              </div>
            </div>

            {/* Pro Features */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Pro Version
              </h3>
              <div className="space-y-2">
                <div className="text-base text-gray-600">• Unlimited documents</div>
                <div className="text-base text-gray-600">• Persistent history</div>
                <div className="text-base text-gray-600">• Advanced AI</div>
                <div className="text-base text-gray-600">• Team collaboration</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Continue with Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
