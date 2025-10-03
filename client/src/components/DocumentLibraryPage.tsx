import { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  TrashIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CloudArrowUpIcon,
  ChevronUpDownIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { fetchWithAuth } from "../utils/auth";
import { API_URLS } from "../config";

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
    word_count?: number;
  };
  created_at: string;
  updated_at: string;
  chunk_type: string;
  chunk_count: number;
  word_count?: number;
}

export default function DocumentLibraryPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  
  // Handle upload click - redirect to dashboard for upload
  const handleUploadClick = () => {
    window.location.href = '/dashboard';
  };

  // Handle download all sample documents
  const handleDownloadAll = () => {
    const sampleDocs = [
      'AquaBurst - Marketing Strategy.docx',
      'Artificial Intelligence and Public Trust.pdf',
      'Cloud Scale - Sales Strategy.docx',
      'DocChat API - Technical Handbook.docx',
      'Leadership & Diversity in the Workplace.pdf',
      'Niccolò Machiavelli - A Modern Minimal Biography.docx',
      'Retrieval Augmented Generation - User Guide.docx',
      'Shakespeare - A Modern Minimal Biography.docx',
      'The Daily Grind - Marketing Strategy.docx',
      'The Impact of AI - Research Paper.docx',
      'Zenith Dynamics - Employee Handbook.docx'
    ];
    
    // Download each document
    sampleDocs.forEach((filename, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = `/demo-docs/${filename}`;
        link.download = filename;
        link.click();
      }, index * 500); // Stagger downloads by 500ms
    });
  };

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
  }, []);

  // Filter documents based on search and status
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "ready" && doc.metadata?.processing_status === "completed") ||
      (filterStatus === "processing" && doc.metadata?.processing_status === "processing") ||
      (filterStatus === "error" && doc.metadata?.processing_status === "error");
    
    return matchesSearch && matchesStatus;
  });

  // Handle document deletion
  const handleDeleteDocument = async (documentId: string) => {
    // Mock handler for demo
    console.log('Delete document:', documentId);
  };

  // Handle view document
  const handleViewDocument = (documentId: string) => {
    // For demo, download the document
    const doc = documents.find(doc => doc.id === documentId);
    if (doc) {
      // Create a download link for the document
      const link = document.createElement('a');
      link.href = `/api/documents/${documentId}/download`;
      link.download = doc.filename;
      link.click();
    }
  };

  // Handle chat with document
  const handleChatDocument = (documentId: string) => {
    // Mock handler for demo
    console.log('Chat with document:', documentId);
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedDocuments.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedDocuments.length} document(s)?`)) return;

    try {
      for (const docId of selectedDocuments) {
        await fetchWithAuth(`${API_URLS.UPLOAD_DOCUMENTS}/${docId}`, {
          method: "DELETE",
        });
      }
      setDocuments(prev => prev.filter(doc => !selectedDocuments.includes(doc.id)));
      setSelectedDocuments([]);
    } catch (error) {
      console.error("Error deleting documents:", error);
      alert("Error deleting documents");
    }
  };

  // Handle document selection
  const handleSelectDocument = (documentId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Mock file size for demo
  const getMockFileSize = (filename: string) => {
    // Generate consistent file sizes based on filename
    const hash = filename.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Generate sizes between 150KB and 800KB
    const baseSize = Math.abs(hash) % 650000 + 150000;
    return baseSize;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Section */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Document Library ({documents.length})</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and organize your uploaded documents. View processing status, search content, and start conversations.
              </p>
              
              {/* Notification Badge */}
              <div className="mt-4 p-3 rounded-lg border" style={{ backgroundColor: '#fefce8', borderColor: '#fde047' }}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5" style={{ color: '#ca8a04' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium" style={{ color: '#713f12' }}>
                      Download sample docs to get a tangible idea of pre-loaded documents. Some features are disabled on this tab
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleUploadClick}
                disabled
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors opacity-50 cursor-not-allowed"
                style={{
                  backgroundColor: '#e9e7e3',
                  color: '#D9664A',
                  border: '1px solid #D9664A'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e9e7e3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#e9e7e3';
                }}
              >
                <CloudArrowUpIcon className="h-4 w-4" />
                <span>Upload Document</span>
              </button>
              
              <button
                onClick={handleDownloadAll}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors"
                style={{
                  backgroundColor: '#e9e7e3',
                  color: '#D9664A',
                  border: '1px solid #D9664A'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0ede8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#e9e7e3';
                }}
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Download Sample Docs</span>
              </button>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                />
              </div>
              
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                >
                  <option value="all">All Documents</option>
                  <option value="ready">Ready</option>
                  <option value="processing">Processing</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedDocuments.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedDocuments.length} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  disabled
                  className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 opacity-50 cursor-not-allowed"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete (Demo)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1 overflow-auto">
          <div className="h-full">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#D9664A' }}></div>
                <span className="ml-3 text-gray-600">Loading documents...</span>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== "all" 
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by uploading your first document."
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead style={{ backgroundColor: '#e9e7e3' }}>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          Document
                          <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          Status
                          <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center justify-end">
                          Size
                          <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center justify-end">
                          Chunks
                          <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center justify-end">
                          Words
                          <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center justify-end">
                          Upload Date
                          <ChevronUpDownIcon className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDocuments.map((document) => {
                      const statusDisplay = getStatusDisplay(document.metadata?.processing_status);
                      const StatusIcon = statusDisplay.icon;
                      const isSelected = selectedDocuments.includes(document.id);

                      console.log(statusDisplay)

                      return (
                        <tr key={document.id} className={isSelected ? "" : "hover:bg-gray-50"}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectDocument(document.id)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img 
                                src={document.metadata?.file_type === 'DOCX' || document.metadata?.file_type === 'DOC' ? '/doc-ico-sm.png' : '/pdf-icon-sm.png'} 
                                alt="Document icon" 
                                className="h-8 w-8 mr-3" 
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                  {document.filename}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {document.metadata?.file_type?.toUpperCase() || "PDF"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusDisplay.bgColor} ${statusDisplay.color} ${statusDisplay.text === 'Active' ? 'border-green-200' : ''}`}>
                              {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                              {statusDisplay.text}
                            </span>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatFileSize(getMockFileSize(document.filename))}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {document.chunk_count || 0}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {document.word_count ? document.word_count.toLocaleString() : '—'}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatDate(document.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewDocument(document.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                title="View document"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleChatDocument(document.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Chat with document"
                              >
                                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteDocument(document.id)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete document"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="border-t border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {filteredDocuments.length} of {documents.length} documents
            </span>
            <span>
              {documents.filter(doc => doc.metadata?.processing_status === "completed").length} ready for chat
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}