"""
ElevAlte AI-ML Engine: Adaptive Recommendation Ranker
Computes dynamic impact weights to decide: 'What should I study today?' and 'Why?'
Formula:
Score = (1 - Mastery) * ExamWeight * UrgencyMultiplier * DecayWeight
"""

import math
from typing import List, Dict, Any

class RecommendationRanker:
    def rank_recommendations(
        self,
        topics: List[Dict[str, Any]],
        days_to_exam: int = 12
    ) -> List[Dict[str, Any]]:
        # Urgency multiplier: exponential scale as exam nears
        urgency = 1.0 + (10.0 / max(1, days_to_exam))

        ranked = []
        for t in topics:
            mastery = t.get("mastery", 50) / 100.0
            exam_weight = t.get("exam_weight", 1.0)
            mistake_count = t.get("mistakes", 0)

            # High mistake penalty increases need to revisit
            mistake_boost = 1.0 + (mistake_count * 0.15)

            gap_magnitude = 1.0 - mastery
            impact_score = gap_magnitude * exam_weight * urgency * mistake_boost

            impact_level = "High" if impact_score > 3.0 else "Medium" if impact_score > 1.5 else "Low"

            reason = (
                f"Your recent quiz accuracy in this topic is {round(mastery * 100)}%. "
                f"Your exam is {days_to_exam} days away, so improving this topic could have a {impact_level.lower()} impact."
            )

            ranked.append({
                "id": f"rec_{t.get('id', 'topic')}",
                "headline": f"Focus on {t.get('topic')} today.",
                "topic": t.get("topic"),
                "subject": t.get("subject"),
                "priority": impact_level.upper(),
                "reason": reason,
                "accuracy": round(mastery * 100),
                "mastery": round(mastery, 2),
                "daysToExam": days_to_exam,
                "impactLevel": impact_level,
                "impactScore": round(impact_score, 2),
                "action": f"Practice {t.get('topic')}",
                "actionLabel": "Start Recommended Session",
                "recommended_action": f"Practice {t.get('topic')} for 30 minutes.",
                "actionUrl": f"/practice?topic={t.get('topic', '').lower()}",
            })

        # Sort descending by impact score
        return sorted(ranked, key=lambda x: x["impactScore"], reverse=True)
