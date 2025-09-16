from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional
import jwt
import os
from datetime import datetime, timedelta
from app.config import get_supabase_client

router = APIRouter(prefix="/auth", tags=["authentication"])
security = HTTPBearer()

# JWT Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict
    expires_in: int

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    created_at: str

def create_access_token(user_id: str, email: str) -> str:
    """Create JWT access token"""
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verify JWT token and return user info"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        email = payload.get("email")
        
        if user_id is None or email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        return {"user_id": user_id, "email": email}
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignUpRequest):
    """Create a new user account"""
    try:
        supabase = get_supabase_client()
        
        # Create user with Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
            "options": {
                "data": {
                    "full_name": request.full_name or ""
                }
            }
        })
        
        if auth_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user"
            )
        
        # Create access token
        access_token = create_access_token(
            user_id=auth_response.user.id,
            email=auth_response.user.email
        )
        
        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": auth_response.user.id,
                "email": auth_response.user.email,
                "full_name": request.full_name
            },
            expires_in=JWT_EXPIRATION_HOURS * 3600
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Signup failed: {str(e)}"
        )

@router.post("/signin", response_model=AuthResponse)
async def signin(request: SignInRequest):
    """Authenticate user and return access token"""
    try:
        supabase = get_supabase_client()
        
        # Authenticate with Supabase Auth
        auth_response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        
        if auth_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Create access token
        access_token = create_access_token(
            user_id=auth_response.user.id,
            email=auth_response.user.email
        )
        
        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": auth_response.user.id,
                "email": auth_response.user.email,
                "full_name": auth_response.user.user_metadata.get("full_name", "")
            },
            expires_in=JWT_EXPIRATION_HOURS * 3600
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Signin failed: {str(e)}"
        )

@router.post("/signout")
async def signout(current_user: dict = Depends(verify_token)):
    """Sign out user (invalidate token on client side)"""
    return {"message": "Successfully signed out"}

@router.get("/me", response_model=UserResponse)
async def get_current_user(current_user: dict = Depends(verify_token)):
    """Get current user information"""
    try:
        supabase = get_supabase_client()
        
        # Get user details from Supabase
        user_response = supabase.auth.get_user(current_user["user_id"])
        
        if user_response.user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserResponse(
            id=user_response.user.id,
            email=user_response.user.email,
            full_name=user_response.user.user_metadata.get("full_name"),
            created_at=user_response.user.created_at
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user: {str(e)}"
        )

@router.post("/refresh")
async def refresh_token(current_user: dict = Depends(verify_token)):
    """Refresh access token"""
    try:
        # Create new access token
        access_token = create_access_token(
            user_id=current_user["user_id"],
            email=current_user["email"]
        )
        
        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user=current_user,
            expires_in=JWT_EXPIRATION_HOURS * 3600
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to refresh token: {str(e)}"
        )
