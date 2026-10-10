"""
ElevAlte Backend Service: AI/ML Orchestration Layer
Integrates Python algorithms from ai-ml/algorithms into backend workflows.
Frontend NEVER accesses AI/ML modules directly; only through this service!
"""

import sys
import os
from typing import List, Dict, Any

# Ensure ai-ml directory is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
AI_ML_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", "..", "ai-ml"))
if AI_ML_DIR not in sys.path:
    sys.path.insert(0, AI_ML_DIR)

from algorithms.gap_classifier import LearningGapClassifier
from algorithms.mastery_engine import BayesianKnowledgeTracer
from algorithms.recommendation_ranker import RecommendationRanker
from algorithms.plan_optimizer import StudyPlanOptimizer

class AIMLService:
    def __init__(self):
        self.gap_classifier = LearningGapClassifier()
        self.mastery_tracer = BayesianKnowledgeTracer(p_init=0.35, p_transit=0.15, p_guess=0.20, p_slip=0.10)
        self.recommendation_ranker = RecommendationRanker()
        self.plan_optimizer = StudyPlanOptimizer()

    def update_topic_mastery(self, current_mastery_pct: float, quiz_answers: List[bool]) -> float:
        """
        Runs Bayesian Knowledge Tracing across sequential quiz responses
        and returns updated mastery percentage (0 - 100).
        """
        current_prior = current_mastery_pct / 100.0
        updated_prob = self.mastery_tracer.evaluate_quiz_sequence(quiz_answers, starting_prior=current_prior)
        return round(updated_prob * 100.0, 1)

    def classify_learning_gaps(self, topics_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Classifies all student topics into HIGH_PRIORITY, NEEDS_PRACTICE, STRONG.
        """
        return self.gap_classifier.batch_classify(topics_list)

    def rank_recommendations(self, topics_list: List[Dict[str, Any]], days_to_exam: int = 12) -> List[Dict[str, Any]]:
        """
        Ranks topics by impact score: (1 - Mastery) * ExamWeight * Urgency * MistakePenalty.
        """
        return self.recommendation_ranker.rank_recommendations(topics_list, days_to_exam=days_to_exam)

    def generate_adaptive_plan(self, topics_list: List[Dict[str, Any]], daily_hours: float = 2.0, days_count: int = 7) -> List[Dict[str, Any]]:
        """
        Generates daily study plan with tasks allocated by topic weakness and spaced repetition.
        """
        return self.plan_optimizer.optimize_schedule(topics_list, daily_hours=daily_hours, days_count=days_count)

ai_ml_service = AIMLService()
