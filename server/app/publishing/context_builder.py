from typing import List, Dict, Any, Tuple
from app.processing.embedding_service import EmbeddingService
from app.shared.database.vector_store import VectorStore

class ContextBuilder:
    """Builds context for RAG responses from retrieved chunks"""
    
    MAX_CONTEXT_LENGTH = 3000
    MAX_CHUNKS = 5
    
    @staticmethod
    async def retrieve_context(question: str, top_k: int = None) -> Tuple[str, List[Dict[str, Any]], List[str]]:
        """Retrieve relevant context for a question"""
        # Generate question embedding
        question_embedding = await EmbeddingService.generate_query_embedding(question)
        
        # Search for similar chunks
        match_count = min(top_k or ContextBuilder.MAX_CHUNKS, ContextBuilder.MAX_CHUNKS)
        results = await VectorStore.search_similar_chunks(question_embedding, match_count)
        
        if not results:
            return "", [], []
        
        # Extract chunks and metadata
        retrieved_chunks = [result["content"] for result in results]
        metadatas = [result["metadata"] for result in results]
        
        # Get unique source documents
        source_files = list(set(meta.get("file_name", "Unknown") for meta in metadatas))
        
        # Build context with source attribution
        context_with_sources = []
        for chunk, meta in zip(retrieved_chunks, metadatas):
            source_file = meta.get("file_name", "Unknown")
            context_with_sources.append(f"[Source: {source_file}]\n{chunk}")
        
        context = "\n\n".join(context_with_sources)
        
        # Truncate context if needed
        if len(context) > ContextBuilder.MAX_CONTEXT_LENGTH:
            context = ContextBuilder._truncate_context(context, ContextBuilder.MAX_CONTEXT_LENGTH)
        
        return context, metadatas, source_files
    
    @staticmethod
    def _truncate_context(context: str, max_length: int) -> str:
        """Truncate context while preserving source attribution"""
        if len(context) <= max_length:
            return context
        
        # Split by source blocks to maintain source attribution
        source_blocks = context.split('[Source:')
        truncated_blocks = []
        current_length = 0
        
        for block in source_blocks:
            if current_length + len(block) <= max_length:
                truncated_blocks.append(block)
                current_length += len(block)
            else:
                # Add partial block if there's space
                remaining_space = max_length - current_length
                if remaining_space > 100:  # Only add if there's meaningful space
                    truncated_blocks.append(block[:remaining_space] + "...")
                break
        
        return '[Source:'.join(truncated_blocks)
