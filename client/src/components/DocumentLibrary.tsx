import { useState, useEffect } from "react";
import { 
  DocumentTextIcon, 
  TrashIcon, 
  EyeIcon,
  CalendarIcon,
  DocumentIcon
} from "@heroicons/react/24/outline";
import { API_URLS } from "../config";
import { fetchWithAuth } from "../utils/auth";

interface Document {
  id: string;
  filename: string;
  created_at: string;
  chunk_count: number;
  status: string;
  metadata: any;
}

interface DocumentLibraryProps {
  refreshTrigger?: number;
}

export default function DocumentLibrary({ refreshTrigger }: DocumentLibraryProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    console.log("DocumentLibrary: refreshTrigger changed to", refreshTrigger);
    loadDocuments();
  }, [refreshTrigger]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      console.log("Loading documents from:", API_URLS.UPLOAD_DOCUMENTS);
      const response = await fetchWithAuth(API_URLS.UPLOAD_DOCUMENTS);
      
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Documents data:", data);
        setDocuments(data.documents);
      } else {
        const errorText = await response.text();
        console.error("Failed to load documents:", errorText);
        setError(`Failed to load documents: ${response.status}`);
      }
    } catch (error) {
      console.error("Error loading documents:", error);
      setError("Error loading documents");
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    try {
      const response = await fetchWithAuth(`${API_URLS.UPLOAD_DOCUMENTS.replace('/documents', '')}/documents/${documentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      } else {
        setError("Failed to delete document");
      }
    } catch (error) {
      setError("Error deleting document");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.pdf')) {
      return <DocumentIcon className="h-6 w-6 text-red-600" />;
    }
    if (filename.endsWith('.docx')) {
      return <DocumentTextIcon className="h-6 w-6 text-blue-600" />;
    }
    return <DocumentIcon className="h-6 w-6 text-gray-500" />;
  };

  const getFileCardStyle = (filename: string) => {
    return "border border-gray-300 hover:border-gray-400";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading documents...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Document Library</h2>
        <p className="text-sm text-gray-600">Manage your uploaded documents</p>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="p-6">
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload your first document to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {(showAll ? documents : documents.slice(0, 3)).map((doc) => (
              <div
                key={doc.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${getFileCardStyle(doc.filename)}`}
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(doc.filename)}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {doc.filename}
                    </h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDate(doc.created_at)}
                      </div>
                      <span className="text-xs text-gray-500">
                        {doc.chunk_count} chunks
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        doc.status === 'processed' 
                          ? 'bg-green-50 text-green-700 border-green-300' 
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {/* TODO: View document details */}}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                    title="View details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteDocument(doc.id, doc.filename)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete document"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {/* View more link */}
            {documents.length > 3 && !showAll && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAll(true)}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                >
                  View more ({documents.length - 3} more documents)
                </button>
              </div>
            )}
            
            {/* View less link */}
            {showAll && documents.length > 3 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAll(false)}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                >
                  View less
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
