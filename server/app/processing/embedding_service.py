import asyncio
from typing import List
from openai import OpenAI
import os

class EmbeddingService:
    """Handles embedding generation for documents and queries"""
    
    @staticmethod
    def _embed_chunks(chunks: List[str]) -> List[List[float]]:
        """
        Call OpenAI's embedding API using the v1 client.
        Returns a list of embedding vectors.
        """
        # Initialize client once
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        if not chunks:
            return []

        try:
            response = client.embeddings.create(
                input=chunks,
                model="text-embedding-3-small"
            )

            # Return list of vectors
            return [item.embedding for item in response.data]

        except Exception as e:
            return []
    
    @staticmethod
    async def generate_query_embedding(question: str) -> List[float]:
        """Generate embedding for a user question"""
        embeddings = await asyncio.to_thread(
            EmbeddingService._embed_chunks, [question]
        )
        return embeddings[0]
    
    @staticmethod
    async def generate_document_embeddings(chunks: List[str]) -> List[List[float]]:
        """Generate embeddings for document chunks"""
        return await asyncio.to_thread(
            EmbeddingService._embed_chunks, chunks
        )
