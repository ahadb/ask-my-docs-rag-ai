from fastapi import HTTPException, status
from app.config import get_supabase_client
from typing import Dict, Any, Optional

class UserService:
    """Handles user-related operations"""
    
    @staticmethod
    async def create_user(email: str, password: str, full_name: Optional[str] = None) -> Dict[str, Any]:
        """Create a new user account"""
        try:
            supabase = get_supabase_client()
            
            # Create user with Supabase Auth
            auth_response = supabase.auth.sign_up({
                "email": email,
                "password": password,
                "options": {
                    "data": {
                        "full_name": full_name or ""
                    }
                }
            })
            
            if auth_response.user is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to create user"
                )
            
            return {
                "id": auth_response.user.id,
                "email": auth_response.user.email,
                "full_name": full_name
            }
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Signup failed: {str(e)}"
            )
    
    @staticmethod
    async def authenticate_user(email: str, password: str) -> Dict[str, Any]:
        """Authenticate user credentials"""
        try:
            supabase = get_supabase_client()
            
            # Authenticate with Supabase Auth
            auth_response = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            if auth_response.user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials"
                )
            
            return {
                "id": auth_response.user.id,
                "email": auth_response.user.email,
                "full_name": auth_response.user.user_metadata.get("full_name", "")
            }
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Signin failed: {str(e)}"
            )
    
    @staticmethod
    async def get_user_by_id(user_id: str) -> Dict[str, Any]:
        """Get user details by ID"""
        try:
            supabase = get_supabase_client()
            
            # Get user details from Supabase
            user_response = supabase.auth.get_user(user_id)
            
            if user_response.user is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            return {
                "id": user_response.user.id,
                "email": user_response.user.email,
                "full_name": user_response.user.user_metadata.get("full_name"),
                "created_at": user_response.user.created_at
            }
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get user: {str(e)}"
            )
