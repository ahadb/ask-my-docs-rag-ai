import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { 
  ArrowRightIcon, 
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  ChartBarIcon,
  ServerStackIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

const DemoPage: React.FC = () => {
  const [, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f6f4' }}>
      {/* Header */}
      <Header 
        setSidebarOpen={setSidebarOpen}
        onNavigateHome={() => window.location.href = '/'}
        onLogout={() => window.location.href = '/signin'}
        user={null}
        showDemoModal={false}
        setShowDemoModal={() => {}}
      />
      
      {/* Main Content */}
      <main>
        <div className="h-full flex flex-col">
          {/* Demo Header */}
          <div className="pt-4 sm:pt-8 px-4 sm:px-6 pb-4 sm:pb-6 border-b border-gray-300 mt-16">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 space-y-4 lg:space-y-0">
                <div className="max-w-2xl w-full lg:w-auto">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-left mb-3 sm:mb-4">DocChat Controlled Demo</h1>
                 <p className="text-gray-600 text-base sm:text-lg text-left leading-relaxed">Welcome to DocChat! We truly respect your time, so we've prepared a curated demonstration of our powerful AI document capabilities. This is a production-grade application with full backend, frontend, cloud infrastructure, and modern web app architecture - you get all that enterprise-grade infrastructure included.</p>
                  <p className="text-base sm:text-lg text-gray-600 text-left mt-3 sm:mt-4 leading-relaxed">We're simply focusing this demo on the AI (RAG) technology that makes the difference. You'll explore carefully crafted questions that showcase cross-document analysis, comparative insights, and strategic recommendations - exactly the types of queries your team would use in a real implementation.</p>
                </div>
                <div className="w-full lg:w-auto">
                  <button
                    onClick={() => {
                      // Navigate to dashboard
                      navigate('/dashboard');
                    }}
                    className="flex items-center justify-center space-x-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-md transition-colors w-full lg:w-auto cursor-pointer"
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
                    Continue to Dashboard
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto py-4 sm:py-8 px-4 sm:px-0">
              {/* Stats Cards - Same as Dashboard */}
              {/* <DashboardCards /> */}
              
               {/* Demo Content */}
               <div className="mt-4 sm:mt-6 mb-6 sm:mb-8">
                 <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-left">AI (RAG) Features You'll Explore</h2>
                 <p className="text-gray-700 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                  Sample documents ranging from marketing to strategy will be pre-loaded for you in the dashboard. Then you can try the AI chat interface, 
                  explore question templates, and experience real LLM-generated responses with source citations as you interact with documents.
                </p>
                
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                   <div className="p-4 sm:p-0">
                     <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                       <ChartBarIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" style={{ color: '#D9664A' }} />
                       RAG Document Retrieval
                     </h3>
                     <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                       Experience how RAG retrieves relevant document chunks based on your questions. See semantic search in action.
                     </p>
                   </div>
                   
                   <div className="p-4 sm:p-0">
                     <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                       <ServerStackIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" style={{ color: '#D9664A' }} />
                       Document Chunking & Embeddings
                     </h3>
                     <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                       This is happening behind the scenes: documents get automatically parsed, chunked, and converted to vector embeddings for intelligent search.
                     </p>
                   </div>
                   
                   <div className="p-4 sm:p-0">
                     <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                       <ChatBubbleLeftRightIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" style={{ color: '#D9664A' }} />
                       Context-Aware Responses
                     </h3>
                     <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                       Get LLM responses that are grounded in your document content with accurate source citations.
                     </p>
                   </div>
                   
                   <div className="p-4 sm:p-0">
                     <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                       <SparklesIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" style={{ color: '#D9664A' }} />
                       Question Templates
                     </h3>
                     <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                       Try pre-built question templates that showcase different RAG capabilities and response types.
                     </p>
                   </div>
                   
                   <div className="p-4 sm:p-0">
                     <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                       <CpuChipIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" style={{ color: '#D9664A' }} />
                       Semantic Search
                     </h3>
                     <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                       Questions asked in English using NLP showing how AI finds relevant content even with different wording.
                     </p>
                   </div>
                   
                   <div className="p-4 sm:p-0">
                     <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                       <CodeBracketIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0" style={{ color: '#D9664A' }} />
                       Confidence Scoring
                     </h3>
                     <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                       See AI confidence levels for each response, helping you understand answer reliability.
                     </p>
                   </div>
                 </div>
              </div>

              {/* Roadmap Section */}
              <div className="mt-6 sm:mt-8 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-left">Product Roadmap</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {/* Phase 1 - Current Demo */}
                  <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm w-full" style={{ border: '1px solid #D9664A' }}>
                    <div className="mb-2 sm:mb-3 md:mb-4">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 leading-tight">Phase 1: AI Demo</h3>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4">What you're experiencing now</p>
                    <ul className="space-y-1 text-xs sm:text-sm text-gray-700 leading-relaxed">
                      <li>• Real-time AI streaming</li>
                      <li>• Multi-document semantic search</li>
                      <li>• Quick templates with real LLM responses</li>
                      <li>• Context-aware question answering</li>
                      <li>• Source citations with confidence scoring</li>
                      <li>• Supabase cloud database with pgvector</li>
                      <li>• Full stack RAG with modern React UI and Python backend</li>
                    </ul>
                  </div>

                  {/* Phase 2 - Production Ready */}
                  <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm w-full" style={{ border: '1px solid #D9664A' }}>
                    <div className="mb-2 sm:mb-3 md:mb-4">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 leading-tight">Phase 2: Full Production Version</h3>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4">When you implement</p>
                    <ul className="space-y-1 text-xs sm:text-sm text-gray-700 leading-relaxed">
                      <li>• Intelligent response caching</li>
                      <li>• Connect your own documents</li>
                      <li>• Custom AI models & prompts</li>
                      <li>• Tool integration (Airtable, Google Workspace)</li>
                      <li>• Advanced document types</li>
                    </ul>
                  </div>

                  {/* Phase 3 - Future Vision */}
                  <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm w-full" style={{ border: '1px solid #D9664A' }}>
                    <div className="mb-2 sm:mb-3 md:mb-4">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 leading-tight">Phase 3: Enterprise</h3>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4">Future vision</p>
                    <ul className="space-y-1 text-xs sm:text-sm text-gray-700 leading-relaxed">
                      <li>• Multi-tenant architecture</li>
                      <li>• Team collaboration features</li>
                      <li>• Custom workflows & automation</li>
                      <li>• Advanced analytics & insights</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemoPage;
