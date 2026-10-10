import pytest
from starlette.testclient import TestClient
import sys
import os

# Add backend and ai-ml directories to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ai-ml")))

from app.main import app
from app.db.repository import db

client = TestClient(app)

class TestCompletePhaseRequirements:
    student_token = None
    student_id = None

    def test_01_register(self):
        email = f"student_phase@university.edu"
        res = client.post("/api/v1/auth/register", json={
            "name": "Phase Tester",
            "email": email,
            "password": "strong_password_2026"
        })
        assert res.status_code == 200
        data = res.json()
        assert "token" in data
        assert "user_id" in data
        TestCompletePhaseRequirements.student_token = data["token"]
        TestCompletePhaseRequirements.student_id = data["user_id"]

    def test_02_login(self):
        res = client.post("/api/v1/auth/login", json={
            "email": "student_phase@university.edu",
            "password": "strong_password_2026"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["token"]
        assert data["email"] == "student_phase@university.edu"

    def test_03_onboarding(self):
        headers = {"Authorization": f"Bearer {TestCompletePhaseRequirements.student_token}"}
        res = client.post("/api/v1/profile/onboarding", json={
            "name": "Phase Tester",
            "course": "B.Tech Computer Science",
            "branch": "CSE",
            "year": "3rd Year",
            "semester": "5th Semester",
            "subjects": ["Data Structures", "DBMS", "Operating Systems"],
            "goal": "Score 9.0+ CGPA in Final Exams",
            "available_study_time": "2 hours",
            "preferred_study_time": "Evening",
            "exam_date": "2026-10-25",
            "target_score": "90%"
        }, headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "success"
        assert "student" in data
        assert "study_plan" in data

    def test_04_dashboard(self):
        headers = {"Authorization": f"Bearer {TestCompletePhaseRequirements.student_token}"}
        res = client.get("/api/v1/dashboard", headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert data["profile"]["name"] == "Phase Tester"
        assert "recommendation" in data
        assert "todayTasks" in data
        assert "learningGaps" in data
        assert "stats" in data

    def test_05_generate_study_plan(self):
        headers = {"Authorization": f"Bearer {TestCompletePhaseRequirements.student_token}"}
        res = client.post("/api/v1/study-plan/generate", json={
            "hoursPerDay": 2.5,
            "reason": "Recalibrated post quiz analysis",
            "examDate": "2026-10-25"
        }, headers=headers)
        assert res.status_code == 200
        plan = res.json()
        assert isinstance(plan, list)
        assert len(plan) == 7
        assert len(plan[0]["tasks"]) >= 2

    def test_06_generate_quiz(self):
        headers = {"Authorization": f"Bearer {TestCompletePhaseRequirements.student_token}"}
        res = client.post("/api/v1/quiz/generate", json={
            "subject": "Data Structures",
            "topic": "Graphs",
            "difficulty": "Medium",
            "number_of_questions": 4
        }, headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert len(data["questions"]) >= 3
        # Strict zero answer leakage verification
        for q in data["questions"]:
            assert q.get("correctAnswer") is None

    def test_07_submit_quiz(self):
        headers = {"Authorization": f"Bearer {TestCompletePhaseRequirements.student_token}"}
        res = client.post("/api/v1/quiz/submit", json={
            "answers": [
                {"questionId": 1, "selectedAnswer": "B"}, # Correct
                {"questionId": 2, "selectedAnswer": "A"}, # Incorrect
                {"questionId": 3, "selectedAnswer": "A"}  # Incorrect
            ],
            "timeSpentSeconds": 110,
            "student_id": TestCompletePhaseRequirements.student_id
        }, headers=headers)
        assert res.status_code == 200
        data = res.json()
        assert data["score"] == 1
        assert data["totalQuestions"] == 3
        assert data["accuracyPercentage"] == 33
        assert data["incorrectAnswersCount"] == 2

    def test_08_update_mastery(self):
        # Verify Bayesian Knowledge Tracing updated topic mastery in topics
        assert "Graphs" in db.topics
        graphs_topic = db.topics["Graphs"]
        assert graphs_topic["mastery"] > 0
        assert graphs_topic["days_since_practiced"] == 0

    def test_09_detect_learning_gap(self):
        headers = {"Authorization": f"Bearer {TestCompletePhaseRequirements.student_token}"}
        dash_res = client.get("/api/v1/dashboard", headers=headers)
        assert dash_res.status_code == 200
        data = dash_res.json()
        gaps = data["learningGaps"]
        assert any(g["priority"] in ["HIGH", "MEDIUM"] for g in gaps)

    def test_10_generate_recommendation(self):
        headers = {"Authorization": f"Bearer {TestCompletePhaseRequirements.student_token}"}
        recs_res = client.get("/api/v1/recommendations", headers=headers)
        assert recs_res.status_code == 200
        recs = recs_res.json()
        assert len(recs) > 0
        top = recs[0]
        assert "topic" in top
        assert "priority" in top or "impactLevel" in top

    def test_11_update_study_plan(self):
        headers = {"Authorization": f"Bearer {TestCompletePhaseRequirements.student_token}"}
        plan_res = client.get("/api/v1/study-plan", headers=headers)
        assert plan_res.status_code == 200
        plan = plan_res.json()
        assert len(plan) == 7

    def test_12_retrieve_progress(self):
        headers = {"Authorization": f"Bearer {TestCompletePhaseRequirements.student_token}"}
        prog_res = client.get("/api/v1/progress", headers=headers)
        assert prog_res.status_code == 200
        prog = prog_res.json()
        assert "overallMastery" in prog
        assert "weeklyStudyTime" in prog
        assert "subjectPerformance" in prog
        assert "topicMastery" in prog
        assert "performanceTrend" in prog

    def test_13_retrieve_mistakes(self):
        headers = {"Authorization": f"Bearer {TestCompletePhaseRequirements.student_token}"}
        mst_res = client.get("/api/v1/mistakes", headers=headers)
        assert mst_res.status_code == 200
        mistakes = mst_res.json()
        assert isinstance(mistakes, list)
        assert len(mistakes) > 0
        assert any(m["topic"] == "Graphs" for m in mistakes)

    def test_14_ai_request(self):
        headers = {"Authorization": f"Bearer {TestCompletePhaseRequirements.student_token}"}
        ai_res = client.post("/api/v1/ai/ask", json={
            "message": "Explain Dijkstra algorithm vs BFS for shortest paths",
            "topic": "Graphs",
            "student_id": TestCompletePhaseRequirements.student_id
        }, headers=headers)
        assert ai_res.status_code == 200
        ai_data = ai_res.json()
        assert ai_data["sender"] == "assistant"
        assert len(ai_data["content"]) > 0
        assert len(ai_data["quickActions"]) > 0
