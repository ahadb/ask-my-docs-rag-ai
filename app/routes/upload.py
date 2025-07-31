from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.parsing import parse_file
from app.services import chunking
from app.services import embedding
from app.services import storage

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Unsupported file type")
    try:
        # 1. parse the file
        text = parse_file(file)

        print(text)
        
        if not text or len(text.strip()) == 0:
            raise HTTPException(status_code=400, detail="No text found in the file")
        
        # 2. chunk the text
        chunks = chunking.chunk_text(text, chunk_size=500, overlap=50)
        
        # 3. embed the chunks
        embeddings = embedding.embed_chunks(chunks)
        
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

        print(len(chunks))

        return {
            "filename": file.filename,
            "num_chunks": len(chunks),
            "embedding_preview": embeddings[0][:5] if embeddings else []
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
