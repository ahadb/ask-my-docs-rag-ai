import hashlib
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

class CacheManager:
    """Manages response caching for RAG queries"""
    
    CACHE_TTL = 3600  # 1 hour cache TTL
    MAX_CACHE_SIZE = 1000
    
    def __init__(self):
        self.cache: Dict[str, Dict[str, Any]] = {}
    
    def generate_cache_key(self, question: str, top_k: int) -> str:
        """Generate a unique cache key for the query"""
        return hashlib.md5(f"{question.lower().strip()}:{top_k}".encode()).hexdigest()
    
    def is_cache_valid(self, cache_entry: Dict[str, Any]) -> bool:
        """Check if cache entry is still valid based on TTL"""
        if not cache_entry:
            return False
        cache_time = datetime.fromisoformat(cache_entry.get('timestamp', ''))
        return datetime.now() - cache_time < timedelta(seconds=self.CACHE_TTL)
    
    def get_cached_response(self, question: str, top_k: int) -> Optional[Dict[str, Any]]:
        """Get cached response if available and valid"""
        cache_key = self.generate_cache_key(question, top_k)
        cached_response = self.cache.get(cache_key)
        
        print(f"🔍 CACHE DEBUG: Looking for key: {cache_key}")
        print(f"🔍 CACHE DEBUG: Available keys: {list(self.cache.keys())}")
        print(f"🔍 CACHE DEBUG: Found response: {cached_response is not None}")
        
        if cached_response and self.is_cache_valid(cached_response):
            print(f"🔍 CACHE DEBUG: Cache is valid, returning response")
            cached_response['cached'] = True
            cached_response['cache_timestamp'] = cached_response.get('timestamp')
            return cached_response
        
        print(f"🔍 CACHE DEBUG: Cache miss or invalid")
        return None
    
    def cache_response(self, question: str, top_k: int, response_data: Dict[str, Any]) -> None:
        """Cache a response for future requests"""
        cache_key = self.generate_cache_key(question, top_k)
        response_data['cached'] = False
        response_data['timestamp'] = datetime.now().isoformat()
        
        print(f"💾 CACHE DEBUG: Storing with key: {cache_key}")
        print(f"💾 CACHE DEBUG: Question: '{question[:50]}...'")
        print(f"💾 CACHE DEBUG: Top_k: {top_k}")
        
        self.cache[cache_key] = response_data.copy()
        
        print(f"💾 CACHE DEBUG: Stored! Cache size now: {len(self.cache)}")
        
        # Clean up old cache entries to prevent memory leaks
        if len(self.cache) > self.MAX_CACHE_SIZE:
            self._cleanup_cache()
    
    def _cleanup_cache(self) -> None:
        """Remove oldest cache entries"""
        sorted_cache = sorted(self.cache.items(), key=lambda x: x[1].get('timestamp', ''))
        for key, _ in sorted_cache[:200]:  # Remove oldest 200 entries
            self.cache.pop(key, None)

# Global cache instance
cache_manager = CacheManager()
