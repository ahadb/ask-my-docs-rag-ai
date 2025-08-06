import chromadb
from chromadb.config import Settings
from typing import List, Dict

# Initialize Chroma client (persisted locally to ./chroma)
chroma_client = chromadb.PersistentClient(path="./chroma_db")

# Create or get a collection (like a table)
collection = chroma_client.get_or_create_collection(name="documents")

def store_embeddings(chunks: List[str], embeddings: List[List[float]], metadata_list: List[Dict]):
    """
    Store text chunks and their embeddings with metadata into ChromaDB.
    """
    # Use filename + chunk index for unique IDs
    filename = metadata_list[0]["file_name"] if metadata_list else "unknown"
    # Clean filename for use as ID (remove special characters)
    clean_filename = filename.replace(".", "_").replace(" ", "_").replace("-", "_")
    ids = [f"{clean_filename}_chunk_{i}" for i in range(len(chunks))]
    

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadata_list
    )
    # chroma_client.persist()

def clear_collection():
    """
    Clear all data from the ChromaDB collection.
    """
    try:
        collection.delete(where={})
    except Exception as e:
        print(f"Error clearing collection: {e}")
        # Fallback: try to delete specific documents
        try:
            # Get all documents and delete them individually
            results = collection.get()
            if results['ids']:
                collection.delete(ids=results['ids'])
        except Exception as e2:
            print(f"Fallback clear also failed: {e2}")
            raise e
