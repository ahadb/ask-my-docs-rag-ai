def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 50) -> list[str]:
    """
    Chunk the text into smaller chunks of a specified size.
    """
    chunks = []
    start = 0
    text_length = len(text)
    
    while start < text_length:
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk.strip())
        start += chunk_size - overlap

    return chunks

print("chunking.py loaded")
    