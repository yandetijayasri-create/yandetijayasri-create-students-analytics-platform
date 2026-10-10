from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from ..services.ai_ml_service import ai_ml_service
from ..db.repository import db
from .auth import get_current_user_id

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("", response_model=List[Dict[str, Any]])
def get_recommendations(student_id: str = Depends(get_current_user_id)):
    student = db.get_student(student_id) if hasattr(db, "get_student") else db.students.get(student_id, db.students.get("std_001"))
    days_to_exam = student.get("days_remaining", 12) if student else 12
    topics_list = list(db.get_student_topics(student_id).values())
    recs = ai_ml_service.rank_recommendations(topics_list, days_to_exam=days_to_exam)
    return recs

