from fastapi import APIRouter, Body
from pydantic import BaseModel
from app.services.embedding import embed_chunks
from app.services.storage import collection
from openai import OpenAI
import os

router = APIRouter(prefix="/query", tags=["query"])

class QueryRequest(BaseModel):
    question: str
    top_k: int = 5

@router.post("/query")
async def query_docs(request: QueryRequest):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    try:
        # 1. Embed the question
        question_embedding = embed_chunks([request.question])[0]

        # 2. Search Chroma for similar chunks
        results = collection.query(
            query_embeddings=[question_embedding],
            n_results=request.top_k
        )

        # 3. Get matched documents
        retrieved_chunks = results['documents'][0]
        metadatas = results['metadatas'][0]

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
