# test_supabase.py
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_ANON_KEY")
)

# Test connection
try:
    result = supabase.table("documents").select("count").execute()
    print("✅ Connected to Supabase!")
    print(f"Result: {result}")
except Exception as e:
    print(f"❌ Connection failed: {e}")