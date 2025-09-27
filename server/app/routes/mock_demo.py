from fastapi import APIRouter, Body, Depends
from pydantic import BaseModel
from typing import Optional
import json
from pathlib import Path

router = APIRouter(prefix="/mock-demo", tags=["mock-demo"])

class MockQueryRequest(BaseModel):
    question: str
    top_k: Optional[int] = None

# Simple hardcoded responses - no file loading complexity
MOCK_RESPONSES = {
    "What are the revenue targets and growth strategies mentioned across all documents?": {
        "question": "What are the revenue targets and growth strategies mentioned across all documents?",
        "answer": "The revenue targets and growth strategies mentioned across all the documents are as follows:\n\n**CloudScale Solutions Sales Strategy**\n\n- Revenue Target: $42.5 million, representing a 65% growth from 2024.\n\n- New Customer Acquisition: 285 new customers.\n\n- Average Contract Value: $45,000, a 12% increase from the previous year.\n\n- Expansion Revenue: 35% of total revenue from existing customers.\n\n- Other Key Performance Indicators include: \n   - Annual Recurring Revenue (ARR): $42.5M\n   - New ARR: $26.1M from new customers (61% of total)\n   - Expansion ARR: $16.4M from existing customers (39% of total)\n   - Total Contract Value (TCV): $67K average including multi-year commitments.\n\n- Other Growth Strategies: \n  - Expansion Revenue Optimization, including Land and Expand Strategy \n  - Usage-Based Growth\n  - Cross-Sell Opportunities\n  - Renewal Optimization\n\n**The Daily Grind Marketing Strategy**\n\n- Revenue Growth: A target revenue of $28.5 million, indicating a 35% increase from 2024.\n\n- Average Ticket Size: They aim to increase the average ticket size to $8.75.\n\n- Daily Transactions per Store: The goal is to increase it to 485 transactions.\n\n- New Customer Acquisition: Aim to acquire 45,000 new customers.\n\n- Market Expansion: They are working towards opening 10 new locations in target metropolitan areas.\n\n- Other Strategic Objectives include: \n  - Increase in new customer acquisition through Digital Marketing, Events & Experiential, Partnerships, and Traditional Advertising\n  - Targeting larger demographic of urban professionals, college students, and remote workers which represents over 73% of specialty coffee consumption.",
        "confidence": {
            "level": "High",
            "explanation": "All information directly pulled from both the \"CloudScale Solutions - Sales Strategy.docx\" and \"The Daily Grind - Marketing Strategy.docx\" documents."
        },
        "sources": [
            {
                "file_name": "CloudScale Solutions - Sales Strategy.docx",
                "chunk_index": 32
            },
            {
                "file_name": "CloudScale Solutions - Sales Strategy.docx",
                "chunk_index": 33
            }
        ],
        "source_documents": [
            "CloudScale Solutions - Sales Strategy.docx",
            "The Daily Grind - Marketing Strategy.docx"
        ],
        "chunks_found": 10
    },
    
    "Compare the marketing strategies between The Daily Grind and AquaBirst": {
        "question": "Compare the marketing strategies between The Daily Grind and AquaBirst",
        "answer": "**The Daily Grind's Marketing Strategy**:\n\n- Primarily targets a niche of productivity-focused consumers with their \"Fuel Your Grind\" messaging (The Daily Grind - Marketing Strategy.docx).\n- Focuses on strategic brand positioning and targeted customer acquisition (The Daily Grind - Marketing Strategy.docx).\n- Appeals to local communities through store-specific partnerships and events (The Daily Grind - Marketing Strategy.docx).\n- Offers premium coffee experiences aimed at enhancing productivity, focus, and performance (The Daily Grind - Marketing Strategy.docx).\n- Uses a multi-channel approach to ensure broad reach and efficient customer acquisition (The Daily Grind - Marketing Strategy.docx).\n- Has a rotating menu of seasonal drinks, thus encouraging repeat visits and customer curiosity (The Daily Grind - Marketing Strategy.docx).\n\n**AquaBurst's Marketing Strategy**:\n\n- Changes the market positioning to \"the healthy, fun, and functional beverage\" (AquaBurst - Marketing Strategy.docx).\n- Differentiates from competitors with zero sugar, all-natural ingredients, functional add-ons like Vitamin C and electrolytes, and eco-friendly packaging (AquaBurst - Marketing Strategy.docx).\n- Their campaign, \"Fuel Your Flow,\" promotes energy, hydration, and health for every lifestyle (AquaBurst - Marketing Strategy.docx).\n- Highlighted as being bold, vibrant, and social-first in brand identity (AquaBurst - Marketing Strategy.docx).\n\n**Comparison**:\nWhile both brands focus on fueling their customer's activities, The Daily Grind is more geared towards productivity and work, while AquaBurst presents a more lifestyle-oriented, healthy beverage option.",
        "confidence": {
            "level": "Medium",
            "explanation": "Information directly extracted from the provided documents."
        },
        "sources": [
            {
                "file_name": "The Daily Grind - Marketing Strategy.docx",
                "chunk_index": 0
            },
            {
                "file_name": "The Daily Grind - Marketing Strategy.docx",
                "chunk_index": 50
            }
        ],
        "source_documents": [
            "AquaBurst - Marketing Strategy.docx",
            "The Daily Grind - Marketing Strategy.docx"
        ],
        "chunks_found": 10
    },
    
    "If I'm implementing a new AI system, what best practices should I follow based on these documents?": {
        "question": "If I'm implementing a new AI system, what best practices should I follow based on these documents?",
        "answer": "Based on the provided documents, the following best practices should be considered when implementing a new AI system:\n\n- **Planning and Investment**: Organizations should prepare with proper planning and investment, prioritizing a strong foundation in AI implementation and organizational learning (*Impact of AI - Research Paper*).\n\n- **Assess AI Readiness**: Conduct an assessment of your organization's AI readiness, considering factors such as available data, technology infrastructure, and organizational change capacity before beginning implementation (*Impact of AI - Research Paper*).\n\n- **Invest in Change Management**: Resources should be allocated to change management, training, and employee support programs. Strong change management practices and comprehensive employee training programs contribute to successful AI implementation (*Impact of AI - Research Paper*).\n\n- **Start with High-Impact Use Cases**: Begin AI implementation with document types that have high volume, standardized formats, and clear business value (*Impact of AI - Research Paper*).\n\n- **Plan for Integration**: AI systems should integrate seamlessly with existing workflows and enterprise systems (*Impact of AI - Research Paper*).\n\n- **Establish Success Metrics**: It's crucial to define clear, measurable objectives for AI implementation based on productivity or other relevant metrics (*Impact of AI - Research Paper*).",
        "confidence": {
            "level": "High",
            "explanation": "All points directly quoted from the provided sources"
        },
        "sources": [
            {
                "file_name": "The Impact of AI - Research Paper.docx",
                "chunk_index": 56
            },
            {
                "file_name": "The Impact of AI - Research Paper.docx",
                "chunk_index": 55
            }
        ],
        "source_documents": [
            "The Impact of AI - Research Paper.docx"
        ],
        "chunks_found": 10
    },
    
    "What are the code of conduct and ethics for Zenith Dynamics?": {
        "question": "What are the code of conduct and ethics for Zenith Dynamics?",
        "answer": "Zenith Dynamics has established various principles and guidelines concerning its code of conduct and ethics:\n\n1. **Abuse during Work Hours or Company Events**: Zenith Dynamics does not tolerate any form of abuse during work hours or at company events (Source: Zenith Dynamics - Employee Handbook.docx)\n\n2. **Acceptance of Gifts or Favors**: Employees are prohibited from accepting gifts or favors that could potentially influence business decisions (Source: Zenith Dynamics - Employee Handbook.docx)\n\n3. **Anti-Harassment & Discrimination Policy (Policy #ETH-202)**: Zenith Dynamics maintains a zero-tolerance policy for harassment or discrimination based on race, color, religion, sex, sexual orientation, gender identity, national origin, age, disability, veteran status, or any other protected characteristic (Source: Zenith Dynamics - Employee Handbook.docx)\n\n4. **Reporting Process**: The first line of reporting in most situations is the immediate supervisor. Other reporting processes include contacting the HR Department, Anonymous Hotline, and online reporting at ethics@zenithdynamics.com. All reports are promised to be investigated within 5 business days, with confidentiality maintained as much as possible (Source: Zenith Dynamics - Employee Handbook.docx)\n\n5. **Zero Retaliation Policy**: Zenith Dynamics strictly enforces a no retaliation policy for reported violations. Appropriate corrective action is taken when violations are confirmed (Source: Zenith Dynamics - Employee Handbook.docx)\n\nFor additional clarification, any questions regarding the code of conduct can be directed to the company's HR department (Source: Zenith Dynamics - Employee Handbook.docx).",
        "confidence": {
            "level": "High",
            "explanation": "The information comes directly from the source document and pertains specifically to the asked question."
        },
        "sources": [
            {
                "file_name": "Zenith Dynamics - Employee Handbook.docx",
                "chunk_index": 0
            },
            {
                "file_name": "Zenith Dynamics - Employee Handbook.docx",
                "chunk_index": 17
            }
        ],
        "source_documents": [
            "Zenith Dynamics - Employee Handbook.docx"
        ],
        "chunks_found": 10
    },
    
    "How can I improve customer retention based on the strategies outlined?": {
        "question": "How can I improve customer retention based on the strategies outlined?",
        "answer": "Based on the strategies outlined, you can improve customer retention by employing the following tactics and programs:\n\n1. **Customer Success Program**: Every customer >$50K ARR gets a dedicated Customer Success Manager (CSM). This personalizes the service and ensures attention to specific customer needs. *(Source: CloudScale Solutions - Sales Strategy.docx)*\n\n2. **Quarterly Business Reviews (QBR)**: Regular metrics review and expansion planning can help align the product's value with the customer's goals. *(CloudScale Solutions - Sales Strategy.docx)*\n\n3. **Health Score Monitoring**: Use of usage analytics, support tickets, and satisfaction surveys to monitor and respond to customer health. *(CloudScale Solutions - Sales Strategy.docx)*\n\n4. **Risk Management**: Implement early warning systems for churn risk identification to prevent losing customers. *(CloudScale Solutions - Sales Strategy.docx)*\n\n5. **Churn Prevention Tactics**: Such as C-level engagement for at-risk enterprise accounts, updated objectives and success criteria (Success Plan Revision), platform configuration and performance improvements (Technical Optimization), and pricing adjustments or contract modifications (Commercial Renegotiation). *(CloudScale Solutions - Sales Strategy.docx)*\n\n6. **Customer Advocacy Development**: Develop incentivized customer reference and case study programs to promote client engagement and loyalty. *(CloudScale Solutions - Sales Strategy.docx)*\n\n7. **Renewal Optimization**: Implement multi-year renewal incentives and loyalty programs, and maintain a 120-day renewal cycle with expansion discussion as part of the Renewal Process. *(CloudScale Solutions - Sales Strategy.docx)*\n\nThese strategies should align with your overall customer retention strategy and be tailored according to your customers' needs and your business context.",
        "confidence": {
            "level": "Medium",
            "explanation": "Strategies are directly quoted from source document (CloudScale Solutions - Sales Strategy.docx)."
        },
        "sources": [
            {
                "file_name": "CloudScale Solutions - Sales Strategy.docx",
                "chunk_index": 42
            },
            {
                "file_name": "CloudScale Solutions - Sales Strategy.docx",
                "chunk_index": 40
            }
        ],
        "source_documents": [
            "CloudScale Solutions - Sales Strategy.docx",
            "The Daily Grind - Marketing Strategy.docx"
        ],
        "chunks_found": 10
    },
    
    "What are the API endpoints and authentication methods in the DocChat technical handbook?": {
        "question": "What are the API endpoints and authentication methods in the DocChat technical handbook?",
        "answer": "The DocChat technical handbook describes several API endpoints and the method of API Key Authentication.\n\n**API Endpoints:**\n- Document upload and processing: `POST /documents` for uploading and processing a document for chat interaction.\n- Chat creation: `POST /chat/sessions` for starting a new chat session with processed documents.\n- Message sending: `POST /ch` for sending a question to a chat session.\n- Webhooks configuration: `POST /webhooks` for configuring webhooks to receive real-time notifications about document processing and chat events.\n\n**Authentication Method:**\nThe book outlines the API Key Authentication process. All API requests require authentication using your API key in the request header. Here's a sample header for this method:\n```\nAuthorization: Bearer dc_live_1234567890abcdef\nContent-Type: application/json\n```\nAPI keys are obtained from the DocChat Dashboard and should be stored securely.",
        "confidence": {
            "level": "High",
            "explanation": "All the information is directly quoted from the DocChat API - Technical Handbook.docx"
        },
        "sources": [
            {
                "file_name": "DocChat API - Technical Handbook.docx",
                "chunk_index": 0
            },
            {
                "file_name": "DocChat API - Technical Handbook.docx",
                "chunk_index": 2
            }
        ],
        "source_documents": [
            "DocChat API - Technical Handbook.docx"
        ],
        "chunks_found": 10
    },
       "Who are the main competitors mentioned?": {
        "question": "Who are the main competitors mentioned?",
        "answer": "Based on the available documents, there is limited information about specific competitors mentioned. The documents primarily focus on internal strategies and positioning rather than detailed competitive analysis. While some general market positioning is discussed, specific competitor names or detailed competitive intelligence is not extensively covered in the current document set. This information would likely require additional competitive research or market analysis documents to provide a comprehensive answer.",
        "confidence": {
            "level": "Low",
            "explanation": "Limited information available in the current document set. The documents focus more on internal strategies than competitive analysis, making it difficult to provide specific competitor details."
        },
        "sources": [
            {
                "file_name": "The Daily Grind - Marketing Strategy.docx",
                "chunk_index": 5
            }
        ],
        "source_documents": ["The Daily Grind - Marketing Strategy.docx"],
        "chunks_found": 1
    }
}

@router.post("/query")
async def mock_query_demo(request: MockQueryRequest):
    """
    Simple mock demo endpoint that returns the correct response.
    """
    
    
    # Simple exact match lookup
    if request.question in MOCK_RESPONSES:
        return MOCK_RESPONSES[request.question]
    
    # Fallback for any other question
    return {
        "question": request.question,
        "answer": f"Based on the uploaded documents, here's what I found regarding your question: '{request.question}'. The information suggests several key insights that would be relevant to your inquiry.",
        "confidence": {
            "level": "High",
            "explanation": "High confidence based on multiple document sources"
        },
        "sources": [
            {
                "file_name": "CloudScale_Solutions_Sales_Proposal.pdf",
                "chunk_index": 1
            }
        ],
        "source_documents": ["CloudScale_Solutions_Sales_Proposal.pdf"],
        "chunks_found": 1
    }

@router.get("/health")
async def mock_health():
    """Health check endpoint for mock demo service"""
    return {
        "status": "healthy",
        "service": "mock-demo",
        "mock_responses_loaded": len(MOCK_RESPONSES)
    }

@router.get("/templates")
async def get_template_questions():
    """Get list of available template questions"""
    return {
        "template_questions": list(MOCK_RESPONSES.keys()),
        "count": len(MOCK_RESPONSES)
    }
