import { useNavigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

interface UploadStatsProps {
  queryCount: number;
  averageResponseTime: string;
  confidencePercentages: { high: number; medium: number; low: number };
}

export default function UploadStats({ queryCount, averageResponseTime, confidencePercentages }: UploadStatsProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-2xl mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="backdrop-blur-sm border border-gray-400 rounded-lg p-4 shadow-sm">
          <div className="px-4 py-3 -mx-4 -mt-4 mb-3 border-b border-gray-400 rounded-t-lg" style={{ backgroundColor: '#e9e7e3' }}>
            <h4 className="text-base font-semibold text-gray-900">AI Confidence Analysis</h4>
            <p className="text-xs text-gray-600 mt-1">Last 24 hours</p>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Confidence</span>
                <span className="font-medium text-gray-900 text-right">{queryCount > 0 ? `${confidencePercentages.high + confidencePercentages.medium}%` : '0%'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">AI Accuracy</span>
                <span className="font-medium text-gray-900 text-right">{queryCount > 0 ? `${confidencePercentages.high}%` : '0%'}</span>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-4 flex overflow-hidden">
                <div className="bg-green-300 h-4" style={{ width: `${confidencePercentages.high}%` }}></div>
                <div className="bg-yellow-300 h-4" style={{ width: `${confidencePercentages.medium}%` }}></div>
                <div className="bg-red-300 h-4" style={{ width: `${confidencePercentages.low}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>High {queryCount > 0 ? confidencePercentages.high : 0}%</span>
                <span>Medium {queryCount > 0 ? confidencePercentages.medium : 0}%</span>
                <span>Low {queryCount > 0 ? confidencePercentages.low : 0}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-sm border border-gray-400 rounded-lg p-4 shadow-sm">
          <div className="px-4 py-3 -mx-4 -mt-4 mb-3 border-b border-gray-400 rounded-t-lg" style={{ backgroundColor: '#e9e7e3' }}>
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-gray-900">RAG Engine</h4>
              <button
                onClick={() => navigate('/settings')}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Settings"
              >
                <Cog6ToothIcon className="h-4.5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Search Mode</span>
              <span className="font-medium cursor-pointer hover:underline" style={{ color: '#D9664A' }}>Semantic</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">AI Model</span>
              <span className="font-medium cursor-pointer hover:underline" style={{ color: '#D9664A' }}>GPT-4</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Context</span>
              <span className="font-medium cursor-pointer hover:underline" style={{ color: '#D9664A' }}>Multi-doc</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Embeddings</span>
              <span className="font-medium text-gray-900">1,536</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Chunks</span>
              <span className="font-medium text-gray-900">269</span>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-sm border border-gray-400 rounded-lg p-4 shadow-sm">
          <div className="px-4 py-3 -mx-4 -mt-4 mb-3 border-b border-gray-400 rounded-t-lg" style={{ backgroundColor: '#e9e7e3' }}>
            <h4 className="text-base font-semibold text-gray-900">Query Analytics</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-medium text-gray-900">{queryCount > 0 ? '100%' : '0%'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg Response</span>
              <span className="font-medium text-gray-900">{queryCount > 0 ? `${averageResponseTime}s` : '0s'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Today</span>
              <span className="font-medium text-gray-900">{queryCount} queries</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-left">
        <p className="text-xs text-gray-500 italic">
          The cards above are dynamically generated and can be customized to your specific needs and workflows
        </p>
      </div>
    </div>
  );
}
