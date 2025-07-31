import fitz
import docx
from typing import Union
from fastapi import UploadFile

def parse_pdf(file: UploadFile) -> str:
    """Extract text from a PDF file using PyMuPDF."""
    text = ""
    with fitz.open(stream=file.file.read(), filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text

def parse_docx(file: UploadFile) -> str:
    """Extract text from a DOCX file using python-docx."""
    text = ""
    doc = docx.Document(file.file)
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

def parse_file(file: UploadFile) -> Union[str, None]:
    """Determine file type and extract text accordingly."""
    if file.filename.endswith(".pdf"):
        return parse_pdf(file)
    elif file.filename.endswith(".docx"):
        return parse_docx(file)
    else:
        return None  # Unsupported file type
