import asyncio
import re
from openai import OpenAI
import os
from typing import Dict, Any, AsyncGenerator

class ResponseGenerator:
    """Generates responses using GPT-4"""
    
    @staticmethod
    async def generate_response(context: str, question: str) -> Dict[str, Any]:
        """Generate a response using GPT-4"""
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        system_prompt = (
            "You are DocChat, an AI assistant that answers questions based on the provided documents. "
            "Answer clearly, concisely, and include facts only from the context below. "
            "When citing information, mention which document it came from.\n\n"
            "FORMATTING: Use markdown formatting to make your responses clear and professional:\n"
            "- Use **bold** for important information\n"
            "- Use *italics* for emphasis\n"
            "- Use bullet points (-) for lists\n"
            "- Use `code` formatting for specific terms or numbers\n"
            "- Use tables for structured data, comparisons, or multiple related items\n\n"
            "TABLE FORMATTING: When presenting structured data, use markdown tables:\n"
            "```\n"
            "| Column 1 | Column 2 | Column 3 |\n"
            "|----------|----------|----------|\n"
            "| Data 1   | Data 2   | Data 3   |\n"
            "| Data 4   | Data 5   | Data 6   |\n"
            "```\n\n"
            "IMPORTANT: Always end your responses with a confidence assessment in this exact format:\n\n"
            "**Confidence: [High/Medium/Low] - [Brief explanation]**\n\n"
            "Examples:\n"
            "- **Confidence: High - Direct quote from employee handbook**\n"
            "- **Confidence: Medium - Related information found, but not exact match**\n"
            "- **Confidence: Low - Limited information available, may not be accurate**\n\n"
            "Be honest about your confidence level based on:\n"
            "- Quality of source matches\n"
            "- Completeness of information\n"
            "- Clarity of the answer\n\n"
            f"Context:\n{context}\n\nQuestion: {question}"
        )
        
        response = await asyncio.to_thread(
            lambda: client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                ],
            )
        )
        
        return response.choices[0].message.content
    
    @staticmethod
    async def generate_streaming_response(context: str, question: str) -> AsyncGenerator[Dict[str, Any], None]:
        """Generate a streaming response using GPT-4"""
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        system_prompt = (
            "You are DocChat, an AI assistant that answers questions based on the provided documents. "
            "Answer clearly, concisely, and include facts only from the context below. "
            "When citing information, mention which document it came from.\n\n"
            "FORMATTING: Use markdown formatting to make your responses clear and professional:\n"
            "- Use **bold** for important information\n"
            "- Use *italics* for emphasis\n"
            "- Use bullet points (-) for lists\n"
            "- Use `code` formatting for specific terms or numbers\n"
            "- Use tables for structured data, comparisons, or multiple related items\n\n"
            "TABLE FORMATTING: When presenting structured data, use markdown tables:\n"
            "```\n"
            "| Column 1 | Column 2 | Column 3 |\n"
            "|----------|----------|----------|\n"
            "| Data 1   | Data 2   | Data 3   |\n"
            "| Data 4   | Data 5   | Data 6   |\n"
            "```\n\n"
            "IMPORTANT: Always end your responses with a confidence assessment in this exact format:\n\n"
            "**Confidence: [High/Medium/Low] - [Brief explanation]**\n\n"
            "Examples:\n"
            "- **Confidence: High - Direct quote from employee handbook**\n"
            "- **Confidence: Medium - Related information found, but not exact match**\n"
            "- **Confidence: Low - Limited information available, may not be accurate**\n\n"
            "Be honest about your confidence level based on:\n"
            "- Quality of source matches\n"
            "- Completeness of information\n"
            "- Clarity of the answer\n\n"
            f"Context:\n{context}\n\nQuestion: {question}"
        )
        
        # Send initial message
        yield {
            "type": "start",
            "question": question,
            "message": "Starting to generate response..."
        }
        
        try:
            # Create streaming response
            response = await asyncio.to_thread(
                lambda: client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": system_prompt},
                    ],
                    stream=True  # Enable streaming
                )
            )
            
            full_content = ""
            
            # Stream the response
            for chunk in response:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_content += content
                    
                    yield {
                        "type": "content",
                        "content": content,
                        "full_content": full_content
                    }
            
            # Extract confidence from full response
            confidence_data = ResponseGenerator.extract_confidence(full_content)
            clean_answer = ResponseGenerator.clean_response(full_content)
            
            # Send final response with confidence
            yield {
                "type": "complete",
                "answer": clean_answer,
                "confidence": confidence_data,
                "full_content": full_content
            }
            
        except Exception as e:
            yield {
                "type": "error",
                "error": str(e)
            }
    
    @staticmethod
    def extract_confidence(response_text: str) -> Dict[str, str]:
        """Extract confidence information from response"""
        confidence_match = re.search(r'\*\*Confidence:\s*(\w+)\s*-\s*(.*?)\*\*', response_text)
        if confidence_match:
            level = confidence_match.group(1)
            explanation = confidence_match.group(2)
            return {
                'level': level,
                'explanation': explanation
            }
        return None
    
    @staticmethod
    def clean_response(response_text: str) -> str:
        """Clean response by removing confidence section"""
        return re.sub(r'\*\*Confidence:.*?\*\*', '', response_text).strip()
