from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.ingestion.upload_router import router as upload_router
from app.publishing.query_router import router as query_router
from app.shared.auth.auth_router import router as auth_router
from app.shared.auth.settings_router import router as settings_router
from app.publishing.mock_router import router as mock_demo_router
from app.shared.auth.jwt_handler import get_current_user

from dotenv import load_dotenv
load_dotenv()
import os

# This is enough for my MVP, later I might:
# - Add Exception handling
# - Add logging
# - Add startup and shutdown events
# - Add .env and pydantic
# - Add tests

app = FastAPI(
    title="AI-Powered Document Search",
    description="Upload documents and query them using AI",
    version="0.1.0",
)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/health-auth")
async def health_auth_check(dict = Depends(get_current_user)):
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(query_router)
app.include_router(settings_router)
app.include_router(mock_demo_router)