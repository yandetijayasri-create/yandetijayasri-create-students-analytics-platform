from pydantic import BaseModel
from typing import Optional, Dict, Any

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    name: str

class UserMeResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str = "student"
    profile: Optional[Dict[str, Any]] = None
