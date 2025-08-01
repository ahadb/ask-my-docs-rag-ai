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
    ids = [f"chunk-{i}" for i in range(len(chunks))]  # unique IDs for each chunk
    

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadata_list
    )
    # chroma_client.persist()

    print("Count in collection:", collection.get())
