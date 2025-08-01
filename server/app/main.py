from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, query

from dotenv import load_dotenv
load_dotenv()
import os
print(f"Environment loaded: {'OPENAI_API_KEY' in os.environ}")
print(f"API Key length: {len(os.getenv('OPENAI_API_KEY', ''))}")

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(query.router)