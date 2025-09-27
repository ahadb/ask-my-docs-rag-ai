// Mock API Service
// Simulates real API calls for demo purposes

import { DEMO_CONFIG } from '../config';
import { getMockResponse, simulateApiDelay } from './mockResponses';

/**
 * Mock API response interface
 */
interface MockApiResponse {
  question: string;
  answer: string;
  confidence: {
    level: string;
    explanation: string;
  };
  sources: Array<{
    file_name: string;
    chunk_index: number;
  }>;
  source_documents: string[];
  chunks_found: number;
}

/**
 * Mock API endpoint that simulates the real query API
 */
export const mockQueryApi = async (question: string): Promise<MockApiResponse> => {
  if (!DEMO_CONFIG.ENABLED) {
    throw new Error('Mock API is disabled');
  }

  // Simulate network delay
  await simulateApiDelay();

  // Get the mock response
  const mockData = getMockResponse(question);
  
  if (!mockData) {
    throw new Error('Mock response not found for this question');
  }

  // Return in the same format as the real API
  return {
    question: mockData.question,
    answer: mockData.answer,
    confidence: mockData.confidence,
    sources: mockData.sources,
    source_documents: mockData.source_documents || [],
    chunks_found: mockData.chunks_found || mockData.sources.length
  };
};

/**
 * Enhanced fetch function that can route to mock or real API
 */
export const fetchWithMockRouting = async (
  url: string,
  options: RequestInit
): Promise<Response> => {
  // Check if this is a query request and we should use mock
  if (url.includes('/query') && DEMO_CONFIG.ENABLED) {
    try {
      const body = JSON.parse(options.body as string);
      const question = body.question;
      
      // Use mock endpoint for template questions if configured
      if (DEMO_CONFIG.MOCK_TEMPLATES_ONLY) {
        const { isTemplateQuestion } = await import('./mockResponses');
        if (isTemplateQuestion(question)) {
          // Add 2 second delay for mock responses
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Route to mock demo endpoint
          const { API_URLS } = await import('../config');
          const { fetchWithAuth } = await import('../utils/auth');
          return fetchWithAuth(API_URLS.QUERY_MOCK, options);
        }
      }
      
      // Use mock endpoint for all queries if configured
      if (DEMO_CONFIG.MOCK_ALL_QUERIES) {
        // Add 2 second delay for mock responses
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const { API_URLS } = await import('../config');
        const { fetchWithAuth } = await import('../utils/auth');
        return fetchWithAuth(API_URLS.QUERY_MOCK, options);
      }
    } catch (error) {
      console.warn('Failed to parse request body for mock routing:', error);
    }
  }

  // Fall back to real API call
  const { fetchWithAuth } = await import('../utils/auth');
  return fetchWithAuth(url, options);
};

/**
 * Create a mock Response object that mimics the real API response
 */
// const createMockResponse = (data: MockApiResponse): Response => {
//   const responseBody = JSON.stringify(data);
  
//   return new Response(responseBody, {
//     status: 200,
//     statusText: 'OK',
//     headers: {
//       'Content-Type': 'application/json',
//       'Content-Length': responseBody.length.toString(),
//     },
//   });
// };

/**
 * Mock upload endpoints (for completeness)
 */
export const mockUploadApi = async (file: File): Promise<any> => {
  if (!DEMO_CONFIG.ENABLED) {
    throw new Error('Mock API is disabled');
  }

  await simulateApiDelay();

  return {
    message: "File uploaded successfully",
    filename: file.name,
    chunks_created: Math.floor(Math.random() * 50) + 10,
    file_id: `mock_${Date.now()}`,
  };
};

/**
 * Mock documents list endpoint
 */
export const mockDocumentsApi = async (): Promise<any[]> => {
  if (!DEMO_CONFIG.ENABLED) {
    throw new Error('Mock API is disabled');
  }

  await simulateApiDelay();

  return [
    {
      id: "1",
      filename: "Cloud Scale - Sales Strategy.docx",
      status: "completed",
      size: 245760,
      chunks: 42,
      upload_date: new Date().toISOString(),
    },
    {
      id: "2", 
      filename: "The Daily Grind - Marketing Strategy.docx",
      status: "completed",
      size: 189440,
      chunks: 35,
      upload_date: new Date().toISOString(),
    },
    {
      id: "3",
      filename: "Zenith Dynamics - Employee Handbook.docx", 
      status: "completed",
      size: 312320,
      chunks: 58,
      upload_date: new Date().toISOString(),
    },
    {
      id: "4",
      filename: "DocChat API - Technical Handbook.docx",
      status: "completed", 
      size: 198656,
      chunks: 37,
      upload_date: new Date().toISOString(),
    },
    {
      id: "5",
      filename: "The Impact of AI - Research Paper.docx",
      status: "completed",
      size: 276480,
      chunks: 51,
      upload_date: new Date().toISOString(),
    }
  ];
};
