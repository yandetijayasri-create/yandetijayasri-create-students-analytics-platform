"""
ElevAlte Backend Service: Authentication & Token Management
Provides secure registration, password hashing, and token issuance.
"""

import hmac
import hashlib
import json
import base64
import time
from typing import Optional, Dict, Any
from ..db.repository import db, hash_password
from ..config import settings

SECRET_KEY = settings.SECRET_KEY

def create_access_token(user_id: str, email: str, expires_in_seconds: int = 86400) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": user_id,
        "email": email,
        "exp": int(time.time()) + expires_in_seconds
    }
    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    signing_input = f"{header_b64}.{payload_b64}"
    signature = hmac.new(SECRET_KEY.encode(), signing_input.encode(), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def verify_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        signing_input = f"{header_b64}.{payload_b64}"
        expected_sig = hmac.new(SECRET_KEY.encode(), signing_input.encode(), hashlib.sha256).digest()
        actual_sig = base64.urlsafe_b64decode(sig_b64 + "==")
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
        
        # Decode payload
        payload_json = base64.urlsafe_b64decode(payload_b64 + "==").decode()
        payload = json.loads(payload_json)
        if payload.get("exp", 0) < time.time():
            return None # Expired
        return payload
    except Exception:
        return None

def register_user(name: str, email: str, password: str) -> Dict[str, Any]:
    # Check if exists
    for u in db.users.values():
        if u["email"].lower() == email.lower():
            raise ValueError("Email already registered")

    user_id = f"std_{len(db.users) + 1:03d}"
    db.users[user_id] = {
        "id": user_id,
        "email": email,
        "password_hash": hash_password(password),
        "name": name,
        "role": "student",
        "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }

    # Initialize empty student profile
    db.students[user_id] = {
        "id": user_id,
        "name": name,
        "email": email,
        "avatar_url": None,
        "course": "Bachelor of Technology",
        "branch": "Computer Science & Engineering",
        "year": "1st Year",
        "semester": "1st Semester",
        "target_goal": "Semester Examinations",
        "exam_name": "Upcoming Exams",
        "exam_date": "2026-11-01",
        "days_remaining": 20,
        "target_score": "85%",
        "daily_study_hours": "2 hours",
        "preferred_time": "Evening",
        "streak_days": 1,
        "total_study_minutes": 0,
        "xp": 100,
        "level": 1,
        "level_title": "Freshman Scholar"
    }

    token = create_access_token(user_id, email)
    return {
        "token": token,
        "user_id": user_id,
        "email": email,
        "name": name
    }

def authenticate_user(email: str, password: str) -> Dict[str, Any]:
    pw_hash = hash_password(password)
    for u in db.users.values():
        if u["email"].lower() == email.lower() and u["password_hash"] == pw_hash:
            token = create_access_token(u["id"], u["email"])
            return {
                "token": token,
                "user_id": u["id"],
                "email": u["email"],
                "name": u["name"]
            }
    raise ValueError("Invalid email or password")
