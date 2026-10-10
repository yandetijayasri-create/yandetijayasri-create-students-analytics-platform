from fastapi import APIRouter, Depends
from typing import Dict, Any, List
from ..schemas.dashboard import DashboardResponse, AIRecommendationSchema, LearningGapSchema, ActivityItemSchema, DashboardStatsSchema
from ..schemas.study_plan import StudyTaskSchema
from ..schemas.student import StudentResponse
from ..services.ai_ml_service import ai_ml_service
from ..db.repository import db
from .auth import get_current_user_id

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardResponse)
def get_dashboard(student_id: str = Depends(get_current_user_id)):
    student = db.students.get(student_id, db.students["std_001"])
    topics_map = db.get_student_topics(student_id)
    topics_list = list(topics_map.values())
    days_to_exam = student.get("days_remaining", 12)

    # 1. AI/ML: Rank recommendations
    ranked_recs = ai_ml_service.rank_recommendations(topics_list, days_to_exam=days_to_exam)
    if ranked_recs:
        top_rec = ranked_recs[0]
        # Match topic name with DB accuracy
        matching_topic = next((t for t in topics_list if t["topic"] == top_rec["topic"]), None)
        acc_val = int((matching_topic["accuracy"] * 100) if matching_topic else 42)
        rec_schema = AIRecommendationSchema(
            id=top_rec.get("id", "rec_001"),
            headline=f"Focus on {top_rec['topic']} today.",
            topic=top_rec["topic"],
            subject=top_rec.get("subject", "Data Structures"),
            reason=top_rec.get("reason", f"Your recent quiz accuracy is {acc_val}%. Improving this topic could have high impact."),
            accuracy=acc_val,
            daysToExam=days_to_exam,
            impactLevel=top_rec.get("priority", "High"),
            actionLabel=top_rec.get("action", f"Practice {top_rec['topic']}"),
            actionUrl=f"/practice?topic={top_rec['topic'].lower().replace(' ', '_')}"
        )
    else:
        rec_schema = AIRecommendationSchema(
            id="rec_001",
            headline="Focus on Graph Traversal today.",
            topic="Graphs",
            subject="Data Structures",
            reason="Your recent quiz accuracy in this topic is 38%. Exam is approaching.",
            accuracy=38,
            daysToExam=days_to_exam,
            impactLevel="High",
            actionLabel="Start Recommended Session",
            actionUrl="/practice?topic=graphs"
        )

    # 2. AI/ML: Classify learning gaps
    classified = ai_ml_service.classify_learning_gaps(topics_list)
    gaps_schema = [
        LearningGapSchema(
            id=g.get("id", f"gap_{i}"),
            topic=g["topic"],
            subject=g.get("subject", "Data Structures"),
            accuracy=int(g.get("accuracy", 0.5) * 100) if isinstance(g.get("accuracy"), float) and g.get("accuracy") <= 1.0 else int(g.get("accuracy", 50)),
            priority=g.get("priority", "HIGH"),
            category=g.get("category", "HIGH_PRIORITY"),
            trend=g.get("trend", "stable"),
            lastPracticed=g.get("lastPracticed", "Yesterday"),
            recommendation=g.get("recommendation", f"Target practice on {g['topic']} to reinforce mastery.")
        )
        for i, g in enumerate(classified)
    ]

    # 3. Tasks (Student-partitioned)
    student_tasks = db.get_student_tasks(student_id)
    today_tasks_schema = [
        StudyTaskSchema(
            id=t["id"],
            subject=t.get("subject", "Data Structures & Algorithms"),
            topic=t.get("topic", "General Concepts"),
            type=t.get("type", "Practice"),
            title=t.get("title", f"Study Task ({t['id']})"),
            durationMinutes=t.get("durationMinutes", 25),
            completed=t.get("completed", False),
            xpReward=t.get("xpReward", 35)
        )
        for t in student_tasks
    ]

    # 4. Activities (Student-partitioned)
    student_acts = db.get_student_activities(student_id)
    activities_schema = [
        ActivityItemSchema(
            id=a["id"],
            title=a["title"],
            type=a["type"],
            timestamp=a["timestamp"],
            detail=a["detail"],
            badge=a.get("badge")
        )
        for a in student_acts[:6]
    ]

    # 5. Stats
    completed_count = sum(1 for t in student_tasks if t["completed"])
    mins = student.get("total_study_minutes", 755)
    hours_str = f"{mins // 60}h {mins % 60}m" if mins > 0 else "1h 25m"
    
    # Calculate avg quiz accuracy from topics
    avg_acc = int(sum(t.get("accuracy", 0.5) * 100 for t in topics_list) / len(topics_list)) if topics_list else 76

    stats_schema = DashboardStatsSchema(
        studyTimeToday="1h 25m",
        completedTasksCount=completed_count,
        totalTasksCount=len(student_tasks),
        quizAccuracy=avg_acc,
        streakDays=student.get("streak_days", 7)
    )

    profile_schema = StudentResponse(
        id=student["id"],
        name=student["name"],
        email=student["email"],
        avatar=student.get("avatar_url") or student.get("avatar"),
        avatar_url=student.get("avatar_url"),
        course=student["course"],
        branch=student["branch"],
        year=student["year"],
        semester=student["semester"],
        target_goal=student["target_goal"],
        exam_name=student.get("exam_name", "Semester Final Exams"),
        exam_date=student["exam_date"],
        days_remaining=student.get("days_remaining", 12),
        target_score=student["target_score"],
        daily_study_hours=student["daily_study_hours"],
        preferred_time=student["preferred_time"],
        streak_days=student.get("streak_days", 7),
        total_study_time=hours_str,
        total_study_minutes=mins,
        xp=student.get("xp", 1240),
        level=student.get("level", 8),
        level_title=student.get("level_title", "Consistent Learner")
    )

    return DashboardResponse(
        profile=profile_schema,
        todayTasks=today_tasks_schema,
        recommendation=rec_schema,
        learningGaps=gaps_schema,
        recentActivities=activities_schema,
        stats=stats_schema,
        planAdapted=student.get("plan_adapted", False),
        planAdaptedMessage=student.get("plan_adapted_message")
    )
