import fitz
import docx
from typing import Union, List, Dict
from fastapi import UploadFile
# Write birds to JSON file
import json
import os

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

def parse_raw_bird_text(raw_text: str):
    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
    birds = []
    i = 0

    # Skip the main title line if it's present
    if "fascinating birds" in lines[0].lower():
        i += 1

    while i < len(lines):
        # Bird name
        name = lines[i]
        i += 1

        # Gather description lines until "Habitat:" is found
        description_lines = []
        while i < len(lines) and not lines[i].startswith("Habitat:"):
            description_lines.append(lines[i])
            i += 1

        # Get habitat line
        habitat = ""
        if i < len(lines) and lines[i].startswith("Habitat:"):
            habitat = lines[i].replace("Habitat:", "").strip()
            i += 1


        # Clean 'nesting' from description and habitat (case-insensitive)
        description = " ".join(description_lines).replace("nesting", "").replace("Nesting", "")
        habitat = habitat.replace("nesting", "").replace("Nesting", "")

        # Append parsed bird entry
        birds.append({
            "name": name,
            "description": description,
            "habitat": habitat
        })

    # Create output directory if it doesn't exist
    os.makedirs('output', exist_ok=True)
    
    # Write birds to JSON file
    with open('output/birds.json', 'w') as f:
        json.dump(birds, f, indent=4)
    print('Cleaned birds:', birds)

    return birds

def birds_list_to_string(birds: List[Dict[str, str]]) -> str:
    """
    Converts a list of bird dictionaries into a clean, readable string using f-strings.
    Each bird includes name, description, and habitat.
    """
    return "\n\n".join(
        f"{bird['name'].strip()}\n{bird['description'].strip()}\nHabitat: {bird['habitat'].strip()}"
        for bird in birds
    )


