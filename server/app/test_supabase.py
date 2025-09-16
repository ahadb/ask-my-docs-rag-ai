# test_supabase.py
from .config import supabase_config, get_supabase_client

def test_connection():
    """Test Supabase connection and configuration"""
    print("🔧 Testing Supabase configuration...")
    
    # Test configuration
    try:
        print(f"✅ Supabase URL: {supabase_config.url[:20]}...")
        print(f"✅ Anon Key: {supabase_config.anon_key[:10]}...")
        if supabase_config.service_role_key:
            print(f"✅ Service Role Key: {supabase_config.service_role_key[:10]}...")
        else:
            print("⚠️  Service Role Key: Not set")
    except Exception as e:
        print(f"❌ Configuration error: {e}")
        return False
    
    # Test connection
    try:
        supabase = get_supabase_client()
        result = supabase.table("documents").select("count").limit(1).execute()
        print("✅ Connected to Supabase successfully!")
        print(f"✅ Test query result: {result}")
        return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

if __name__ == "__main__":
    test_connection()