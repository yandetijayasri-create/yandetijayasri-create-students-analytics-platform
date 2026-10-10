import pytest
import sys
import os

# Add ai-ml directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ai-ml")))

from algorithms.gap_classifier import LearningGapClassifier
from algorithms.mastery_engine import BayesianKnowledgeTracer
from algorithms.recommendation_ranker import RecommendationRanker
from algorithms.plan_optimizer import StudyPlanOptimizer

def test_gap_classifier_high_priority():
    classifier = LearningGapClassifier()
    topic = {
        "topic": "Graphs",
        "subject": "Data Structures",
        "accuracy": 0.42,
        "mistake_count": 4,
        "days_since_practiced": 2
    }
    result = classifier.classify_topic(topic)
    assert result["priority"] == "HIGH"
    assert result["category"] == "HIGH_PRIORITY"

def test_gap_classifier_strong():
    classifier = LearningGapClassifier()
    topic = {
        "topic": "Python Basics",
        "subject": "Programming",
        "accuracy": 0.90,
        "mistake_count": 0,
        "days_since_practiced": 1
    }
    result = classifier.classify_topic(topic)
    assert result["priority"] == "LOW"
    assert result["category"] == "STRONG"

def test_bkt_mastery_increase():
    tracer = BayesianKnowledgeTracer(p_init=0.30)
    # 3 consecutive correct answers should increase mastery probability
    updated = tracer.evaluate_quiz_sequence([True, True, True])
    assert updated > 0.50

def test_recommendation_ranker():
    ranker = RecommendationRanker()
    topics = [
        {"id": "1", "topic": "Python", "subject": "CS", "mastery": 90, "exam_weight": 1.0, "mistakes": 0},
        {"id": "2", "topic": "Graphs", "subject": "CS", "mastery": 42, "exam_weight": 2.0, "mistakes": 4},
    ]
    ranked = ranker.rank_recommendations(topics, days_to_exam=12)
    assert len(ranked) == 2
    assert ranked[0]["topic"] == "Graphs" # Weakest with highest weight must be ranked first
    assert ranked[0]["impactLevel"] == "High"

def test_study_plan_optimizer():
    optimizer = StudyPlanOptimizer()
    topics = [
        {"topic": "Graphs", "mastery": 40},
        {"topic": "DBMS", "mastery": 55},
        {"topic": "Python", "mastery": 90}
    ]
    schedule = optimizer.optimize_schedule(topics, daily_hours=2.0, days_count=7)
    assert len(schedule) == 7
    assert len(schedule[0]["tasks"]) >= 2
