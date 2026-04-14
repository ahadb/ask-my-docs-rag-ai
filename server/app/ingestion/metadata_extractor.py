from typing import Dict, Any
from datetime import datetime

class MetadataExtractor:
    """Extracts metadata from uploaded files"""
    
    @staticmethod
    def extract_file_metadata(file) -> Dict[str, Any]:
        """Extract metadata from a file"""
        return {
            "filename": file.filename,
            "content_type": file.content_type,
            "size": file.size if hasattr(file, 'size') else None,
            "uploaded_at": datetime.now().isoformat(),
            "file_type": MetadataExtractor._get_file_type(file.filename)
        }
    
    @staticmethod
    def create_chunk_metadata(filename: str, chunk_index: int) -> Dict[str, Any]:
        """Create metadata for a document chunk"""
        return {
            "file_name": filename,
            "chunk_index": chunk_index,
            "created_at": datetime.now().isoformat()
        }
    
    @staticmethod
    def _get_file_type(filename: str) -> str:
        """Determine file type from filename"""
        if filename.lower().endswith('.pdf'):
            return 'application/pdf'
        elif filename.lower().endswith('.docx'):
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        elif filename.lower().endswith('.doc'):
            return 'application/msword'
        else:
            return 'unknown'
