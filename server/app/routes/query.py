from openai import OpenAI
from typing import Optional
from fastapi import APIRouter, Body, Depends
from pydantic import BaseModel
import os
import re
from app.services.embedding import embed_chunks
from app.config import get_supabase_client
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/query", tags=["query"])

# Extract confidence from LLM response
def extract_confidence(response_text):
    confidence_match = re.search(r'\*\*Confidence:\s*(\w+)\s*-\s*(.*?)\*\*', response_text)
    if confidence_match:
        level = confidence_match.group(1)
        explanation = confidence_match.group(2)
        return {
            'level': level,
            'explanation': explanation
        }
    return None

class QueryRequest(BaseModel):
    question: str
    top_k: Optional[int] = None

@router.post("")
async def query_docs(request: QueryRequest, current_user: dict = Depends(get_current_user)):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    try:
        # 1. Embed the question
        question_embedding = embed_chunks([request.question])[0]

        # 2. Search Supabase for similar chunks using pgvector
        supabase = get_supabase_client()
        results = supabase.rpc(
            "match_chunks",
            {
                "query_embedding": question_embedding,
                "match_count": request.top_k or 10
            }
        ).execute()

        # 3. Get matched documents from Supabase response
        retrieved_chunks = [result["content"] for result in results.data]
        metadatas = [result["metadata"] for result in results.data]

        # Get unique source documents
        source_files = list(set(meta.get("file_name", "Unknown") for meta in metadatas))

        # 4. Create the context prompt with source attribution
        context_with_sources = []
        for i, (chunk, meta) in enumerate(zip(retrieved_chunks, metadatas)):
            source_file = meta.get("file_name", "Unknown")
            context_with_sources.append(f"[Source: {source_file}]\n{chunk}")
        
        context = "\n\n".join(context_with_sources)
        system_prompt = (
            "You are DocChat, an AI assistant that answers questions based on the provided documents. "
            "Answer clearly, concisely, and include facts only from the context below. "
            "When citing information, mention which document it came from.\n\n"
            "FORMATTING: Use markdown formatting to make your responses clear and professional:\n"
            "- Use **bold** for important information\n"
            "- Use *italics* for emphasis\n"
            "- Use bullet points (-) for lists\n"
            "- Use `code` formatting for specific terms or numbers\n\n"
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
            f"Context:\n{context}\n\nQuestion: {request.question}"
        )

        # 5. Call OpenAI Chat Model
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
            ],
        )

        # 6. Extract confidence from response
        full_response = response.choices[0].message.content
        confidence_data = extract_confidence(full_response)
        
        # Clean the answer by removing confidence section
        clean_answer = re.sub(r'\*\*Confidence:.*?\*\*', '', full_response).strip()

        return {
            "question": request.question,
            "answer": clean_answer,
            "confidence": confidence_data,
            "sources": metadatas,
            "source_documents": source_files,
            "chunks_found": len(retrieved_chunks)
        }

    except Exception as e:
        return {"error": str(e)}