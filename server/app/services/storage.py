from supabase import create_client, Client
from typing import List, Dict
import os

from dotenv import load_dotenv
load_dotenv()

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_ANON_KEY")
)

def store_embeddings(chunks: List[str], embeddings: List[List[float]], metadata_list: List[Dict]):
    """
    Store text chunks and their embeddings with metadata into Supabase.
    """
    try:
        # Get filename from first metadata
        filename = metadata_list[0].get('file_name', 'unknown')
        
        # 1. Insert document record
        document_data = {
            "filename": filename,
            "content": "",  # We don't store full content in documents table
            "metadata": {"file_name": filename}
        }
        
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
            
        print(f"Stored {len(chunks)} chunks for document: {filename}")
        
    except Exception as e:
        print(f"Error storing embeddings: {e}")
        raise e