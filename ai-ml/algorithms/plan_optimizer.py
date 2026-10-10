"""
ElevAlte AI-ML Engine: Study Plan Optimizer
Generates balanced daily schedules respecting available study hours,
syllabus module priorities, and spaced repetition curves.
"""

from typing import List, Dict, Any

class StudyPlanOptimizer:
    def optimize_schedule(
        self,
        topics: List[Dict[str, Any]],
        daily_hours: float = 2.0,
        days_count: int = 7
    ) -> List[Dict[str, Any]]:
        daily_minutes = int(daily_hours * 60)
        day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

        # Sort by urgency: lowest mastery first, high mistakes break ties
        sorted_topics = sorted(
            topics,
            key=lambda x: (x.get("mastery", 50), -x.get("mistakes", 0))
        )

        schedule = []
        weakest_topic = sorted_topics[0] if sorted_topics else None
        is_weak_intervention = weakest_topic and weakest_topic.get("mastery", 50) < 55

        for i in range(days_count):
            day_name = day_names[i % len(day_names)]
            current_day_tasks = []
            minutes_allocated = 0

            # Day 1: If intervention needed for weakest topic, frontload targeted subtasks
            if i == 0 and is_weak_intervention:
                top_name = weakest_topic.get("topic", "Data Structures")
                subj_name = weakest_topic.get("subject", "Computer Science")

                subtasks = [
                    (f"Learn — {top_name} Fundamentals & Invariants", "Learn", 30),
                    (f"Practice — {top_name} BFS & DFS Algorithms", "Practice", 25),
                    (f"Review — {top_name} Quiz Mistakes & Misconceptions", "Review", 20),
                ]
                for task_title, task_type, duration in subtasks:
                    if minutes_allocated + duration <= daily_minutes + 15:
                        current_day_tasks.append({
                            "id": f"task_d1_{len(current_day_tasks) + 1}",
                            "title": task_title,
                            "subject": subj_name,
                            "topic": top_name,
                            "type": task_type,
                            "durationMinutes": duration,
                            "completed": False,
                            "xpReward": 45 if task_type == "Learn" else 35
                        })
                        minutes_allocated += duration

                # Add next moderate priority topic if time permits
                for next_topic in sorted_topics[1:]:
                    if next_topic.get("mastery", 50) < 75 and minutes_allocated + 25 <= daily_minutes + 15:
                        nt_name = next_topic.get("topic", "Topic")
                        current_day_tasks.append({
                            "id": f"task_d1_{len(current_day_tasks) + 1}",
                            "title": f"Practice — {nt_name} Exercises",
                            "subject": next_topic.get("subject", "Computer Science"),
                            "topic": nt_name,
                            "type": "Practice",
                            "durationMinutes": 25,
                            "completed": False,
                            "xpReward": 35
                        })
                        minutes_allocated += 25
                        break
            else:
                # Regular balanced spaced repetition distribution
                offset = (i * 2) % max(1, len(sorted_topics))
                for idx in range(len(sorted_topics)):
                    topic = sorted_topics[(offset + idx) % len(sorted_topics)]
                    m = topic.get("mastery", 50)
                    t_name = topic.get("topic", "Topic")
                    s_name = topic.get("subject", "Computer Science")

                    if m < 50:
                        task_type = "Learn"
                        duration = 30
                        title = f"Learn — {t_name} Core Concepts"
                    elif m < 75:
                        task_type = "Practice"
                        duration = 25
                        title = f"Practice — {t_name} Problem Solving"
                    else:
                        task_type = "Review"
                        duration = 15  # Strong topics receive less revision
                        title = f"Review — {t_name} Spaced Retention"

                    if minutes_allocated + duration <= daily_minutes + 15:
                        current_day_tasks.append({
                            "id": f"task_d{i+1}_{len(current_day_tasks) + 1}",
                            "title": title,
                            "subject": s_name,
                            "topic": t_name,
                            "type": task_type,
                            "durationMinutes": duration,
                            "completed": False,
                            "xpReward": 30 if task_type == "Review" else 35
                        })
                        minutes_allocated += duration

                    if minutes_allocated >= daily_minutes - 10:
                        break

            schedule.append({
                "id": f"day_{i + 1}",
                "dayName": day_name,
                "dateStr": f"Day {i + 1}",
                "isToday": (i == 0),
                "tasks": current_day_tasks
            })

        return schedule
