import pytest
from starlette.testclient import TestClient
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.db.repository import db

client = TestClient(app)

def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"

def test_get_profile():
    res = client.get("/api/v1/profile")
    assert res.status_code == 200
    data = res.json()
    assert "name" in data
    assert data["level"] == 8

def test_get_dashboard():
    res = client.get("/api/v1/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert "profile" in data
    assert "todayTasks" in data
    assert "recommendation" in data
    assert len(data["todayTasks"]) > 0

def test_generate_quiz():
    res = client.post("/api/v1/quiz/generate", json={"subject": "Data Structures", "count": 3})
    assert res.status_code == 200
    data = res.json()
    questions = data.get("questions", data if isinstance(data, list) else [])
    assert len(questions) == 3
    assert "question" in questions[0]
    assert "options" in questions[0]
    # Verify answers are NOT leaked before submission
    assert "correctAnswer" not in questions[0] or questions[0]["correctAnswer"] is None

def test_submit_quiz():
    payload = {
        "answers": [
            {"questionId": 1, "selectedAnswer": "B"},
            {"questionId": 2, "selectedAnswer": "A"}
        ],
        "timeSpentSeconds": 90
    }
    res = client.post("/api/v1/quiz/submit", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["totalQuestions"] == 2
    assert "accuracyPercentage" in data
    assert len(data["questionDetails"]) == 2

def test_get_mistakes():
    res = client.get("/api/v1/mistakes")
    assert res.status_code == 200
    mistakes = res.json()
    assert isinstance(mistakes, list)
    assert len(mistakes) > 0

def test_ask_ai():
    res = client.post("/api/v1/ai/ask", json={"query": "Explain AVL tree rotations"})
    assert res.status_code == 200
    data = res.json()
    assert data["sender"] == "assistant"
    assert "AVL" in data["content"]

def test_auth_register_and_login():
    email = "new_scholar@test.edu"
    res = client.post("/api/v1/auth/register", json={
        "name": "Jordan Lee",
        "email": email,
        "password": "securepassword123"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["token"]
    assert data["email"] == email

    # Login with same credentials
    login_res = client.post("/api/v1/auth/login", json={
        "email": email,
        "password": "securepassword123"
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert login_data["token"]

def test_complete_study_task():
    res = client.post("/api/v1/study-plan/task_1/complete")
    assert res.status_code == 200
    data = res.json()
    assert data["completed"] is True
    assert data["xpGained"] > 0

def test_get_progress():
    res = client.get("/api/v1/progress")
    assert res.status_code == 200
    data = res.json()
    assert "overallMastery" in data
    assert "topicMastery" in data
    assert len(data["topicMastery"]) > 0

def test_get_recommendations():
    res = client.get("/api/v1/recommendations")
    assert res.status_code == 200
    recs = res.json()
    assert isinstance(recs, list)
    assert len(recs) > 0
    assert "topic" in recs[0]

def test_get_resources():
    res = client.get("/api/v1/resources?topic=Graphs")
    assert res.status_code == 200
    resources = res.json()
    assert isinstance(resources, list)
    assert len(resources) > 0
