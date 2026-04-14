import { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { fetchWithAuth } from "../utils/auth";
import { API_URLS } from "../config";
import { useNavigate } from "react-router-dom";

interface Document {
  id: string;
  filename: string;
  content?: string;
  metadata?: {
    file_name: string;
    upload_date?: string;
    file_size?: number;
    file_type?: string;
    chunks_count?: number;
    processing_status?: string;
  };
  created_at: string;
  updated_at: string;
}

interface DocumentLibraryCardsProps {
  refreshTrigger?: number;
}

export default function DocumentLibraryCards({ refreshTrigger = 0 }: DocumentLibraryCardsProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch documents from API
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(API_URLS.UPLOAD_DOCUMENTS, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      } else {
        console.error("Failed to fetch documents");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);


  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get status icon and color
  const getStatusDisplay = (status?: string) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircleIcon,
          color: "text-green-600",
          bgColor: "bg-green-100",
          text: "Ready"
        };
      case "processing":
        return {
          icon: ClockIcon,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          text: "Processing"
        };
      case "error":
        return {
          icon: ExclamationTriangleIcon,
          color: "text-red-600",
          bgColor: "bg-red-100",
          text: "Error"
        };
      default:
        return {
          icon: null,
          color: "text-green-700",
          bgColor: "bg-green-100",
          text: "Active"
        };
    }
  };

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: '#D9664A' }}></div>
          <span className="ml-2 text-sm text-gray-600">Loading documents...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Section Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Document Library ({documents.length})</h3>
        <p className="text-sm text-gray-600 mt-1">
          Recent documents and their processing status
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <DocumentTextIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">No documents uploaded yet</p>
            <p className="text-xs text-gray-400">Upload your first document to get started</p>
          </div>
        ) : (
          <table className="w-full divide-y divide-gray-200">
            <thead style={{ backgroundColor: '#e9e7e3' }}>
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  <div className="flex items-center">
                    Document
                    <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  <div className="flex items-center">
                    Type
                    <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  <div className="flex items-center">
                    Size
                    <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  <div className="flex items-center">
                    Status
                    <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  <div className="flex items-center">
                    Date
                    <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.slice(0, 3).map((document) => {
                const statusDisplay = getStatusDisplay(document.metadata?.processing_status);
                const StatusIcon = statusDisplay.icon;

                return (
                  <tr
                    key={document.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate('/library')}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center min-w-0">
                        <img 
                          src={document.metadata?.file_type === 'DOCX' || document.metadata?.file_type === 'DOC' ? '/doc-ico-sm.png' : '/pdf-icon-sm.png'} 
                          alt="Document icon" 
                          className="h-4 w-4 mr-2 flex-shrink-0" 
                        />
                        <p className="text-sm font-medium text-gray-900 truncate" title={document.filename}>
                          {document.filename}
                        </p>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-xs font-medium text-gray-600">
                        {document.metadata?.file_type?.toUpperCase() || "PDF"}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-xs text-gray-500">
                        {document.metadata?.file_size
                          ? formatFileSize(document.metadata.file_size)
                          : "—"}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusDisplay.bgColor} ${statusDisplay.color} ${statusDisplay.text === 'Active' ? 'border-green-200' : ''}`}>
                        {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                        {statusDisplay.text}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-xs text-gray-500">
                        {formatDate(document.created_at)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {documents.length > 3 && (
          <div className="px-4 py-3 text-center border-t border-gray-200">
            <button
              onClick={() => navigate('/dashboard?tab=library')}
              className="inline-flex items-center text-sm font-medium"
              style={{
                color: '#D9664A'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#D9664A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#D9664A';
              }}
            >
              View All
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
