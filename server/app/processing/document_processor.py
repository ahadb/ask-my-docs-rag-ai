import json
import os
import asyncio
import time
from fastapi import HTTPException
from app.processing.document_parser import DocumentParser
from app.processing.chunk_generator import ChunkGenerator
from app.processing.embedding_service import EmbeddingService
from app.shared.database.vector_store import VectorStore
from app.ingestion.metadata_extractor import MetadataExtractor

class DocumentProcessor:
    """Main document processing pipeline"""
    
    def __init__(self):
        self.parser = DocumentParser()
        self.chunker = ChunkGenerator()
        self.embedder = EmbeddingService()
        self.storage = VectorStore()
    
    async def process_document(self, file) -> dict:
        """Process a single document through the full pipeline"""
        try:
            # Start timing
            start_time = time.time()
            
            # Initialize processing steps
            processing_steps = [
                {"step": "uploading_file", "status": "completed"},
                {"step": "parsing_text", "status": "pending"},
                {"step": "creating_chunks", "status": "pending"},
                {"step": "generating_embeddings", "status": "pending"},
                {"step": "storing_in_vector_db", "status": "pending"}
            ]
            
            # 1. Parse the document
            text = self.parser.parse_document(file)
            processing_steps[1]["status"] = "completed"
            
            # Calculate word count
            word_count = len(text.split()) if text else 0
            
            if not text or len(text.strip()) == 0:
                raise HTTPException(status_code=400, detail="No text found in the file")
            
            # 2. Chunk the text
            chunks = self.chunker.chunk_text(text, chunk_size=500, overlap=50)
            processing_steps[2]["status"] = "completed"
            
            # 3. Generate embeddings
            embeddings = await self.embedder.generate_document_embeddings(chunks)
            processing_steps[3]["status"] = "completed"
            
            if not embeddings:
                raise HTTPException(status_code=500, detail="Failed to generate embeddings")
            
            # 4. Create metadata for each chunk
            metadata_list = [
                MetadataExtractor.create_chunk_metadata(file.filename, i)
                for i in range(len(chunks))
            ]
            
            # 5. Store in vector database
            success = await self.storage.store_embeddings(
                chunks, embeddings, metadata_list, None, word_count  # TODO: Add user_id
            )
            processing_steps[4]["status"] = "completed"
            
            if not success:
                raise HTTPException(status_code=500, detail="Failed to store embeddings")
            
            # Calculate total processing time
            end_time = time.time()
            processing_time = round(end_time - start_time, 2)
            
            # Create chunk previews
            chunk_previews = self._create_chunk_previews(chunks)
            
            return {
                "filename": file.filename,
                "num_chunks": len(chunks),
                "word_count": word_count,
                "processing_time": processing_time,
                "chunk_previews": chunk_previews,
                "embedding_preview": embeddings[0][:5] if embeddings else [],
                "processing_steps": processing_steps
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    def _create_chunk_previews(self, chunks: list) -> list:
        """Create previews of the first few chunks"""
        chunk_previews = []
        for i, chunk in enumerate(chunks[:2]):  # Show first 2 chunks
            preview_text = chunk[:150] + "..." if len(chunk) > 150 else chunk
            chunk_previews.append({
                "index": i,
                "preview": preview_text,
                "full_length": len(chunk)
            })
        return chunk_previews
