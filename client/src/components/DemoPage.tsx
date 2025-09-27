import React, { useState } from "react";
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
          <div className="pt-8 px-6 pb-6 border-b border-gray-300 mt-16">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="max-w-2xl">
                <h1 className="text-4xl font-bold text-gray-900 text-left mb-4">DocChat Controlled Demo</h1>
                 <p className="text-gray-600 text-lg text-left">Welcome to DocChat! We truly respect your time, so we've prepared a curated demonstration of our powerful AI document capabilities. This is a production-grade application with full backend, frontend, cloud infrastructure, and modern web app architecture - you get all that enterprise-grade infrastructure included.</p>
                  <p className="text-lg text-gray-600 text-left mt-4">We're simply focusing this demo on the AI (RAG) technology that makes the difference. You'll explore carefully crafted questions that showcase cross-document analysis, comparative insights, and strategic recommendations - exactly the types of queries your team would use in a real implementation.</p>
                </div>
                <div>
                  <button
                    onClick={() => {
                      // Navigate to dashboard
                      window.location.href = '/dashboard';
                    }}
                    className="flex items-center space-x-3 px-8 py-4 text-lg font-medium rounded-md transition-colors whitespace-nowrap"
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
            <div className="max-w-6xl mx-auto py-8">
              {/* Stats Cards - Same as Dashboard */}
              {/* <DashboardCards /> */}
              
               {/* Demo Content */}
               <div className="mt-6 mb-8">
                 <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">AI (RAG) Features You'll Explore</h2>
                 <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                  Sample documents ranging from marketing to strategy will be pre-loaded for you in the dashboard. Then you can try the AI chat interface, 
                  explore question templates, and experience real LLM-generated responses with source citations as you interact with documents.
                </p>
                
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   <div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                       <ChartBarIcon className="h-5 w-5 mr-3" style={{ color: '#D9664A' }} />
                       RAG Document Retrieval
                     </h3>
                     <p className="text-gray-600 leading-relaxed">
                       Experience how RAG retrieves relevant document chunks based on your questions. See semantic search in action.
                     </p>
                   </div>
                   
                   <div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                       <ServerStackIcon className="h-5 w-5 mr-3" style={{ color: '#D9664A' }} />
                       Document Chunking & Embeddings
                     </h3>
                     <p className="text-gray-600 leading-relaxed">
                       This is happening behind the scenes: documents get automatically parsed, chunked, and converted to vector embeddings for intelligent search.
                     </p>
                   </div>
                   
                   <div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                       <ChatBubbleLeftRightIcon className="h-5 w-5 mr-3" style={{ color: '#D9664A' }} />
                       Context-Aware Responses
                     </h3>
                     <p className="text-gray-600 leading-relaxed">
                       Get LLM responses that are grounded in your document content with accurate source citations.
                     </p>
                   </div>
                   
                   <div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                       <SparklesIcon className="h-5 w-5 mr-3" style={{ color: '#D9664A' }} />
                       Question Templates
                     </h3>
                     <p className="text-gray-600 leading-relaxed">
                       Try pre-built question templates that showcase different RAG capabilities and response types.
                     </p>
                   </div>
                   
                   <div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                       <CpuChipIcon className="h-5 w-5 mr-3" style={{ color: '#D9664A' }} />
                       Semantic Search
                     </h3>
                     <p className="text-gray-600 leading-relaxed">
                       Questions asked in English using NLP showing how AI finds relevant content even with different wording.
                     </p>
                   </div>
                   
                   <div>
                     <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                       <CodeBracketIcon className="h-5 w-5 mr-3" style={{ color: '#D9664A' }} />
                       Confidence Scoring
                     </h3>
                     <p className="text-gray-600 leading-relaxed">
                       See AI confidence levels for each response, helping you understand answer reliability.
                     </p>
                   </div>
                 </div>
              </div>

              {/* Roadmap Section */}
              <div className="mt-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">Product Roadmap</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Phase 1 - Current Demo */}
                  <div className="bg-white rounded-lg p-6 shadow-sm" style={{ border: '1px solid #D9664A' }}>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Phase 1: AI Demo</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">What you're experiencing now</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Real LLM AI responses</li>
                      <li>• Document upload & processing</li>
                      <li>• RAG, Natural language queries</li>
                      <li>• Source citations & confidence</li>
                    </ul>
                  </div>

                  {/* Phase 2 - Production Ready */}
                  <div className="bg-white rounded-lg p-6 shadow-sm" style={{ border: '1px solid #D9664A' }}>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Phase 2: Production</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">When you implement</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Connect your own documents</li>
                      <li>• Custom AI models & prompts</li>
                      <li>• Tool integration (Airtable, Google Workspace)</li>
                      <li>• Advanced document types</li>
                    </ul>
                  </div>

                  {/* Phase 3 - Future Vision */}
                  <div className="bg-white rounded-lg p-6 shadow-sm" style={{ border: '1px solid #D9664A' }}>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Phase 3: Enterprise</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Future vision</p>
                    <ul className="space-y-2 text-sm text-gray-700">
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
