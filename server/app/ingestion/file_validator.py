from fastapi import HTTPException
from typing import List

class FileValidator:
    """Validates uploaded files"""
    
    SUPPORTED_EXTENSIONS = [".pdf", ".docx", ".doc"]
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    
    @staticmethod
    def validate_file(file) -> None:
        """Validate a single file"""
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")
        
        # Check file extension
        if not any(file.filename.lower().endswith(ext) for ext in FileValidator.SUPPORTED_EXTENSIONS):
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type. Supported types: {', '.join(FileValidator.SUPPORTED_EXTENSIONS)}"
            )
    
    @staticmethod
    def validate_files(files: List) -> None:
        """Validate multiple files"""
        if not files:
            raise HTTPException(status_code=400, detail="No files provided")
        
        for file in files:
            FileValidator.validate_file(file)
