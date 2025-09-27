import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon, 
  ClockIcon,
  SparklesIcon,
  LinkIcon,
  FolderIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
import { fetchWithAuth } from "../utils/auth";
import { API_URLS } from "../config";
import DocumentLibraryCards from "./DocumentLibraryCards";

interface UploadProps {
  onUploadComplete: () => void;
  documentRefreshTrigger: number;
  queryCount?: number;
  averageResponseTime?: string;
  confidencePercentages?: { high: number; medium: number; low: number };
}

interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  description: string;
  duration?: number;
  progress?: number;
}

interface FileProcessingStatus {
  fileName: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  steps: ProcessingStep[];
  error?: string;
}

export default function Upload({ onUploadComplete, documentRefreshTrigger, queryCount = 0, averageResponseTime = "0", confidencePercentages = { high: 0, medium: 0, low: 0 } }: UploadProps) {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [, setChunksCreated] = useState(0);
  const [fileProcessingStatus, setFileProcessingStatus] = useState<FileProcessingStatus[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'integrations'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Define processing steps
  const processingSteps: ProcessingStep[] = [
    {
      id: 'upload',
      name: 'Upload',
      status: 'pending',
      description: 'Uploading file to server'
    },
    {
      id: 'parse',
      name: 'Parse',
      status: 'pending',
      description: 'Extracting text from document'
    },
    {
      id: 'chunk',
      name: 'Chunk',
      status: 'pending',
      description: 'Breaking text into searchable chunks'
    },
    {
      id: 'embed',
      name: 'Embed',
      status: 'pending',
      description: 'Generating AI embeddings'
    },
    {
      id: 'store',
      name: 'Store',
      status: 'pending',
      description: 'Storing in vector database'
    }
  ];

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  }, []);

  // const handleRemoveFile = useCallback((index: number) => {
  //   const fileToRemove = uploadedFiles[index];
  //   setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  //   setFileProcessingStatus(prev => prev.filter(file => file.fileName !== fileToRemove.name));
  // }, [uploadedFiles]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(event.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    
    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
    }
  }, []);

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress({});
    
    // Initialize processing status for all files
    const initialStatus: FileProcessingStatus[] = uploadedFiles.map(file => ({
      fileName: file.name,
      status: 'uploading',
      progress: 0,
      steps: processingSteps.map(step => ({ ...step, status: 'pending' as const }))
    }));
    setFileProcessingStatus(initialStatus);

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        
        // Step 1: Upload (0-25%)
        updateFileStatus(file.name, 'uploading', 0, 'upload', 'processing', 0);
        const formData = new FormData();
        formData.append('file', file);
        
        // Simulate upload progress with step percentages
        for (let progress = 0; progress <= 25; progress += 5) {
          const stepProgress = Math.round((progress / 25) * 100);
          await new Promise(resolve => setTimeout(resolve, 50));
          updateFileStatus(file.name, 'uploading', progress, 'upload', 'processing', stepProgress);
        }
        updateFileStatus(file.name, 'processing', 25, 'upload', 'completed', 100);

        // Step 2: Parse (25-50%)
        updateFileStatus(file.name, 'processing', 25, 'parse', 'processing', 0);
        
        const response = await fetchWithAuth(API_URLS.UPLOAD, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const result = await response.json();
        
        // Simulate parse progress
        for (let progress = 25; progress <= 50; progress += 5) {
          const stepProgress = Math.round(((progress - 25) / 25) * 100);
          await new Promise(resolve => setTimeout(resolve, 100));
          updateFileStatus(file.name, 'processing', progress, 'parse', 'processing', stepProgress);
        }
        updateFileStatus(file.name, 'processing', 50, 'parse', 'completed', 100);

        // Step 3: Chunk (50-70%)
        updateFileStatus(file.name, 'processing', 50, 'chunk', 'processing', 0);
        
        // Update chunks count
        if (result.chunks_created) {
          setChunksCreated(prev => prev + result.chunks_created);
        }
        
        // Simulate chunk progress
        for (let progress = 50; progress <= 70; progress += 5) {
          const stepProgress = Math.round(((progress - 50) / 20) * 100);
          await new Promise(resolve => setTimeout(resolve, 80));
          updateFileStatus(file.name, 'processing', progress, 'chunk', 'processing', stepProgress);
        }
        updateFileStatus(file.name, 'processing', 70, 'chunk', 'completed', 100);

        // Step 4: Embed (70-90%)
        updateFileStatus(file.name, 'processing', 70, 'embed', 'processing', 0);
        
        // Simulate embedding progress
        for (let progress = 70; progress <= 90; progress += 5) {
          const stepProgress = Math.round(((progress - 70) / 20) * 100);
          await new Promise(resolve => setTimeout(resolve, 120));
          updateFileStatus(file.name, 'processing', progress, 'embed', 'processing', stepProgress);
        }
        updateFileStatus(file.name, 'processing', 90, 'embed', 'completed', 100);

        // Step 5: Store (90-100%)
        updateFileStatus(file.name, 'processing', 90, 'store', 'processing', 0);
        
        // Simulate storage progress
        for (let progress = 90; progress <= 100; progress += 5) {
          const stepProgress = Math.round(((progress - 90) / 10) * 100);
          await new Promise(resolve => setTimeout(resolve, 100));
          updateFileStatus(file.name, 'processing', progress, 'store', 'processing', stepProgress);
        }
        updateFileStatus(file.name, 'processing', 100, 'store', 'completed', 100);
      }

      // Wait a moment for backend processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Trigger document refresh to show new documents
      onUploadComplete();
      
      // Clear files after successful upload
      setUploadedFiles([]);
      
      // Reset processing status after a delay to show completion
      setTimeout(() => {
        setFileProcessingStatus([]);
      }, 2000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      // Mark all files as error
      uploadedFiles.forEach(file => {
        updateFileStatus(file.name, 'error', 0, 'upload', 'error');
      });
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const updateFileStatus = (fileName: string, status: FileProcessingStatus['status'], progress: number, stepId: string, stepStatus: ProcessingStep['status'], stepProgress?: number) => {
    setFileProcessingStatus(prev => prev.map(file => {
      if (file.fileName === fileName) {
        return {
          ...file,
          status,
          progress,
          steps: file.steps.map(step => 
            step.id === stepId ? { 
              ...step, 
              status: stepStatus,
              progress: stepProgress !== undefined ? stepProgress : step.progress
            } : step
          )
        };
      }
      return file;
    }));
  };


  // const clearAllData = async () => {
  //   if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
  //     try {
  //       await fetchWithAuth(API_URLS.UPLOAD_CLEAR, { method: 'POST' });
  //       setUploadedFiles([]);
  //       setChunksCreated(0);
  //       onUploadComplete();
  //     } catch (error) {
  //       console.error('Failed to clear data:', error);
  //       alert('Failed to clear data. Please try again.');
  //     }
  //   }
  // };

  return (
    <div className="w-full h-full p-6 overflow-y-auto overflow-x-hidden relative" style={{ backgroundColor: '#f7f6f4' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-200/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-pink-200/60 to-transparent"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl transform -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="flex flex-col items-center w-full max-w-4xl mx-auto min-w-0">
        {/* Main Heading Section */}
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
              className="flex items-center text-base hover:underline transition-colors"
              style={{ color: '#D9664A' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#D9664A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#D9664A';
              }}
            >
              <SparklesIcon className="h-5 w-5 mr-2" />
              Chat with AI
            </button>
          </div>
          
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
                  Sample Docs Loaded
                </p>
                <p className="text-sm mt-1" style={{ color: '#a16207' }}>
                  Ready to explore! Focus on the AI chat - that's where the magic happens.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Status Cards */}
        <div className="w-full max-w-2xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* AI Confidence Analysis Card */}
            <div className="backdrop-blur-sm border border-gray-400 rounded-lg p-4 shadow-sm">
              <div className="px-4 py-3 -mx-4 -mt-4 mb-3 border-b border-gray-400 rounded-t-lg" style={{ backgroundColor: '#e9e7e3' }}>
                <h4 className="text-base font-semibold text-gray-900">AI Confidence Analysis</h4>
                <p className="text-xs text-gray-600 mt-1">Last 24 hours</p>
              </div>
              <div className="space-y-3">
                {/* Confidence Distribution Chart */}
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

            {/* RAG Intelligence Card */}
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

            {/* Query Analytics Card */}
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
          
          {/* Customization Note */}
          <div className="mt-4 text-left">
            <p className="text-xs text-gray-500 italic">
              The cards above are dynamically generated and can be customized to your specific needs and workflows
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="w-full max-w-2xl">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'upload'
                  ? 'border-[#D9664A] text-[#D9664A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <CloudArrowUpIcon className="h-4 w-4" />
              <span>Upload Files</span>
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'integrations'
                  ? 'border-[#D9664A] text-[#D9664A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <LinkIcon className="h-4 w-4" />
              <span>Integrations</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'upload' && (
          <>
            {/* Upload Area */}
        <div className="w-full max-w-2xl mb-6 mt-2">
          <div 
            className={`backdrop-blur-sm border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:border-indigo-400'
            }`}
            style={{ 
              backgroundImage: isDragOver ? 'none' : 'repeating-linear-gradient(45deg, #e9e7e3, #e9e7e3 8px, rgba(233, 231, 227, 0.3) 8px, rgba(233, 231, 227, 0.3) 16px)',
              backgroundColor: isDragOver ? '#fef3c7' : '#f5f4f2'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CloudArrowUpIcon className="mx-auto h-12 w-12 mb-4" style={{ color: '#D9664A' }} />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">Upload your documents</p>
              <p className="text-sm text-gray-600">
                Drag and drop files here, or click to select files
              </p>
              <p className="text-xs text-gray-500">
                Supports PDF, DOC, DOCX files up to 10MB each
              </p>
            </div>
            <div className="mt-6 flex items-center justify-center space-x-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors opacity-50 cursor-not-allowed"
        style={{
          backgroundColor: '#e9e7e3',
          color: '#D9664A',
          border: '1px solid #D9664A'
        }}
      >
        <CloudArrowUpIcon className="h-4 w-4" />
        <span>Select Files (Demo)</span>
      </button>
              {uploadedFiles.length > 0 && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="inline-flex items-center px-4 py-2 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading..." : `Confirm upload (${uploadedFiles.length}) docs`}
                </button>
              )}
            </div>
          </div>
          
          {/* Upload Disabled Note */}
          <div className="mt-4 text-left">
            <p className="text-xs text-gray-500 italic">
              Upload is disabled for demo - it will be enabled and customized to integrate with your tools in the full version
            </p>
          </div>
        </div>


        {/* Processing Visualization */}
        {fileProcessingStatus.length > 0 && (
          <div className="w-full max-w-2xl mt-6">
            {/* Section Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Processing Documents</h3>
              <p className="text-sm text-gray-600 mt-1">
                Your documents are being processed through our AI pipeline
              </p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-6 shadow-sm">
              {/* RAG Processing Progress */}
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-4">
                  Processing documents...
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.round(fileProcessingStatus.reduce((acc, file) => acc + file.progress, 0) / fileProcessingStatus.length)}%`,
                      backgroundColor: '#D9664A'
                    }}
                  ></div>
                </div>
                
                {/* Processing Steps */}
                <div className="flex justify-between text-sm">
                  {fileProcessingStatus.length > 0 && fileProcessingStatus[0].steps.map((step) => {
                    const isActive = fileProcessingStatus.some(f => {
                      const currentStep = f.steps.find(s => s.id === step.id);
                      return currentStep?.status === 'processing' || currentStep?.status === 'completed';
                    });
                    // const isCompleted = fileProcessingStatus.some(f => {
                    //   const currentStep = f.steps.find(s => s.id === step.id);
                    //   return currentStep?.status === 'completed';
                    // });
                    const stepProgress = fileProcessingStatus.some(f => {
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
                {/* Google Sheets Integration */}
                <div className="backdrop-blur-sm border border-gray-400 rounded-lg px-4 py-2 shadow-sm hover:border-gray-500 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <FolderIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Google Sheets</h3>
                        <p className="text-sm text-gray-500">Import documents from your Google Sheets</p>
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

                {/* Airtable Integration */}
                <div className="backdrop-blur-sm border border-gray-400 rounded-lg px-4 py-2 shadow-sm hover:border-gray-500 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                        <DocumentTextIcon className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Airtable</h3>
                        <p className="text-sm text-gray-500">Sync data from your Airtable bases</p>
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
                

                {/* Coming Soon */}
                <div className="backdrop-blur-sm border border-gray-400 rounded-lg px-4 py-2 shadow-sm" style={{ backgroundColor: '#e9e7e3' }}>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <ClockIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-500">More Integrations</h3>
                      <p className="text-sm text-gray-400">Slack, Notion, and more coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Integrations Disabled Note */}
              <div className="mt-4 text-left">
                <p className="text-xs text-gray-500 italic">
                  Integrations are disabled for demo - they will be enabled and customized to integrate with your tools in the full version
                </p>
              </div>
            </div>
          </div>
        )}

       
        {/* Document Library Cards - Always visible */}
        <div className="w-full max-w-2xl mt-6">
          <DocumentLibraryCards refreshTrigger={documentRefreshTrigger} />
        </div>
      </div>
    </div>
  );
}
