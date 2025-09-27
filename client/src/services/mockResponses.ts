// Mock Responses Service
// Maps template questions to their corresponding sample response files

import { DEMO_CONFIG } from '../config';

// Import all sample response files
import revenueTargets from '../sample-responses/revenue-targets-growth-strategies.json';
import compareMarketing from '../sample-responses/compare-marketing-strategies.json';
import aiStrategy from '../sample-responses/ai-strategy.json';
import codeOfConduct from '../sample-responses/code-of-conduct-zenith.json';
import customerRetention from '../sample-responses/customer-retention.json';
import docChatApi from '../sample-responses/doc-chat-api-and-auth.json';

// Map template questions to their corresponding mock responses
const MOCK_RESPONSES_MAP: Record<string, any> = {
  "What are the revenue targets and growth strategies mentioned across all documents?": revenueTargets,
  "Compare the marketing strategies between The Daily Grind and AquaBirst": compareMarketing,
  "If I'm implementing a new AI system, what best practices should I follow based on these documents?": aiStrategy,
  "What are the code of conduct and ethics for Zenith Dynamics?": codeOfConduct,
  "How can I improve customer retention based on the strategies outlined?": customerRetention,
  "What are the API endpoints and authentication methods in the DocChat technical handbook?": docChatApi,
};

// Template questions array (must match the Chat component)
export const TEMPLATE_QUESTIONS = [
  "What are the revenue targets and growth strategies mentioned across all documents?",
  "Compare the marketing strategies between The Daily Grind and AquaBirst",
  "If I'm implementing a new AI system, what best practices should I follow based on these documents?",
  "What are the code of conduct and ethics for Zenith Dynamics?",
  "How can I improve customer retention based on the strategies outlined?",
  "What are the API endpoints and authentication methods in the DocChat technical handbook?",
  "Who are the main competitors mentioned?"
];

/**
 * Check if a question is a template question
 */
export const isTemplateQuestion = (question: string): boolean => {
  return TEMPLATE_QUESTIONS.includes(question);
};

/**
 * Get mock response for a template question
 */
export const getMockResponse = (question: string): any => {
  if (!DEMO_CONFIG.ENABLED) {
    return null;
  }
  
  return MOCK_RESPONSES_MAP[question] || null;
};

/**
 * Check if we should use mock responses
 */
export const shouldUseMockResponse = (question: string): boolean => {
  if (!DEMO_CONFIG.ENABLED) {
    return false;
  }
  
  if (DEMO_CONFIG.MOCK_ALL_QUERIES) {
    return true;
  }
  
  if (DEMO_CONFIG.MOCK_TEMPLATES_ONLY && isTemplateQuestion(question)) {
    return true;
  }
  
  return false;
};

/**
 * Simulate API delay for realistic demo experience
 */
export const simulateApiDelay = (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, 1000 + Math.random() * 2000); // 1-3 seconds delay
  });
};
