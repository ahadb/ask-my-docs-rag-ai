from openai import OpenAI
from typing import Optional
from fastapi import APIRouter, Body
from pydantic import BaseModel
from app.services.embedding import embed_chunks
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_ANON_KEY")
)

router = APIRouter(prefix="/query", tags=["query"])

class QueryRequest(BaseModel):
    question: str
    top_k: Optional[int] = None

@router.post("")
async def query_docs(request: QueryRequest):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    try:
        # 1. Embed the question
        question_embedding = embed_chunks([request.question])[0]

        # 2. Search Supabase for similar chunks using pgvector
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

        # 4. Create the context prompt
        context = "\n\n".join(retrieved_chunks)
        system_prompt = (
            "You are an AI assistant that answers questions based on the provided documents. "
            "Answer clearly, concisely, and include facts only from the context below.\n\n"
            f"Context:\n{context}\n\nQuestion: {request.question}"
        )

        # 5. Call OpenAI Chat Model
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
            ],
        )

        return {
            "question": request.question,
            "answer": response.choices[0].message.content,
            "sources": metadatas
        }

    except Exception as e:
        return {"error": str(e)}