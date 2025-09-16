import os
from dotenv import load_dotenv
from supabase import create_client, Client
from typing import Optional

# Load environment variables
load_dotenv()

class SupabaseConfig:
    """Supabase configuration and client management"""
    
    def __init__(self):
        self.url: str = os.getenv("SUPABASE_URL", "")
        self.anon_key: str = os.getenv("SUPABASE_ANON_KEY", "")
        self.service_role_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
        
        if not self.url or not self.anon_key:
            raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables")
    
    def get_client(self, use_service_role: bool = False) -> Client:
        """Get Supabase client with appropriate key"""
        key = self.service_role_key if use_service_role else self.anon_key
        
        if use_service_role and not self.service_role_key:
            raise ValueError("SUPABASE_SERVICE_ROLE_KEY must be set to use service role")
        
        return create_client(self.url, key)
    
    def test_connection(self) -> bool:
        """Test Supabase connection"""
        try:
            client = self.get_client()
            # Simple test query
            result = client.table("documents").select("count").limit(1).execute()
            return True
        except Exception as e:
            print(f"Supabase connection test failed: {e}")
            return False

# Global configuration instance
supabase_config = SupabaseConfig()

# Convenience function to get client
def get_supabase_client(use_service_role: bool = False) -> Client:
    """Get Supabase client instance"""
    return supabase_config.get_client(use_service_role)
