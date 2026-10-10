from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class AIAskRequest(BaseModel):
    query: Optional[str] = None
    message: Optional[str] = None
    student_id: Optional[str] = None
    topic: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class AIMessageResponse(BaseModel):
    id: str
    sender: str
    content: str
    timestamp: str
    steps: Optional[List[str]] = None
    quickActions: Optional[List[str]] = None
