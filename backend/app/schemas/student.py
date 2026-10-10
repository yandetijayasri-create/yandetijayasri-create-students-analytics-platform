from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict

class StudentBase(BaseModel):
    name: str
    email: str
    avatar: Optional[str] = None
    avatar_url: Optional[str] = None
    course: str
    branch: str
    year: str
    semester: str
    target_goal: str
    exam_name: Optional[str] = "Semester Exams"
    exam_date: str
    days_remaining: int = 12
    target_score: str
    daily_study_hours: str
    preferred_time: str
    streak_days: int = 7
    total_study_time: str = "12h 35m"
    total_study_minutes: Optional[int] = 755
    xp: int = 1240
    level: int = 8
    level_title: str = "Consistent Learner"

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    course: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[str] = None
    semester: Optional[str] = None
    target_goal: Optional[str] = None
    target_score: Optional[str] = None
    exam_name: Optional[str] = None
    exam_date: Optional[str] = None
    daily_study_hours: Optional[str] = None
    preferred_time: Optional[str] = None

class StudentResponse(StudentBase):
    id: str

class OnboardingRequest(BaseModel):
    name: str
    course: str
    branch: str
    year: str
    semester: str
    subjects: List[str] = Field(default_factory=lambda: ["Data Structures & Algorithms", "DBMS", "Operating Systems"])
    goal: str
    available_study_time: str = "2 hours"
    daily_study_hours: Optional[str] = "2 hours"
    preferred_study_time: str = "Evening (6 PM - 10 PM)"
    preferred_time: Optional[str] = "Evening (6 PM - 10 PM)"
    exam_date: str = "2026-10-21"
    target_score: str = "9.0 CGPA / 90%"

class OnboardingResponse(BaseModel):
    status: str = "success"
    message: str = "Personalized study plan successfully generated!"
    student: Dict[str, Any]
    study_plan: List[Dict[str, Any]]
