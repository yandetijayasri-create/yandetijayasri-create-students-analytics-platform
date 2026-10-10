"""
ElevAlte Backend Service: Student Profile & Onboarding
Handles academic calibration, onboarding processing, and profile updates.
"""

from typing import Dict, Any, List
from datetime import date, datetime
from ..db.repository import db
from .ai_ml_service import ai_ml_service

class StudentService:
    def get_profile(self, student_id: str = "std_001") -> Dict[str, Any]:
        if student_id not in db.students:
            student_id = "std_001"
        return db.students[student_id]

    def update_profile(self, student_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        if student_id not in db.students:
            student_id = "std_001"
        student = db.students[student_id]
        for k, v in updates.items():
            if v is not None:
                student[k] = v
        student["updated_at"] = datetime.now().isoformat()
        return student

    def complete_onboarding(self, student_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processes multi-step student onboarding:
        1. Calibrates student profile
        2. Sets enrolled subjects and initial baseline topics
        3. Invokes ML optimizer to generate the first adaptive study plan
        4. Awards onboarding XP (+100 XP)
        """
        if student_id not in db.students:
            student_id = "std_001"

        student = db.students[student_id]

        # Update attributes
        student["name"] = data.get("name", student["name"])
        student["course"] = data.get("course", student["course"])
        student["branch"] = data.get("branch", student["branch"])
        student["year"] = data.get("year", student["year"])
        student["semester"] = data.get("semester", student["semester"])
        student["target_goal"] = data.get("goal", student["target_goal"])
        student["daily_study_hours"] = data.get("daily_study_hours", "2 hours")
        student["preferred_time"] = data.get("preferred_time", "Evening")
        student["exam_date"] = data.get("exam_date", "2026-10-21")
        student["target_score"] = data.get("target_score", "90%")
        student["xp"] = student.get("xp", 1000) + 100

        # Calculate days remaining
        try:
            target_date = datetime.strptime(student["exam_date"], "%Y-%m-%d").date()
            days_left = max(1, (target_date - date.today()).days)
            student["days_remaining"] = days_left
        except Exception:
            student["days_remaining"] = 12

        # Initialize subjects & topics
        selected_subjects = data.get("subjects", ["Data Structures", "Python", "DBMS", "Operating Systems"])
        for sub_name in selected_subjects:
            if sub_name not in db.topics:
                db.topics[sub_name] = {
                    "id": f"top_{sub_name.lower().replace(' ', '_')}",
                    "subject": sub_name,
                    "topic": sub_name,
                    "mastery": 50.0,
                    "accuracy": 0.50,
                    "exam_weight": 1.5,
                    "mistakes": 0,
                    "days_since_practiced": 0,
                    "previous_accuracy": 0.50
                }

        # Generate initial personalized study plan
        topics_list = list(db.topics.values())
        try:
            daily_hours_val = float(student["daily_study_hours"].split()[0])
        except Exception:
            daily_hours_val = 2.0

        initial_plan = ai_ml_service.generate_adaptive_plan(
            topics_list=topics_list,
            daily_hours=daily_hours_val,
            days_count=7
        )
        db.set_student_plan(student_id, initial_plan)

        # Log onboarding activity
        db.activities.insert(0, {
            "id": f"act_{len(db.activities) + 1}",
            "title": "Onboarding Complete: Plan Generated",
            "type": "mastery",
            "timestamp": "Just now",
            "detail": f"Personalized study path generated for {student['target_goal']}.",
            "badge": "+100 XP"
        })

        return {
            "status": "success",
            "student": student,
            "study_plan": initial_plan,
            "message": "Personalized study plan successfully generated!"
        }

student_service = StudentService()
