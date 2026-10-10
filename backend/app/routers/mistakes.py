from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from pydantic import BaseModel
from ..db.repository import db
from .auth import get_current_user_id

router = APIRouter(prefix="/mistakes", tags=["Mistakes"])

class MistakeItem(BaseModel):
    id: str
    topic: str
    subject: str
    mistakeCount: int
    question: str
    studentAnswer: str
    correctAnswer: str
    explanation: str
    lastAttempted: str

@router.get("", response_model=List[MistakeItem])
def get_mistakes(student_id: str = Depends(get_current_user_id)):
    user_mistakes = db.get_student_mistakes(student_id)
    return [
        MistakeItem(
            id=m["id"],
            topic=m["topic"],
            subject=m["subject"],
            mistakeCount=m["mistakeCount"],
            question=m["question"],
            studentAnswer=m["studentAnswer"],
            correctAnswer=m["correctAnswer"],
            explanation=m["explanation"],
            lastAttempted=m["lastAttempted"]
        )
        for m in user_mistakes
    ]

@router.post("/{mistake_id}/retry", response_model=Dict[str, Any])
def retry_mistake(mistake_id: str, student_id: str = Depends(get_current_user_id)):
    mistake = next((m for m in db.mistakes if m["id"] == mistake_id), None)
    if not mistake:
        return {"status": "not_found", "message": "Mistake record not found"}
    
    # Generate a targeted practice session for this specific weak topic
    return {
        "status": "ready",
        "topic": mistake["topic"],
        "subject": mistake["subject"],
        "practice_url": f"/practice?topic={mistake['topic'].lower().replace(' ', '_')}",
        "message": f"Targeted retry practice prepared for {mistake['topic']}."
    }
