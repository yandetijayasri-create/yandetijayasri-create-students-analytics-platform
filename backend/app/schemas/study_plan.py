from pydantic import BaseModel
from typing import List, Optional

class StudyTaskSchema(BaseModel):
    id: str
    subject: Optional[str] = "Data Structures & Algorithms"
    topic: Optional[str] = "General Concepts"
    type: Optional[str] = "Practice" # 'Learn', 'Practice', 'Review'
    durationMinutes: int = 25
    completed: bool = False
    title: Optional[str] = None
    xpReward: Optional[int] = 35

class StudyPlanDaySchema(BaseModel):
    id: str
    dayName: str
    dateStr: str
    isToday: Optional[bool] = False
    tasks: List[StudyTaskSchema]

class RegeneratePlanRequest(BaseModel):
    reason: Optional[str] = "My performance changed"
    hoursPerDay: Optional[float] = 2.0
    hours_per_day: Optional[float] = None
    examDate: Optional[str] = None
    exam_date: Optional[str] = None
