"""
ElevAlte AI-ML Engine: Learning Gap Classifier
Analyzes student question response telemetry to detect misconceptions,
decay rates, and categorize topic gaps into actionable priority tiers.
"""

from typing import List, Dict, Any

class LearningGapClassifier:
    def __init__(self, high_priority_threshold: float = 0.50, medium_threshold: float = 0.75):
        self.high_priority_threshold = high_priority_threshold
        self.medium_threshold = medium_threshold

    def classify_topic(self, topic_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Classifies a topic based on accuracy, days since last practice, and mistake count.
        """
        accuracy = topic_data.get("accuracy", 0.0)
        days_since_practiced = topic_data.get("days_since_practiced", 0)
        mistake_count = topic_data.get("mistake_count", 0)

        # Decay adjustment: -2% accuracy per week of inactivity
        decay_factor = min(days_since_practiced * 0.003, 0.15)
        adjusted_accuracy = max(0.0, accuracy - decay_factor)

        # Priority & Category determination
        if adjusted_accuracy < self.high_priority_threshold or mistake_count >= 3:
            priority = "HIGH"
            category = "HIGH_PRIORITY"
            recommendation = (
                f"Urgent intervention required. Repeated errors ({mistake_count}) "
                f"detected in {topic_data.get('topic')}. Complete targeted practice sprints."
            )
        elif adjusted_accuracy < self.medium_threshold:
            priority = "MEDIUM"
            category = "NEEDS_PRACTICE"
            recommendation = (
                f"Moderate proficiency ({round(adjusted_accuracy * 100)}%). "
                f"Review conceptual foundations and solve 5-10 medium-difficulty problems."
            )
        else:
            priority = "LOW"
            category = "STRONG"
            recommendation = (
                f"High mastery achieved ({round(adjusted_accuracy * 100)}%). "
                f"Maintain retention with bi-weekly refresher questions."
            )

        # Trend detection
        previous_accuracy = topic_data.get("previous_accuracy", accuracy)
        if adjusted_accuracy > previous_accuracy + 0.05:
            trend = "improving"
        elif adjusted_accuracy < previous_accuracy - 0.05:
            trend = "declining"
        else:
            trend = "stable"

        return {
            "topic": topic_data.get("topic"),
            "subject": topic_data.get("subject"),
            "raw_accuracy": round(accuracy * 100, 1),
            "adjusted_accuracy": round(adjusted_accuracy * 100, 1),
            "priority": priority,
            "category": category,
            "trend": trend,
            "mistake_count": mistake_count,
            "recommendation": recommendation,
        }

    def batch_classify(self, topics: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        results = [self.classify_topic(t) for t in topics]
        # Sort by urgency: lowest adjusted accuracy first
        return sorted(results, key=lambda x: x["adjusted_accuracy"])
