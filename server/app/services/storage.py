from typing import List, Dict
from ..config import get_supabase_client

def store_embeddings(chunks: List[str], embeddings: List[List[float]], metadata_list: List[Dict], user_id: str = None):
    """
    Store text chunks and their embeddings with metadata into Supabase.
    """
    try:
        # Get Supabase client
        supabase = get_supabase_client()
        
        # Get filename from first metadata
        filename = metadata_list[0].get('file_name', 'unknown')
        
        # 1. Insert document record
        document_data = {
            "filename": filename,
            "content": "",  # We don't store full content in documents table
            "metadata": {"file_name": filename}
        }
        
        # TODO: Add user_id when database schema is updated
        # if user_id:
        #     document_data["user_id"] = user_id
        
        document_result = supabase.table("documents").insert(document_data).execute()
        document_id = document_result.data[0]["id"]
        
        # 2. Insert chunks and embeddings
        for i, (chunk, embedding, metadata) in enumerate(zip(chunks, embeddings, metadata_list)):
            # Insert chunk
            chunk_data = {
                "document_id": document_id,
                "content": chunk,
                "metadata": metadata
            }
            
            chunk_result = supabase.table("chunks").insert(chunk_data).execute()
            chunk_id = chunk_result.data[0]["id"]
            
            # Insert embedding
            embedding_data = {
                "chunk_id": chunk_id,
                "vector_data": embedding
            }
            
            supabase.table("embeddings").insert(embedding_data).execute()
            
        print(f"✅ Successfully stored {len(chunks)} chunks for document: {filename}")
        print(f"✅ Document ID: {document_id}")
        print(f"✅ First chunk preview: {chunks[0][:100]}..." if chunks else "❌ No chunks to store")
        
    except Exception as e:
        print(f"Error storing embeddings: {e}")
        raise e