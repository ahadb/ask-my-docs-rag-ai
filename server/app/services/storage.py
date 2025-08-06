import chromadb
from chromadb.config import Settings
from typing import List, Dict

print("storage.py loaded")

# Initialize Chroma client (persisted locally to ./chroma)
chroma_client = chromadb.PersistentClient(path="./chroma")

# Create or get a collection (like a table)
collection = chroma_client.get_or_create_collection(name="documents")

def store_embeddings(chunks: List[str], embeddings: List[List[float]], metadata_list: List[Dict]):
    """
    Store text chunks and their embeddings with metadata into ChromaDB.
    """
    # Generate unique IDs based on filename and chunk index
    ids = []
    for i, metadata in enumerate(metadata_list):
        filename = metadata.get('filename', 'unknown')
        # Clean filename for use as ID (remove special characters)
        clean_filename = "".join(c for c in filename if c.isalnum() or c in ('-', '_')).rstrip()
        chunk_id = f"{clean_filename}_chunk_{i}"
        ids.append(chunk_id)
    

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadata_list
    )
    # chroma_client.persist()

    print("Count in collection:", collection.get())
