from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os
from typing import Optional

router = APIRouter(prefix="/settings")

class SettingsUpdate(BaseModel):
    chunk_size: Optional[int] = None
    chunk_overlap: Optional[int] = None
    top_k_retrieval: Optional[int] = None
    temperature: Optional[float] = None
    model: Optional[str] = None
    typewriter_speed: Optional[int] = None
    theme: Optional[str] = None
    batch_processing: Optional[bool] = None

DEFAULT_SETTINGS = {
    "chunk_size": 1000,
    "chunk_overlap": 200,
    "top_k_retrieval": 10,
    "temperature": 0.7,
    "model": "gpt-3.5-turbo",
    "typewriter_speed": 50,
    "theme": "light",
    "batch_processing": True
}

SETTINGS_FILE = "settings.json"

def load_settings():
    """Load settings from JSON file or return defaults"""
    if os.path.exists(SETTINGS_FILE):
        try:
            with open(SETTINGS_FILE, 'r') as f:
                return json.load(f)
        except:
            return DEFAULT_SETTINGS.copy()
    return DEFAULT_SETTINGS.copy()

def save_settings(settings: dict):
    """Save settings to JSON file"""
    with open(SETTINGS_FILE, 'w') as f:
        json.dump(settings, f, indent=2)

@router.get("")
def get_settings():
    """Get current application settings"""
    return load_settings()

@router.post("")
def update_settings(settings_update: SettingsUpdate):
    """Update application settings"""
    current_settings = load_settings()
    
    # Update only provided fields
    update_data = settings_update.dict(exclude_unset=True)
    current_settings.update(update_data)
    
    # Validate settings
    if current_settings.get("chunk_size") and current_settings["chunk_size"] < 100:
        raise HTTPException(status_code=400, detail="Chunk size must be at least 100")
    
    if current_settings.get("chunk_overlap") and current_settings["chunk_overlap"] >= current_settings.get("chunk_size", 1000):
        raise HTTPException(status_code=400, detail="Chunk overlap must be less than chunk size")
    
    if current_settings.get("temperature") and (current_settings["temperature"] < 0 or current_settings["temperature"] > 2):
        raise HTTPException(status_code=400, detail="Temperature must be between 0 and 2")
    
    if current_settings.get("top_k_retrieval") and current_settings["top_k_retrieval"] < 1:
        raise HTTPException(status_code=400, detail="Top-K retrieval must be at least 1")
    
    save_settings(current_settings)
    return {"message": "Settings updated successfully", "settings": current_settings}

@router.post("/reset")
def reset_settings():
    """Reset settings to defaults"""
    save_settings(DEFAULT_SETTINGS.copy())
    return {"message": "Settings reset to defaults", "settings": DEFAULT_SETTINGS}
