from fastapi import APIRouter, HTTPException, Header, Depends
from typing import Optional
from ..schemas.auth import RegisterRequest, LoginRequest, AuthResponse, UserMeResponse
from ..services.auth_service import register_user, authenticate_user, verify_access_token
from ..db.repository import db

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    """
    Extracts student_id from Bearer token if provided.
    In development mode, falls back to seeded student 'std_001' if unauthenticated.
    """
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ")[1].strip()
        payload = verify_access_token(token)
        if payload and "sub" in payload:
            return payload["sub"]
    return "std_001"

@router.post("/register", response_model=AuthResponse)
def register(req: RegisterRequest):
    try:
        result = register_user(req.name, req.email, req.password)
        return AuthResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Registration error occurred")

@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest):
    try:
        result = authenticate_user(req.email, req.password)
        return AuthResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Authentication server error")

@router.get("/me", response_model=UserMeResponse)
def get_me(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        # In dev mode, return default Alex Johnson
        std = db.students.get("std_001")
        return UserMeResponse(
            id="std_001",
            email="alex.johnson@university.edu",
            name="Alex Johnson",
            role="student",
            profile=std
        )
    
    token = authorization.split("Bearer ")[1].strip()
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired authentication token")

    user_id = payload.get("sub")
    user = db.users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile = db.students.get(user_id)
    return UserMeResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        role=user.get("role", "student"),
        profile=profile
    )
