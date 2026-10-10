"""
ElevAlte: Supabase PostgreSQL Database Connectivity & Persistence Verification Test
Tests live PostgreSQL connection, table schemas, seed integrity, and persistence guarantees.
"""

import os
import sys
import pytest
from pathlib import Path

# Add backend to sys.path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.db.postgres import SupabasePostgresClient, get_db_url
from app.db.repository import db


@pytest.fixture(scope="module")
def postgres_client():
    url = get_db_url()
    if not url:
        pytest.skip("DATABASE_URL or DIRECT_URL not configured. Skipping live database tests.")
    client = SupabasePostgresClient(connection_url=url)
    if not client.is_connected:
        pytest.fail("DATABASE_URL is configured but connection to Supabase PostgreSQL failed!")
    return client


def test_supabase_connection_alive(postgres_client):
    """Verifies that the Supabase PostgreSQL connection responds to queries."""
    res = postgres_client.test_connection()
    assert res["connected"] is True, f"Database connectivity test failed: {res.get('error')}"
    assert res["database"] is not None
    assert res["user"] is not None


def test_supabase_tables_exist(postgres_client):
    """Verifies that all 16 required tables exist in Supabase PostgreSQL."""
    expected_tables = [
        "users",
        "students",
        "subjects",
        "topics",
        "student_topic_mastery",
        "questions",
        "quiz_attempts",
        "quiz_attempt_answers",
        "mistakes",
        "learning_gaps",
        "recommendations",
        "study_plans",
        "study_tasks",
        "activities",
        "resources",
        "progress_history"
    ]
    for table in expected_tables:
        rows = postgres_client.execute_query(f"SELECT COUNT(*) as cnt FROM {table};")
        assert rows is not None, f"Query to table '{table}' failed"
        assert "cnt" in rows[0], f"Row count column missing for '{table}'"


def test_supabase_seed_data_integrity(postgres_client):
    """Verifies deterministic initial state: Demo Student, Graph mastery = 38%, AVL = 52%, Arrays = 91%."""
    # Check student
    students = postgres_client.execute_query("SELECT id, name, target_goal, days_remaining, daily_study_hours FROM students WHERE id = 'std_001';")
    assert len(students) > 0, "Demo Student ('std_001') missing in Supabase students table"
    std = students[0]
    assert std["days_remaining"] == 12
    assert "2 hours" in std["daily_study_hours"]

    # Check initial topic mastery: Graphs -> 38%, AVL Trees -> 52%, Arrays -> 91%
    mastery = postgres_client.execute_query("SELECT topic, mastery FROM student_topic_mastery WHERE student_id = 'std_001';")
    m_dict = {m["topic"]: float(m["mastery"]) for m in mastery}
    assert "Graphs" in m_dict and m_dict["Graphs"] == 38.0, f"Graphs mastery should be 38%, got {m_dict.get('Graphs')}"
    assert "AVL Trees" in m_dict and m_dict["AVL Trees"] == 52.0, f"AVL Trees mastery should be 52%, got {m_dict.get('AVL Trees')}"
    assert "Arrays" in m_dict and m_dict["Arrays"] == 91.0, f"Arrays mastery should be 91%, got {m_dict.get('Arrays')}"

    # Check diagnostic quiz questions (must have at least 4 Graph questions)
    q_rows = postgres_client.execute_query("SELECT COUNT(*) as cnt FROM questions WHERE topic = 'Graphs';")
    assert q_rows[0]["cnt"] >= 4, f"Must have at least 4 Graph questions, found {q_rows[0]['cnt']}"


def test_supabase_persistence_write_and_read(postgres_client):
    """Verifies that repository writes directly persist to Supabase PostgreSQL."""
    test_sid = "std_persist_test"
    # Clean up test artifact if exists
    postgres_client.execute_non_query("DELETE FROM student_topic_mastery WHERE student_id = %s;", (test_sid,))
    postgres_client.execute_non_query("DELETE FROM students WHERE id = %s;", (test_sid,))
    postgres_client.execute_non_query("DELETE FROM users WHERE id = %s;", (test_sid,))

    # Insert test user & student
    postgres_client.execute_non_query(
        "INSERT INTO users (id, email, password_hash, name, role) VALUES (%s, %s, %s, %s, %s);",
        (test_sid, "persist@test.edu", "hash123", "Persist Tester", "student")
    )
    postgres_client.execute_non_query(
        """INSERT INTO students (id, name, email, target_goal, exam_name, exam_date, days_remaining, target_score, daily_study_hours, preferred_time)
           VALUES (%s, %s, %s, %s, %s, CURRENT_DATE + INTERVAL '12 days', 12, '90%%', '2 hours', 'Evening');""",
        (test_sid, "Persist Tester", "persist@test.edu", "Semester Exam", "Semester Exam")
    )

    # Save topic mastery
    db.save_topic_mastery(test_sid, {
        "id": f"mst_graphs_{test_sid}",
        "topic": "Graphs",
        "subject": "Data Structures & Algorithms",
        "mastery": 38.0,
        "accuracy": 0.38,
        "exam_weight": 2.0,
        "mistakes": 3,
        "days_since_practiced": 1,
        "previous_accuracy": 0.40
    })

    # Read directly from Supabase
    rows = postgres_client.execute_query("SELECT mastery FROM student_topic_mastery WHERE student_id = %s AND topic = 'Graphs';", (test_sid,))
    assert len(rows) == 1, "Persisted mastery row not found in Supabase"
    assert float(rows[0]["mastery"]) == 38.0

    # Clean up test records
    postgres_client.execute_non_query("DELETE FROM student_topic_mastery WHERE student_id = %s;", (test_sid,))
    postgres_client.execute_non_query("DELETE FROM students WHERE id = %s;", (test_sid,))
    postgres_client.execute_non_query("DELETE FROM users WHERE id = %s;", (test_sid,))
