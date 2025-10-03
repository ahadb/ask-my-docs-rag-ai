import { useState, useCallback } from "react";
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon, 
  ClockIcon
} from "@heroicons/react/24/outline";
import { fetchWithAuth } from "../utils/auth";
import { API_URLS } from "../config";
import DocumentLibraryCards from "./DocumentLibraryCards";
import UploadHeader from "./upload/UploadHeader";
import UploadStats from "./upload/UploadStats";
import UploadTabs from "./upload/UploadTabs";
import { useFileUpload } from "../hooks/useFileUpload";
import { useUploadProgress } from "../hooks/useUploadProgress";

interface UploadProps {
  onUploadComplete: () => void;
  documentRefreshTrigger: number;
  queryCount?: number;
  averageResponseTime?: string;
  confidencePercentages?: { high: number; medium: number; low: number };
}

export default function UploadPage({ onUploadComplete, documentRefreshTrigger, queryCount = 0, averageResponseTime = "0", confidencePercentages = { high: 0, medium: 0, low: 0 } }: UploadProps) {
  // Use custom hooks for state management
  const fileUpload = useFileUpload();
  const uploadProgress = useUploadProgress();
  
  // Local state for tab management and error handling
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [, setChunksCreated] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // File validation function
  const validateFiles = (files: File[]): string[] => {
    const errors: string[] = [];
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name} is too large (max 10MB)`);
      }
      
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name} is not a supported file type`);
      }
    });
    
    return errors;
  };


  // Enhanced file selection handler with validation
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const errors = validateFiles(files);
    
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }
    
    setError(null);
    fileUpload.handleFileSelect(event);
  }, [fileUpload]);

  const handleUpload = async () => {
    if (fileUpload.uploadedFiles.length === 0) return;

    setError(null); // Clear previous errors
    fileUpload.setIsUploading(true);
    
    // Initialize processing status for all files
    fileUpload.uploadedFiles.forEach(file => {
      uploadProgress.addFileToProcessing(file.name);
    });

    try {
      for (let i = 0; i < fileUpload.uploadedFiles.length; i++) {
        const file = fileUpload.uploadedFiles[i];
        
        uploadProgress.updateFileStatus(file.name, 'uploading', 0, 'upload', 'processing', 0);
        const formData = new FormData();
        formData.append('file', file);
        
        for (let progress = 0; progress <= 25; progress += 5) {
          const stepProgress = Math.round((progress / 25) * 100);
          await new Promise(resolve => setTimeout(resolve, 50));
          uploadProgress.updateFileStatus(file.name, 'uploading', progress, 'upload', 'processing', stepProgress);
        }
        uploadProgress.updateFileStatus(file.name, 'uploading', 25, 'upload', 'completed', 100);

        uploadProgress.updateFileStatus(file.name, 'parsing', 25, 'parse', 'processing', 0);
        
        const response = await fetchWithAuth(API_URLS.UPLOAD, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const result = await response.json();
        
        for (let progress = 25; progress <= 50; progress += 5) {
          const stepProgress = Math.round(((progress - 25) / 25) * 100);
          await new Promise(resolve => setTimeout(resolve, 100));
          uploadProgress.updateFileStatus(file.name, 'parsing', progress, 'parse', 'processing', stepProgress);
        }
        uploadProgress.updateFileStatus(file.name, 'parsing', 50, 'parse', 'completed', 100);

        uploadProgress.updateFileStatus(file.name, 'chunking', 50, 'chunk', 'processing', 0);
        
        if (result.chunks_created) {
          setChunksCreated(prev => prev + result.chunks_created);
        }
        
        for (let progress = 50; progress <= 70; progress += 5) {
          const stepProgress = Math.round(((progress - 50) / 20) * 100);
          await new Promise(resolve => setTimeout(resolve, 80));
          uploadProgress.updateFileStatus(file.name, 'chunking', progress, 'chunk', 'processing', stepProgress);
        }
        uploadProgress.updateFileStatus(file.name, 'chunking', 70, 'chunk', 'completed', 100);

        uploadProgress.updateFileStatus(file.name, 'embedding', 70, 'embed', 'processing', 0);
        
        for (let progress = 70; progress <= 90; progress += 5) {
          const stepProgress = Math.round(((progress - 70) / 20) * 100);
          await new Promise(resolve => setTimeout(resolve, 120));
          uploadProgress.updateFileStatus(file.name, 'embedding', progress, 'embed', 'processing', stepProgress);
        }
        uploadProgress.updateFileStatus(file.name, 'embedding', 90, 'embed', 'completed', 100);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUploadComplete();
      
      fileUpload.setUploadedFiles([]);
      setError(null); // Clear any errors on successful upload
      
      setTimeout(() => {
        uploadProgress.clearAllProcessing();
      }, 2000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Upload failed. Please check your files and try again.');
      fileUpload.uploadedFiles.forEach(file => {
        uploadProgress.updateFileStatus(file.name, 'error', 0, 'upload', 'error');
      });
    } finally {
      fileUpload.setIsUploading(false);
    }
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto overflow-x-hidden relative" style={{ backgroundColor: '#f7f6f4' }}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-200/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-pink-200/60 to-transparent"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl transform -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="flex flex-col items-center w-full max-w-4xl mx-auto min-w-0">
        <UploadHeader />
        
        <UploadStats 
          queryCount={queryCount}
          averageResponseTime={averageResponseTime}
          confidencePercentages={confidencePercentages}
        />

        <UploadTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {activeTab === 'upload' && (
          <>
            <div className="w-full max-w-2xl mb-6 mt-2">
            <div 
              className="backdrop-blur-sm border-2 border-dashed rounded-lg p-8 text-center transition-colors border-gray-300 bg-gray-50 opacity-90"
              style={{ 
                backgroundImage: 'repeating-linear-gradient(45deg, #e9e7e3, #e9e7e3 8px, rgba(233, 231, 227, 0.3) 8px, rgba(233, 231, 227, 0.3) 16px)',
                backgroundColor: '#f5f4f2'
              }}
            >
                <CloudArrowUpIcon className="mx-auto h-12 w-12 mb-4" style={{ color: '#D9664A' }} />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-500">Upload Disabled (Demo Mode)</p>
                </div>
                <div className="mt-6 flex items-center justify-center space-x-4">
                  <input
                    ref={fileUpload.fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    disabled
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors opacity-50 cursor-not-allowed"
                    style={{
                      backgroundColor: '#e9e7e3',
                      color: '#6B7280',
                      border: '1px solid #D1D5DB'
                    }}
                  >
                    <CloudArrowUpIcon className="h-4 w-4" />
                    <span>Upload</span>
                  </button>
                  {fileUpload.uploadedFiles.length > 0 && (
                    <button
                      onClick={handleUpload}
                      disabled={fileUpload.isUploading}
                      className="inline-flex items-center px-4 py-2 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {fileUpload.isUploading ? "Uploading..." : `Confirm upload (${fileUpload.uploadedFiles.length}) docs`}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mt-4 text-left">
                <p className="text-xs text-gray-500 italic">
                  Upload is disabled for demo - it will be enabled and customized to integrate with your tools in the full version
                </p>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="w-full max-w-2xl mt-4">
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {uploadProgress.fileProcessingStatus.length > 0 && (
              <div className="w-full max-w-2xl mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Processing Documents</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Your documents are being processed through our AI pipeline
                  </p>
                </div>
                
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-4">
                      Processing documents...
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${uploadProgress.totalProgress}%`,
                          backgroundColor: '#D9664A'
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      {uploadProgress.fileProcessingStatus.length > 0 && uploadProgress.fileProcessingStatus[0].steps.map((step) => {
                        const isActive = uploadProgress.fileProcessingStatus.some(f => {
                          const currentStep = f.steps.find(s => s.id === step.id);
                          return currentStep?.status === 'processing' || currentStep?.status === 'completed';
                        });
                        const stepProgress = uploadProgress.fileProcessingStatus.some(f => {
                          const currentStep = f.steps.find(s => s.id === step.id);
                          return currentStep?.progress || 0;
                        });
                        
                        return (
                          <span 
                            key={step.id}
                            className={`${isActive ? 'text-[#D9664A]' : 'text-gray-500'}`}
                          >
                            {step.name}
                            {isActive && stepProgress !== undefined && (
                              <span className="ml-1 text-xs">
                                ({stepProgress}%)
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'integrations' && (
          <div className="w-full max-w-2xl">
            <div className="mb-6 mt-2">
              <div className="space-y-4">
                <div className="backdrop-blur-sm border border-gray-400 rounded-lg px-4 py-2 shadow-sm hover:border-gray-500 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Google Docs</h3>
                        <p className="text-sm text-gray-500">Import and sync documents from Google Drive</p>
                      </div>
                    </div>
                    <button 
                      disabled
                      className="px-4 py-2 text-sm font-medium rounded-md border transition-colors opacity-50 cursor-not-allowed"
                      style={{ 
                        backgroundColor: '#e9e7e3', 
                        color: '#D9664A', 
                        border: '1px solid #D9664A' 
                      }}
                    >
                      Connect
                    </button>
                  </div>
                </div>

                <div className="backdrop-blur-sm border border-gray-400 rounded-lg px-4 py-2 shadow-sm hover:border-gray-500 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Notion</h3>
                        <p className="text-sm text-gray-500">Sync pages and databases from Notion</p>
                      </div>
                    </div>
                    <button 
                      disabled
                      className="px-4 py-2 text-sm font-medium rounded-md border transition-colors opacity-50 cursor-not-allowed"
                      style={{ 
                        backgroundColor: '#e9e7e3', 
                        color: '#D9664A', 
                        border: '1px solid #D9664A' 
                      }}
                    >
                      Connect
                    </button>
                  </div>
                </div>

                <div className="backdrop-blur-sm border border-gray-400 rounded-lg px-4 py-2 shadow-sm" style={{ backgroundColor: '#e9e7e3' }}>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <ClockIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-500">More Integrations</h3>
                      <p className="text-sm text-gray-400">Confluence, SharePoint, and more coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-left">
                <p className="text-xs text-gray-500 italic">
                  Integrations are disabled for demo - they will be enabled and customized to integrate with your tools in the full version
                </p>
              </div>
            </div>
          </div>
        )}
       
        <div className="w-full max-w-2xl mt-6">
          <DocumentLibraryCards refreshTrigger={documentRefreshTrigger} />
        </div>
      </div>
    </div>
  );
}