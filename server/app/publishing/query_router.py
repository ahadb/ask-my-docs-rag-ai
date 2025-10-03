from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, AsyncGenerator
from datetime import datetime
import json
import asyncio
from app.publishing.context_builder import ContextBuilder
from app.publishing.response_generator import ResponseGenerator
from app.publishing.cache_manager import cache_manager

router = APIRouter(prefix="/query", tags=["query"])

class QueryRequest(BaseModel):
    question: str
    top_k: Optional[int] = None

@router.post("")
async def query_docs(request: QueryRequest):
    """Handle RAG query requests"""
    try:
        # Check cache first for performance optimization
        cached_response = cache_manager.get_cached_response(
            request.question, 
            request.top_k or ContextBuilder.MAX_CHUNKS
        )
        
        print(f"🔍 Cache lookup for question: '{request.question[:50]}...'")
        print(f"🔍 Cache key: {cache_manager.generate_cache_key(request.question, request.top_k or ContextBuilder.MAX_CHUNKS)}")
        print(f"🔍 Cache result: {'HIT' if cached_response else 'MISS'}")
        print(f"🔍 Cache size: {len(cache_manager.cache)} entries")
        
        if cached_response:
            return cached_response

        # Retrieve context for the question
        context, metadatas, source_files = await ContextBuilder.retrieve_context(
            request.question, 
            request.top_k
        )
        
        if not context:
            return {
                "question": request.question,
                "answer": "I couldn't find any relevant information to answer your question.",
                "confidence": {"level": "Low", "explanation": "No relevant documents found"},
                "sources": [],
                "source_documents": [],
                "chunks_found": 0,
                "cached": False,
                "timestamp": datetime.now().isoformat(),
                "context_length": 0,
                "chunks_used": 0
            }

        # Generate response using GPT-4
        full_response = await ResponseGenerator.generate_response(context, request.question)
        
        # Extract confidence and clean response
        confidence_data = ResponseGenerator.extract_confidence(full_response)
        clean_answer = ResponseGenerator.clean_response(full_response)

        # Prepare response data
        response_data = {
            "question": request.question,
            "answer": clean_answer,
            "confidence": confidence_data,
            "sources": metadatas,
            "source_documents": source_files,
            "chunks_found": len(metadatas),
            "cached": False,
            "timestamp": datetime.now().isoformat(),
            "context_length": len(context),
            "chunks_used": len(metadatas)
        }

        # Cache the response for future requests
        cache_manager.cache_response(
            request.question, 
            request.top_k or ContextBuilder.MAX_CHUNKS, 
            response_data
        )

        return response_data

    except Exception as e:
        return {"error": str(e)}

@router.post("/stream")
async def query_docs_stream(request: QueryRequest):
    """Handle RAG query requests with streaming response"""
    async def generate_stream() -> AsyncGenerator[str, None]:
        try:
            # Check cache first for performance optimization
            cached_response = cache_manager.get_cached_response(
                request.question, 
                request.top_k or ContextBuilder.MAX_CHUNKS
            )

            print(f"🔍 STREAM Cache lookup for question: '{request.question[:50]}...'")
            print(f"🔍 STREAM Cache key: {cache_manager.generate_cache_key(request.question, request.top_k or ContextBuilder.MAX_CHUNKS)}")
            print(f"🔍 STREAM Cache result: {'HIT' if cached_response else 'MISS'}")
            print(f"🔍 STREAM Cache size: {len(cache_manager.cache)} entries")
            print(f"🔍 STREAM Cached response: {cached_response}")
            
            if cached_response:
               
                # Send cached response as complete (non-streaming) response
                cached_response["type"] = "complete"
                cached_response["cached"] = True
                yield f"data: {json.dumps(cached_response)}\n\n"
                return

            # Retrieve context for the question
            context, metadatas, source_files = await ContextBuilder.retrieve_context(
                request.question, 
                request.top_k
            )
            
            if not context:
                error_response = {
                    "question": request.question,
                    "answer": "I couldn't find any relevant information to answer your question.",
                    "confidence": {"level": "Low", "explanation": "No relevant documents found"},
                    "sources": [],
                    "source_documents": [],
                    "chunks_found": 0,
                    "cached": False,
                    "timestamp": datetime.now().isoformat(),
                    "context_length": 0,
                    "chunks_used": 0
                }
                yield f"data: {json.dumps(error_response)}\n\n"
                return

            # Stream response using GPT-4 and collect full response for caching
            full_answer = ""
            confidence_data = None
            
            async for chunk in ResponseGenerator.generate_streaming_response(context, request.question):
                yield f"data: {json.dumps(chunk)}\n\n"
                await asyncio.sleep(0.01)  # Small delay for smooth streaming
                
                # Collect data for caching
                if chunk.get("type") == "complete":
                    full_answer = chunk.get("answer", "")
                    confidence_data = chunk.get("confidence")

            # Send final metadata
            final_data = {
                "type": "metadata",
                "sources": metadatas,
                "source_documents": source_files,
                "chunks_found": len(metadatas),
                "context_length": len(context),
                "chunks_used": len(metadatas),
                "timestamp": datetime.now().isoformat()
            }
            yield f"data: {json.dumps(final_data)}\n\n"
            
            # Cache the response for future requests
            if full_answer and confidence_data:
                response_data = {
                    "question": request.question,
                    "answer": full_answer,
                    "confidence": confidence_data,
                    "sources": metadatas,
                    "source_documents": source_files,
                    "chunks_found": len(metadatas),
                    "cached": False,
                    "timestamp": datetime.now().isoformat(),
                    "context_length": len(context),
                    "chunks_used": len(metadatas)
                }
                
                print(f"💾 STREAM Caching response for question: '{request.question[:50]}...'")
                print(f"💾 STREAM Cache key: {cache_manager.generate_cache_key(request.question, request.top_k or ContextBuilder.MAX_CHUNKS)}")
                print(f"💾 STREAM Response data keys: {list(response_data.keys())}")
                
                cache_manager.cache_response(
                    request.question, 
                    request.top_k or ContextBuilder.MAX_CHUNKS, 
                    response_data
                )
                
                print(f"💾 STREAM Cache stored! New cache size: {len(cache_manager.cache)} entries")

        except Exception as e:
            error_data = {"type": "error", "error": str(e)}
            yield f"data: {json.dumps(error_data)}\n\n"

    return StreamingResponse(
        generate_stream(),
        media_type="text/plain",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )

