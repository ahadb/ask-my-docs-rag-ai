import json
import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.parsing import parse_file, parse_raw_bird_text, birds_list_to_string
from app.services import chunking
from app.services import embedding
from app.services import storage

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Unsupported file type")
    try:
        # Initialize processing steps
        processing_steps = [
            {"step": "uploading_file", "status": "completed"},
            {"step": "parsing_text", "status": "pending"},
            {"step": "creating_chunks", "status": "pending"},
            {"step": "generating_embeddings", "status": "pending"},
            {"step": "storing_in_vector_db", "status": "pending"}
        ]

        # 1. parse the file
        text = parse_file(file)
        processing_steps[1]["status"] = "completed"  # parsing_text completed
        
        cleaned_text_list = parse_raw_bird_text(text)
        
        if not text or len(text.strip()) == 0:
            raise HTTPException(status_code=400, detail="No text found in the file")
        
        cleaned_text_str = birds_list_to_string(cleaned_text_list)
        # Write cleaned text list to JSON file
        output_dir = "data"
        os.makedirs(output_dir, exist_ok=True)
        
        output_file = os.path.join(output_dir, "birds.json")
        with open(output_file, "w") as f:
            json.dump(cleaned_text_list, f, indent=2)
        
        # 2. chunk the text
        chunks = chunking.chunk_text(cleaned_text_str, chunk_size=500, overlap=50)
        processing_steps[2]["status"] = "completed"  # creating_chunks completed
        
        # 3. embed the chunks
        embeddings = embedding.embed_chunks(chunks)
        processing_steps[3]["status"] = "completed"  # generating_embeddings completed
        
        if not embeddings:
            return {"error": "Failed to generate embeddings"}
        
        #4. create metadata object for each chunk
        metadata_list = [
            {
                "file_name": file.filename,
                "chunk_index": i
            }
            for i in range(len(chunks))
        ]

        # 5. Store in vector DB (Chroma)
        storage.store_embeddings(chunks, embeddings, metadata_list)
        processing_steps[4]["status"] = "completed"  # storing_in_vector_db completed

        # Create chunk previews (first 2 chunks with truncated text)
        chunk_previews = []
        for i, chunk in enumerate(chunks[:2]):  # Show first 2 chunks
            preview_text = chunk[:150] + "..." if len(chunk) > 150 else chunk
            chunk_previews.append({
                "index": i,
                "preview": preview_text,
                "full_length": len(chunk)
            })

        return {
            "filename": file.filename,
            "num_chunks": len(chunks),
            "chunk_previews": chunk_previews,
            "embedding_preview": embeddings[0][:5] if embeddings else [],
            "processing_steps": processing_steps
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
