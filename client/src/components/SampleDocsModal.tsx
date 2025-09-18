import { useState } from "react";
import {
  XMarkIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  CogIcon,
  ScaleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface SampleDocument {
  id: string;
  title: string;
  description: string;
  fileType: "PDF" | "DOCX";
  category: string;
  icon: React.ComponentType<any>;
  color: string;
  size: string;
  downloadUrl: string;
}

interface SampleDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SampleDocsModal({ isOpen, onClose }: SampleDocsModalProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const sampleDocuments: SampleDocument[] = [
    {
      id: "employee-handbook",
      title: "Employee Handbook",
      description: "Complete HR policies, benefits, vacation rules, and workplace guidelines",
      fileType: "PDF",
      category: "Human Resources",
      icon: BuildingOfficeIcon,
      color: "bg-blue-500",
      size: "2.3 MB",
      downloadUrl: "/sample_docs/AcmeTech_Employee_Handbook.pdf"
    },
    {
      id: "technical-guide",
      title: "RAG Technical Guide",
      description: "AI architecture, vector databases, embedding models, and implementation details",
      fileType: "PDF",
      category: "Technology",
      icon: CogIcon,
      color: "bg-purple-500",
      size: "1.8 MB",
      downloadUrl: "/sample_docs/RAG_Technical_Guide.pdf"
    },
    {
      id: "legal-terms",
      title: "Legal & Compliance",
      description: "Terms of service, privacy policies, data protection, and regulatory compliance",
      fileType: "DOCX",
      category: "Legal",
      icon: ScaleIcon,
      color: "bg-green-500",
      size: "1.2 MB",
      downloadUrl: "/sample_docs/Legal_Compliance.docx"
    },
    {
      id: "marketing-strategy",
      title: "Marketing Strategy",
      description: "Business plans, market analysis, customer segments, and growth strategies",
      fileType: "PDF",
      category: "Business",
      icon: ChartBarIcon,
      color: "bg-orange-500",
      size: "2.1 MB",
      downloadUrl: "/sample_docs/Marketing_Strategy.pdf"
    }
  ];

  const handleDownload = async (doc: SampleDocument) => {
    setDownloading(doc.id);
    
    try {
      // Simulate download (replace with actual download logic)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create download link
      const link = document.createElement('a');
      link.href = doc.downloadUrl;
      link.download = `${doc.title}.${doc.fileType.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black/85"
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="relative bg-white rounded-lg shadow-2xl border border-gray-300 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Content */}
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-medium text-gray-900">
                Get Started with Sample Documents
              </h3>
              <p className="text-base text-gray-500">
                Download and upload these sample documents to experience the power of AI-driven search
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Sample Documents Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {sampleDocuments.map((doc) => {
              const IconComponent = doc.icon;
              const isDownloading = downloading === doc.id;
              
              return (
                <div
                  key={doc.id}
                  className="relative bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col h-full"
                >
                  {/* Document Icon */}
                  <div className="flex justify-center mb-4">
                    <IconComponent className="h-8 w-8 text-gray-600" />
                  </div>

                  {/* Document Title */}
                  <div className="text-center mb-3">
                    <h4 className="text-base font-medium text-gray-900 mb-2">{doc.title}</h4>
                    <div className="flex flex-col items-center space-y-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {doc.category}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{doc.fileType}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{doc.size}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed text-center flex-1">
                    {doc.description}
                  </p>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(doc)}
                    disabled={isDownloading}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isDownloading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        Download
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <DocumentTextIcon className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-base font-medium text-blue-800">How to use sample documents:</h4>
                <div className="mt-2 text-base text-blue-700">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Download one or more sample documents above</li>
                    <li>Drag and drop them into the upload area</li>
                    <li>Wait for processing to complete</li>
                    <li>Ask questions about the content and see the AI magic!</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Sample documents are for demonstration purposes only
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Skip for now
              </button>
            </div>
        </div>
      </div>
    </div>
    </div>
  );
}
