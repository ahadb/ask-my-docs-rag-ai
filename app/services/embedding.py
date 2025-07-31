from typing import List
from openai import OpenAI
import os

def embed_chunks(chunks: List[str]) -> List[List[float]]:
    """
    Call OpenAI's embedding API using the v1 client.
    Returns a list of embedding vectors.
    """

    # Initialize client once
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    if not chunks:
        return []

    print("Embedding chunks...")

    try:
        response = client.embeddings.create(
            input=chunks,
            model="text-embedding-3-small"
        )

        # Return list of vectors
        return [item.embedding for item in response.data]

    except Exception as e:
        print(f"Embedding failed: {e}")
        return []
