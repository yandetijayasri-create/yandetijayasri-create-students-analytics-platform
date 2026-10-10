"""
ElevAlte Backend Service: Quiz & Diagnostic Evaluation Layer
Orchestrates quiz generation, answer verification, Bayesian mastery updates,
misconception logging, learning gap classification, and adaptive plan updates.
"""

from typing import Dict, List, Any, Optional
from ..db.repository import db
from .ai_ml_service import ai_ml_service

class QuizService:
    def generate_quiz(
        self,
        subject: Optional[str] = "Data Structures & Algorithms",
        topic: Optional[str] = "Graphs",
        difficulty: Optional[str] = "Medium",
        number_of_questions: int = 5
    ) -> Dict[str, Any]:
        """
        Generates structured questions for student test-taking.
        SECURITY: Does NOT expose correctAnswer or explanation before submission!
        """
        filtered_questions = [
            q for q in db.questions
            if (not topic or topic.lower() in q["topic"].lower()) or
               (not subject or subject.lower() in q["subject"].lower())
        ]

        if not filtered_questions:
            filtered_questions = db.questions

        selected = filtered_questions[:min(number_of_questions, len(filtered_questions))]
        quiz_id = f"quiz_{len(db.questions)}_{topic.lower().replace(' ', '_') if topic else 'gen'}"

        sanitized_questions = [
            {
                "id": q["id"],
                "subject": q["subject"],
                "topic": q["topic"],
                "difficulty": q["difficulty"],
                "question": q["question"],
                "options": q["options"]
                # correctAnswer and explanation are omitted for security
            }
            for q in selected
        ]

        return {
            "quiz_id": quiz_id,
            "topic": topic,
            "subject": subject,
            "questions": sanitized_questions,
            "total_questions": len(sanitized_questions)
        }

    def submit_quiz(self, submission_data: Dict[str, Any], student_id: str = "std_001") -> Dict[str, Any]:
        """
        Evaluates quiz submission and runs the complete AI+ML feedback loop:
        1. Evaluates correctness and accuracy
        2. Logs mistakes with recurrence counters
        3. Invokes Bayesian Knowledge Tracing to update topic mastery
        4. Invokes Learning Gap Classifier
        5. Invokes Recommendation Ranker
        6. Updates today's study plan tasks
        7. Awards XP and records activity
        """
        answers = submission_data.get("answers", [])
        time_spent_seconds = submission_data.get("timeSpentSeconds", 120)

        correct_count = 0
        details = []
        topic_answers_map: Dict[str, List[bool]] = {}

        for ans in answers:
            q_id = ans.get("questionId")
            selected = ans.get("selectedAnswer", "").strip().upper()

            # Find matching question in question bank
            q = next((item for item in db.questions if item["id"] == q_id), None)
            if not q:
                continue

            is_correct = (q["correctAnswer"] == selected)
            if is_correct:
                correct_count += 1

            topic_name = q.get("topic", "General")
            if topic_name not in topic_answers_map:
                topic_answers_map[topic_name] = []
            topic_answers_map[topic_name].append(is_correct)

            # If incorrect, record in mistakes repository
            if not is_correct:
                existing_mistake = next((m for m in db.mistakes if m.get("student_id", "std_001") == student_id and m["topic"] == topic_name and m["question"] == q["question"]), None)
                if existing_mistake:
                    existing_mistake["mistakeCount"] += 1
                    existing_mistake["studentAnswer"] = f"{selected} (Selected {existing_mistake['mistakeCount']} times)"
                    existing_mistake["lastAttempted"] = "Just now"
                else:
                    db.mistakes.append({
                        "id": f"mst_{len(db.mistakes) + 1}",
                        "student_id": student_id,
                        "topic": topic_name,
                        "subject": q["subject"],
                        "mistakeCount": 1,
                        "question": q["question"],
                        "studentAnswer": f"{selected} (Option {selected})",
                        "correctAnswer": f"{q['correctAnswer']}",
                        "explanation": q["explanation"],
                        "lastAttempted": "Just now"
                    })

            details.append({
                "questionId": q_id,
                "question": q["question"],
                "studentAnswer": selected or "Skipped",
                "correctAnswer": q["correctAnswer"],
                "isCorrect": is_correct,
                "explanation": q["explanation"],
                "topic": topic_name
            })

        total = len(details) or 1
        accuracy = round((correct_count / total) * 100)

        # ------------------------------------------------------------------
        # AI/ML STEP 1: Bayesian Knowledge Tracing (BKT) Mastery Update
        # ------------------------------------------------------------------
        student_topics = db.get_student_topics(student_id)
        updated_mastery_results = {}
        for topic_name, responses in topic_answers_map.items():
            new_mastery = None
            if topic_name in student_topics:
                current_val = student_topics[topic_name]["mastery"]
                new_mastery = ai_ml_service.update_topic_mastery(current_val, responses)
                student_topics[topic_name]["mastery"] = new_mastery
                student_topics[topic_name]["accuracy"] = round(correct_count / total, 2)
                student_topics[topic_name]["days_since_practiced"] = 0
                updated_mastery_results[topic_name] = new_mastery
                db.save_topic_mastery(student_id, student_topics[topic_name])
            if topic_name in db.topics:
                if new_mastery is None:
                    new_mastery = ai_ml_service.update_topic_mastery(db.topics[topic_name]["mastery"], responses)
                    updated_mastery_results[topic_name] = new_mastery
                db.topics[topic_name]["mastery"] = new_mastery
                db.topics[topic_name]["accuracy"] = round(correct_count / total, 2)
                db.topics[topic_name]["days_since_practiced"] = 0
                if student_id == "std_001":
                    db.save_topic_mastery("std_001", db.topics[topic_name])

        # ------------------------------------------------------------------
        # AI/ML STEP 2: Learning Gap Classification
        # ------------------------------------------------------------------
        classified_gaps = ai_ml_service.classify_learning_gaps(list(student_topics.values()))

        # ------------------------------------------------------------------
        # AI/ML STEP 3: Adaptive Recommendation Re-ranking
        # ------------------------------------------------------------------
        student = db.students.get(student_id, db.students["std_001"])
        days_to_exam = student.get("days_remaining", 12)
        recommendations = ai_ml_service.rank_recommendations(list(student_topics.values()), days_to_exam=days_to_exam)
        top_recommendation = recommendations[0] if recommendations else None

        # ------------------------------------------------------------------
        # AI/ML STEP 4: Adaptive Study Plan Recalibration
        # ------------------------------------------------------------------
        try:
            daily_hours = float(student.get("daily_study_hours", "2 hours").split()[0])
        except Exception:
            daily_hours = 2.0
        adapted_plan = ai_ml_service.generate_adaptive_plan(list(student_topics.values()), daily_hours=daily_hours, days_count=7)
        db.set_student_plan(student_id, adapted_plan)
        student["plan_adapted"] = True
        student["plan_adapted_message"] = "Your study plan was dynamically adapted based on your latest quiz performance."
        db.save_student(student)

        # Update student profile stats
        student["xp"] = student.get("xp", 1240) + (correct_count * 5) + 15
        student["total_study_minutes"] = student.get("total_study_minutes", 755) + max(1, time_spent_seconds // 60)
        db.save_student(student)

        # Log activity
        quiz_topic = list(topic_answers_map.keys())[0] if topic_answers_map else "Comprehensive"
        db.activities.insert(0, {
            "id": f"act_{len(db.activities) + 1}",
            "student_id": student_id,
            "title": f"Quiz Completed: {quiz_topic}",
            "type": "quiz",
            "timestamp": "Just now",
            "detail": f"Scored {correct_count}/{total} ({accuracy}% accuracy). BKT updated topic mastery.",
            "badge": f"+{(correct_count * 5) + 15} XP"
        })

        # Save quiz attempt to persistent repository
        db.save_quiz_attempt({
            "id": f"att_{len(db.activities)}_{student_id}",
            "student_id": student_id,
            "topic": quiz_topic,
            "score": correct_count,
            "total_questions": total,
            "accuracy_percentage": accuracy,
            "time_spent_seconds": time_spent_seconds
        })

        mins = time_spent_seconds // 60
        secs = time_spent_seconds % 60

        return {
            "score": correct_count,
            "totalQuestions": total,
            "accuracyPercentage": accuracy,
            "correctAnswersCount": correct_count,
            "incorrectAnswersCount": total - correct_count,
            "timeSpent": f"{mins}m {secs}s",
            "questionDetails": details,
            "updatedMastery": updated_mastery_results,
            "topRecommendation": top_recommendation,
            "learningGaps": classified_gaps[:4],
            "message": "Performance analyzed. Mastery and study plan adapted."
        }

quiz_service = QuizService()
