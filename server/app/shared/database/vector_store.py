import asyncio
from typing import List, Dict, Any
from app.shared.database.supabase_client import get_supabase_client

def _get_simple_file_type(filename: str) -> str:
    """Get simple file extension from filename"""
    if filename.lower().endswith('.pdf'):
        return 'PDF'
    elif filename.lower().endswith('.docx'):
        return 'DOCX'
    elif filename.lower().endswith('.doc'):
        return 'DOC'
    else:
        return 'UNKNOWN'
from app.ingestion.metadata_extractor import MetadataExtractor

class VectorStore:
    """Handles vector similarity search operations"""
    
    @staticmethod
    async def search_similar_chunks(
        query_embedding: List[float], 
        match_count: int = 5
    ) -> List[Dict[str, Any]]:
        """Search for similar chunks using vector similarity"""
        supabase = get_supabase_client()
        
        results = await asyncio.to_thread(
            lambda: supabase.rpc(
                "match_chunks",
                {
                    "query_embedding": query_embedding,
                    "match_count": match_count
                }
            ).execute()
        )
        
        return results.data if results.data else []
    
    @staticmethod
    async def store_embeddings(
        chunks: List[str],
        embeddings: List[List[float]],
        metadata_list: List[Dict[str, Any]],
        user_id: str = None,
        word_count: int = 0
    ) -> bool:
        """Store document chunks and embeddings in the vector database"""
        supabase = get_supabase_client()
        
        try:
            # Get filename from first metadata
            filename = metadata_list[0].get('file_name', 'unknown')
            
            # 1. Insert document record
            document_data = {
                "filename": filename,
                "content": "",  # We don't store full content in documents table
                "metadata": {
                    "file_name": filename,
                    "file_type": _get_simple_file_type(filename),
                    "word_count": word_count
                }
            }
            
            # TODO: Add user_id when database schema is updated
            # if user_id:
            #     document_data["user_id"] = user_id
            
            document_result = await asyncio.to_thread(
                lambda: supabase.table("documents").insert(document_data).execute()
            )
            document_id = document_result.data[0]["id"]
            
            # 2. Insert chunks and embeddings
            for i, (chunk, embedding, metadata) in enumerate(zip(chunks, embeddings, metadata_list)):
                # Insert chunk
                chunk_data = {
                    "document_id": document_id,
                    "content": chunk,
                    "metadata": metadata
                }
                
                chunk_result = await asyncio.to_thread(
                    lambda: supabase.table("chunks").insert(chunk_data).execute()
                )
                chunk_id = chunk_result.data[0]["id"]
                
                # Insert embedding
                embedding_data = {
                    "chunk_id": chunk_id,
                    "vector_data": embedding
                }
                
                await asyncio.to_thread(
                    lambda: supabase.table("embeddings").insert(embedding_data).execute()
                )
                
            print(f"✅ Successfully stored {len(chunks)} chunks for document: {filename}")
            print(f"✅ Document ID: {document_id}")
            print(f"✅ First chunk preview: {chunks[0][:100]}..." if chunks else "❌ No chunks to store")
            
            return True
            
        except Exception as e:
            print(f"Error storing embeddings: {e}")
            return False
