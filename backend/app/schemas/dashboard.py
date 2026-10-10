from pydantic import BaseModel
from typing import List, Optional
from .student import StudentResponse
from .study_plan import StudyTaskSchema

class AIRecommendationSchema(BaseModel):
    id: str
    headline: str
    topic: str
    subject: str
    reason: str
    accuracy: int
    daysToExam: int
    impactLevel: str
    actionLabel: str
    actionUrl: str

class LearningGapSchema(BaseModel):
    id: str
    topic: str
    subject: str
    accuracy: int
    priority: str
    category: str
    trend: str
    lastPracticed: str
    recommendation: str

class ActivityItemSchema(BaseModel):
    id: str
    title: str
    type: str
    timestamp: str
    detail: str
    badge: Optional[str] = None

class DashboardStatsSchema(BaseModel):
    studyTimeToday: str
    completedTasksCount: int
    totalTasksCount: int
    quizAccuracy: int
    streakDays: int

class DashboardResponse(BaseModel):
    profile: StudentResponse
    todayTasks: List[StudyTaskSchema]
    recommendation: AIRecommendationSchema
    learningGaps: List[LearningGapSchema]
    recentActivities: List[ActivityItemSchema]
    stats: DashboardStatsSchema
    planAdapted: Optional[bool] = False
    planAdaptedMessage: Optional[str] = None
