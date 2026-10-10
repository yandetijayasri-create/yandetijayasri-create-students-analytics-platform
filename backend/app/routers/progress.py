from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
from ..db.repository import db
from ..services.ai_ml_service import ai_ml_service
from .auth import get_current_user_id

router = APIRouter(prefix="/progress", tags=["Progress"])

class WeeklyStudyItem(BaseModel):
    day: str
    hours: float
    target: float

class SubjectScoreItem(BaseModel):
    subject: str
    score: int
    target: int

class TopicMasteryItem(BaseModel):
    topic: str
    subject: str
    mastery: int
    category: str

class TrendPoint(BaseModel):
    date: str
    score: int
    predicted: int

class HeatmapDay(BaseModel):
    date: str
    intensity: int
    count: int

class ProgressAnalyticsResponse(BaseModel):
    overallMastery: int
    studyTimeHours: str
    quizAccuracy: int
    topicsCompleted: int
    weeklyStudyTime: List[WeeklyStudyItem]
    subjectPerformance: List[SubjectScoreItem]
    topicMastery: List[TopicMasteryItem]
    performanceTrend: List[TrendPoint]
    heatmapDays: List[HeatmapDay]

@router.get("", response_model=ProgressAnalyticsResponse)
def get_progress(student_id: str = Depends(get_current_user_id)):
    student = db.get_student(student_id) if hasattr(db, "get_student") else db.students.get(student_id, db.students.get("std_001"))
    topics_list = list(db.get_student_topics(student_id).values())

    # Dynamic calculation of overall mastery
    if topics_list:
        overall_mastery = int(sum(t.get("mastery", 50.0) for t in topics_list) / len(topics_list))
        avg_acc = int(sum(t.get("accuracy", 0.5) * 100 for t in topics_list) / len(topics_list))
        completed_topics = sum(1 for t in topics_list if t.get("mastery", 0) >= 75.0)
    else:
        overall_mastery = 65
        avg_acc = 76
        completed_topics = 12

    # Dynamic topic mastery list
    topic_mastery_items = []
    for t in sorted(topics_list, key=lambda x: x.get("mastery", 0), reverse=True):
        m_val = int(t.get("mastery", 50.0))
        cat = "STRONG" if m_val >= 75 else "NEEDS_PRACTICE" if m_val >= 50 else "HIGH_PRIORITY"
        topic_mastery_items.append(TopicMasteryItem(
            topic=t.get("topic", "Topic"),
            subject=t.get("subject", "Computer Science"),
            mastery=m_val,
            category=cat
        ))

    mins = student.get("total_study_minutes", 755)
    hours_str = f"{mins // 60}h {mins % 60}m" if mins > 0 else "12h 35m"

    # Dynamic subject performance grouping
    subjects_map = {}
    for t in topics_list:
        sub = t.get("subject", "Computer Science")
        if sub not in subjects_map:
            subjects_map[sub] = []
        subjects_map[sub].append(t.get("mastery", 50.0))
    
    subject_perf = [
        SubjectScoreItem(subject=sub, score=int(sum(scores) / len(scores)), target=85)
        for sub, scores in subjects_map.items()
    ]

    return ProgressAnalyticsResponse(
        overallMastery=overall_mastery,
        studyTimeHours=hours_str,
        quizAccuracy=avg_acc,
        topicsCompleted=completed_topics,
        weeklyStudyTime=[
            WeeklyStudyItem(day="Mon", hours=2.1, target=2.0),
            WeeklyStudyItem(day="Tue", hours=1.8, target=2.0),
            WeeklyStudyItem(day="Wed", hours=2.5, target=2.0),
            WeeklyStudyItem(day="Thu", hours=1.5, target=2.0),
            WeeklyStudyItem(day="Fri", hours=2.2, target=2.0),
            WeeklyStudyItem(day="Sat", hours=3.1, target=2.5),
            WeeklyStudyItem(day="Sun", hours=2.4, target=2.0),
        ],
        subjectPerformance=subject_perf or [
            SubjectScoreItem(subject="Data Structures", score=overall_mastery, target=90)
        ],
        topicMastery=topic_mastery_items,
        performanceTrend=[
            TrendPoint(date="Sep 15", score=58, predicted=60),
            TrendPoint(date="Sep 22", score=64, predicted=65),
            TrendPoint(date="Sep 29", score=71, predicted=72),
            TrendPoint(date="Oct 06", score=76, predicted=78),
            TrendPoint(date="Oct 13 (Est)", score=82, predicted=83),
            TrendPoint(date="Oct 20 (Target)", score=90, predicted=89),
        ],
        heatmapDays=[
            HeatmapDay(date="2026-10-01", intensity=3, count=5),
            HeatmapDay(date="2026-10-02", intensity=2, count=3),
            HeatmapDay(date="2026-10-03", intensity=4, count=8),
            HeatmapDay(date="2026-10-04", intensity=3, count=5),
            HeatmapDay(date="2026-10-05", intensity=3, count=4),
            HeatmapDay(date="2026-10-06", intensity=4, count=7),
            HeatmapDay(date="2026-10-07", intensity=3, count=5),
            HeatmapDay(date="2026-10-08", intensity=4, count=6),
            HeatmapDay(date="2026-10-09", intensity=4, count=7),
        ]
    )
