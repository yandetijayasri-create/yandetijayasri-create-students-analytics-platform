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

def test_complete_end_to_end_hackathon_loop():
    """
    ELEVΛLTE End-to-End Core Hackathon Loop Test (Phase 29 & Phase 30):
    1. Register
    2. Login
    3. Onboarding Calibration
    4. Dashboard Inspection (Initial mastery: Graphs=38%, Trees=52%, Arrays=91%)
    5. Generate Graph Quiz (Zero Answer Leakage)
    6. Submit Quiz with Mistakes (Diagnostic evaluation)
    7. Bayesian Knowledge Tracing (BKT) Mastery Update
    8. Learning Gap Classification (HIGH_PRIORITY)
    9. Recommendation Ranker (Impact score prioritization)
    10. Adaptive Study Plan Recalibration
    11. Mistake Tracking & Repetition Counters
    12. Dashboard Reflects Dynamic AI Recommendation & Gap Status
    13. AI Study Buddy Consultation
    14. Adaptive Task Completion & XP Progression
    """

    # --------------------------------------------------------------------------
    # Step 1: Register New Student
    # --------------------------------------------------------------------------
    reg_email = "alex.e2e@university.edu"
    reg_res = client.post("/api/v1/auth/register", json={
        "name": "Alex Johnson",
        "email": reg_email,
        "password": "study_smart_2026"
    })
    assert reg_res.status_code == 200, f"Register failed: {reg_res.text}"
    reg_data = reg_res.json()
    token = reg_data["token"]
    user_id = reg_data["user_id"]
    headers = {"Authorization": f"Bearer {token}"}

    # --------------------------------------------------------------------------
    # Step 2: Login Verification
    # --------------------------------------------------------------------------
    login_res = client.post("/api/v1/auth/login", json={
        "email": reg_email,
        "password": "study_smart_2026"
    })
    assert login_res.status_code == 200
    assert login_res.json()["token"]

    # --------------------------------------------------------------------------
    # Step 3: Onboarding Calibration
    # --------------------------------------------------------------------------
    onboard_payload = {
        "name": "Alex Johnson",
        "course": "Bachelor of Technology",
        "branch": "Computer Science & Engineering",
        "year": "3rd Year",
        "semester": "5th Semester",
        "subjects": ["Data Structures & Algorithms", "DBMS", "Operating Systems"],
        "goal": "Prepare for Semester Exams",
        "available_study_time": "2 hours",
        "preferred_study_time": "Evening (6 PM - 10 PM)",
        "exam_date": "2026-10-21",
        "target_score": "9.2 CGPA / 90%"
    }
    onboard_res = client.post("/api/v1/profile/onboarding", json=onboard_payload, headers=headers)
    assert onboard_res.status_code == 200
    onboard_data = onboard_res.json()
    assert onboard_data["status"] == "success"
    assert "study_plan" in onboard_data

    # Set initial baseline mastery matching Phase 30 requirements:
    # Graphs = 38%, AVL Trees = 52%, Arrays = 91%
    db.topics["Graphs"] = {
        "id": "top_graphs",
        "subject": "Data Structures & Algorithms",
        "topic": "Graphs",
        "mastery": 38.0,
        "accuracy": 0.38,
        "exam_weight": 2.0,
        "mistakes": 3,
        "days_since_practiced": 1,
        "previous_accuracy": 0.40
    }
    db.topics["AVL Trees"] = {
        "id": "top_avl",
        "subject": "Data Structures & Algorithms",
        "topic": "AVL Trees",
        "mastery": 52.0,
        "accuracy": 0.52,
        "exam_weight": 1.5,
        "mistakes": 2,
        "days_since_practiced": 2,
        "previous_accuracy": 0.50
    }
    db.topics["Arrays"] = {
        "id": "top_arrays",
        "subject": "Data Structures & Algorithms",
        "topic": "Arrays",
        "mastery": 91.0,
        "accuracy": 0.91,
        "exam_weight": 1.0,
        "mistakes": 0,
        "days_since_practiced": 4,
        "previous_accuracy": 0.90
    }

    # --------------------------------------------------------------------------
    # Step 4: Initial Dashboard Verification
    # --------------------------------------------------------------------------
    dash_res = client.get("/api/v1/dashboard", headers=headers)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert dash_data["profile"]["name"] == "Alex Johnson"
    # Expected recommendation must prioritize Graphs (lowest mastery: 38%)
    assert dash_data["recommendation"]["topic"] == "Graphs"
    assert "Graph" in dash_data["recommendation"]["headline"]

    # --------------------------------------------------------------------------
    # Step 5: Generate Quiz on Graphs (Security Check)
    # --------------------------------------------------------------------------
    gen_res = client.post("/api/v1/quiz/generate", json={
        "subject": "Data Structures & Algorithms",
        "topic": "Graphs",
        "difficulty": "Medium",
        "count": 4
    }, headers=headers)
    assert gen_res.status_code == 200
    gen_data = gen_res.json()
    questions = gen_data["questions"]
    assert len(questions) >= 3

    # Security check: answers MUST NOT be leaked to client
    for q in questions:
        assert "correctAnswer" not in q or q["correctAnswer"] is None
        assert "explanation" not in q or q["explanation"] is None

    # --------------------------------------------------------------------------
    # Step 6: Submit Quiz with Poor Performance on Graphs (e.g. 1 / 4 correct)
    # Question 1: correct answer B, student answers B (Correct)
    # Question 2: correct answer B, student answers A (Incorrect)
    # Question 3: correct answer C, student answers A (Incorrect)
    # Question 4: correct answer A, student answers B (Incorrect)
    # --------------------------------------------------------------------------
    sub_res = client.post("/api/v1/quiz/submit", json={
        "answers": [
            {"questionId": 1, "selectedAnswer": "B"},
            {"questionId": 2, "selectedAnswer": "A"},
            {"questionId": 3, "selectedAnswer": "A"},
            {"questionId": 4, "selectedAnswer": "B"}
        ],
        "timeSpentSeconds": 140,
        "student_id": user_id
    }, headers=headers)

    assert sub_res.status_code == 200
    sub_data = sub_res.json()
    assert sub_data["score"] == 1
    assert sub_data["totalQuestions"] == 4
    assert sub_data["accuracyPercentage"] == 25
    assert sub_data["incorrectAnswersCount"] == 3

    # --------------------------------------------------------------------------
    # Step 7: Verify BKT Mastery Engine Updated Latent Topic Mastery
    # --------------------------------------------------------------------------
    assert "updatedMastery" in sub_data
    assert "Graphs" in sub_data["updatedMastery"]
    updated_graphs_mastery = sub_data["updatedMastery"]["Graphs"]
    # BKT adjusted the mastery probability from 38%
    assert isinstance(updated_graphs_mastery, float)

    # --------------------------------------------------------------------------
    # Step 8: Verify Learning Gap Classifier
    # --------------------------------------------------------------------------
    assert "learningGaps" in sub_data
    graph_gap = next((g for g in sub_data["learningGaps"] if g["topic"] == "Graphs"), None)
    assert graph_gap is not None
    assert graph_gap["priority"] == "HIGH"
    assert graph_gap["category"] == "HIGH_PRIORITY"

    # --------------------------------------------------------------------------
    # Step 9: Verify Recommendation Ranker Output
    # --------------------------------------------------------------------------
    assert "topRecommendation" in sub_data
    top_rec = sub_data["topRecommendation"]
    assert top_rec["topic"] == "Graphs"
    assert top_rec["priority"] == "HIGH"

    # --------------------------------------------------------------------------
    # Step 10: Verify Mistakes Tracker Logged Missed Questions
    # --------------------------------------------------------------------------
    mistakes_res = client.get("/api/v1/mistakes", headers=headers)
    assert mistakes_res.status_code == 200
    mistakes_list = mistakes_res.json()
    graph_mistake = next((m for m in mistakes_list if m["topic"] == "Graphs"), None)
    assert graph_mistake is not None
    assert graph_mistake["mistakeCount"] >= 1
    assert "explanation" in graph_mistake

    # --------------------------------------------------------------------------
    # Step 11: Verify Updated Dashboard Reflects State Changes
    # --------------------------------------------------------------------------
    updated_dash_res = client.get("/api/v1/dashboard", headers=headers)
    assert updated_dash_res.status_code == 200
    updated_dash = updated_dash_res.json()
    assert updated_dash["recommendation"]["topic"] == "Graphs"
    assert "Focus on Graphs today" in updated_dash["recommendation"]["headline"]
    
    # Verify learning gaps section on dashboard highlights Graphs as HIGH_PRIORITY
    dashboard_graph_gap = next((g for g in updated_dash["learningGaps"] if g["topic"] == "Graphs"), None)
    assert dashboard_graph_gap is not None
    assert dashboard_graph_gap["priority"] == "HIGH"
    assert dashboard_graph_gap["category"] == "HIGH_PRIORITY"

    # --------------------------------------------------------------------------
    # Step 12: Verify Adaptive Study Plan Optimizer
    # --------------------------------------------------------------------------
    plan_res = client.get("/api/v1/study-plan", headers=headers)
    assert plan_res.status_code == 200
    plan_data = plan_res.json()
    assert len(plan_data) == 7
    # Day 1 must prioritize the weakest topic (Graphs)
    first_day_tasks = plan_data[0]["tasks"]
    assert any(t["topic"] == "Graphs" for t in first_day_tasks)

    # --------------------------------------------------------------------------
    # Step 13: Consult AI Study Buddy
    # --------------------------------------------------------------------------
    ai_res = client.post("/api/v1/ai/ask", json={
        "message": "Explain BFS vs DFS in Graphs simply",
        "student_id": user_id,
        "topic": "Graphs"
    }, headers=headers)
    assert ai_res.status_code == 200
    ai_data = ai_res.json()
    assert ai_data["sender"] == "assistant"
    assert "Graph Traversal" in ai_data["content"]
    assert len(ai_data["steps"]) > 0

    # --------------------------------------------------------------------------
    # Step 14: Complete Study Task & Award XP
    # --------------------------------------------------------------------------
    complete_res = client.post("/api/v1/study-plan/task_1/complete", headers=headers)
    assert complete_res.status_code == 200
    comp_data = complete_res.json()
    assert comp_data["completed"] is True
    assert comp_data["xpGained"] > 0
