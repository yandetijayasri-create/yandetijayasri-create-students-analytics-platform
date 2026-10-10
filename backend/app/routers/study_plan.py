from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from ..schemas.study_plan import StudyPlanDaySchema, RegeneratePlanRequest, StudyTaskSchema
from ..services.ai_ml_service import ai_ml_service
from ..db.repository import db
from .auth import get_current_user_id

router = APIRouter(prefix="/study-plan", tags=["Study Plan"])

@router.get("", response_model=List[StudyPlanDaySchema])
def get_study_plan(student_id: str = Depends(get_current_user_id)):
    student = db.students.get(student_id, db.students["std_001"])
    existing_plan = db.get_student_plan(student_id)
    if existing_plan:
        return existing_plan

    topics_list = list(db.get_student_topics(student_id).values())
    try:
        daily_hours = float(student.get("daily_study_hours", "2 hours").split()[0])
    except Exception:
        daily_hours = 2.0

    plan = ai_ml_service.generate_adaptive_plan(topics_list, daily_hours=daily_hours, days_count=7)
    db.set_student_plan(student_id, plan)
    return plan

@router.post("/generate", response_model=List[StudyPlanDaySchema])
def regenerate_study_plan(request: RegeneratePlanRequest, student_id: str = Depends(get_current_user_id)):
    student = db.students.get(student_id, db.students["std_001"])
    topics_list = list(db.get_student_topics(student_id).values())
    hours_val = request.hoursPerDay if request.hoursPerDay is not None else request.hours_per_day
    daily_hours = float(hours_val if hours_val is not None else 2.0)
    exam_date_val = request.examDate or request.exam_date

    # Use ML optimizer to re-calculate schedule
    adapted_plan = ai_ml_service.generate_adaptive_plan(topics_list, daily_hours=daily_hours, days_count=7)
    db.set_student_plan(student_id, adapted_plan)

    # Update student profile daily hours if specified
    if hours_val is not None:
        student["daily_study_hours"] = f"{hours_val} hours"
    if exam_date_val:
        student["exam_date"] = exam_date_val

    student["plan_adapted"] = True
    student["plan_adapted_message"] = "Your study plan was recalculated based on your updated preferences."

    return adapted_plan

@router.post("/{task_id}/complete", response_model=Dict[str, Any])
def complete_study_task(task_id: str, student_id: str = Depends(get_current_user_id)):
    student = db.students.get(student_id, db.students["std_001"])
    student_tasks = db.get_student_tasks(student_id)
    
    # Check in today's active tasks
    task = next((t for t in student_tasks if t["id"] == task_id), None)
    if not task:
        # Check in student plan if present
        saved_plan = db.get_student_plan(student_id)
        if saved_plan:
            for day in saved_plan:
                for t in day.get("tasks", []):
                    if t["id"] == task_id:
                        task = t
                        break
                if task:
                    break

        if not task:
            # Create a transient representation if it's from generated weekly plan
            task = {
                "id": task_id,
                "title": f"Study Task ({task_id})",
                "subject": "Data Structures & Algorithms",
                "topic": "General Concepts",
                "type": "Practice",
                "completed": False,
                "durationMinutes": 25,
                "xpReward": 35
            }
            student_tasks.append(task)
            if student_id == "std_001" and task not in db.today_tasks:
                db.today_tasks.append(task)

    task["completed"] = True
    xp_gain = task.get("xpReward", 35)
    student["xp"] = student.get("xp", 1240) + xp_gain
    student["total_study_minutes"] = student.get("total_study_minutes", 755) + task.get("durationMinutes", 25)

    # Log activity
    db.activities.insert(0, {
        "id": f"act_{len(db.activities) + 1}",
        "student_id": student_id,
        "title": f"Task Completed: {task.get('topic', task.get('title', 'Study Session'))}",
        "type": "session",
        "timestamp": "Just now",
        "detail": f"Completed {task.get('durationMinutes', 25)} mins of focused preparation.",
        "badge": f"+{xp_gain} XP"
    })

    return {
        "status": "success",
        "task_id": task_id,
        "completed": True,
        "xpGained": xp_gain,
        "totalXp": student["xp"],
        "message": "Task marked as completed! XP awarded."
    }
