import json
import os
import asyncio
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.ingestion.file_validator import FileValidator
from app.ingestion.metadata_extractor import MetadataExtractor
from app.processing.document_processor import DocumentProcessor
from app.shared.database.supabase_client import get_supabase_client
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/upload", tags=["upload"])

@router.get("/documents")
async def get_user_documents():
    """Get all documents uploaded by the current user"""
    try:
        supabase = get_supabase_client()
        
        # Get all documents (for now, until user_id column is added to database)
        documents_result = supabase.table("documents").select("*").execute()
        
        # For each document, get chunk count
        documents_with_stats = []
        for doc in documents_result.data:
            # Get chunk count for this document
            chunks_result = supabase.table("chunks").select("id").eq("document_id", doc["id"]).execute()
            chunk_count = len(chunks_result.data)
            
            # Extract metadata
            metadata = doc.get("metadata", {})
            
            documents_with_stats.append({
                "id": doc["id"],
                "filename": doc["filename"],
                "created_at": doc.get("created_at"),
                "metadata": metadata,
                "chunk_count": chunk_count,
                "word_count": metadata.get("word_count", 0),
                "status": "processed"
            })
        
        return {
            "documents": documents_with_stats,
            "total_count": len(documents_with_stats)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get documents: {str(e)}")

@router.delete("/documents/{document_id}")
async def delete_document(document_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a document and all its chunks/embeddings"""
    try:
        supabase = get_supabase_client()
        
        # Get chunks for this document
        chunks_result = supabase.table("chunks").select("id").eq("document_id", document_id).execute()
        chunk_ids = [chunk["id"] for chunk in chunks_result.data]
        
        # Delete embeddings for all chunks
        for chunk_id in chunk_ids:
            supabase.table("embeddings").delete().eq("chunk_id", chunk_id).execute()
        
        # Delete chunks
        supabase.table("chunks").delete().eq("document_id", document_id).execute()
        
        # Delete document
        supabase.table("documents").delete().eq("id", document_id).execute()
        
        return {"message": "Document deleted successfully", "document_id": document_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete document: {str(e)}")

@router.post("")
async def upload_file(file: UploadFile = File(...)):
    """Upload and process a single file"""
    try:
        # Validate file
        FileValidator.validate_file(file)
        
        # Check if file already exists
        supabase = get_supabase_client()
        existing_doc = supabase.table("documents").select("id").eq("filename", file.filename).execute()
        
        if existing_doc.data:
            return {
                "message": "File already uploaded",
                "filename": file.filename,
                "status": "skipped"
            }
        
        # Process the document
        processor = DocumentProcessor()
        result = await processor.process_document(file)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch")
async def upload_files_batch(files: list[UploadFile] = File(...)):
    """Upload multiple files simultaneously for batch processing"""
    try:
        # Validate all files
        FileValidator.validate_files(files)
        
        # Process all files in parallel
        processor = DocumentProcessor()
        tasks = [processor.process_document(file) for file in files]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Handle results and exceptions
        processed_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                processed_results.append({
                    "filename": files[i].filename,
                    "error": str(result),
                    "processing_steps": []
                })
            else:
                processed_results.append(result)
        
        return {
            "batch_results": processed_results,
            "total_files": len(files),
            "successful_files": len([r for r in processed_results if "error" not in r]),
            "failed_files": len([r for r in processed_results if "error" in r])
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
