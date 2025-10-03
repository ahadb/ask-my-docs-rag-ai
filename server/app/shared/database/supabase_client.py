from app.config import get_supabase_client

# Re-export the Supabase client for use across domains
__all__ = ['get_supabase_client']
