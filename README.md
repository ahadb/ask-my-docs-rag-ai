# Project Plan: Ask My Docs – AI Knowledge Assistant with RAG

## 1. Project Outline

**Ask My Docs** is an AI-powered knowledge assistant that lets users upload internal documents (PDF, DOCX, Notion exports, or URLs) and ask natural-language questions. The system returns answers with context from documents, using **RAG** (Retrieval-Augmented Generation).

### Users:

- Founders
- Teams with internal knowledge silos
- Consultants and enterprises

### Core Features:

- Upload docs or crawl site URLs
- Parse and chunk text with metadata
- Store and search via vector DB (Chroma or pgvector)
- Query with OpenAI API (or Claude/Gemini)
- Return answer + source citations
- Optional UI: Streamlit or React

### Use Cases:

- Internal knowledge assistant
- Support content QA
- Internal SOP/documentation retrieval

---

## 2. Backend Starter Code Overview

### Tech Stack:

- Backend: **FastAPI**
- Vector DB: **ChromaDB (local)** or **pgvector (PostgreSQL)**
- Embeddings: **OpenAI** / **Hugging Face**
- File Parsing: `PyMuPDF`, `python-docx`, `BeautifulSoup` (for HTML)
- Frontend (optional): **React** or **Streamlit**

### Basic Steps:

1. Upload file → parse & chunk → create embeddings → store in vector DB
2. User query → get embedding → retrieve top-k docs → construct prompt
3. Call LLM → return answer + sources

### API Endpoints:

- `POST /upload` – Upload and parse files
- `POST /query` – Submit natural question and return AI response
- `GET /docs` – View uploaded files and chunks

### Security:

- Use API keys for auth, rate limits

---

## 3. Development Roadmap

### Phase 1: Core MVP

- ✅ FastAPI backend with file upload
- ✅ Chunking and embedding logic
- ✅ Store in ChromaDB or pgvector
- ✅ RAG query endpoint with OpenAI
- ✅ Basic UI or Postman testing

### Phase 2: Usability + Features

- Add metadata (file name, section headers)
- Citation formatting in responses
- File type filters and error handling
- Namespace per user/team (multi-tenant support)

### Phase 3: Enhancements

- Frontend with chat UI (React/Next.js or Streamlit)
- Add LangChain or LlamaIndex for orchestration
- Support web crawling (sitemaps, links)
- Async background processing (e.g., Celery or FastAPI tasks)

### Phase 4: Production Hardening

- Rate limiting, logging, retry logic
- Vector DB hosting or scaling (Weaviate, Pinecone)
- Deploy on Vercel + Fly.io or Railway
