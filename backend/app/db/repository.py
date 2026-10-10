"""
ElevAlte Backend: Data Repository Layer
Provides in-memory & Supabase PostgreSQL data access layer matching schema.sql.
In development / test mode without DATABASE_URL, runs zero-dependency in-memory repository with seed data.
When DATABASE_URL or DIRECT_URL is configured, connects to Supabase PostgreSQL and persists all student state.
"""

from datetime import datetime, date, timedelta
import hashlib
import uuid
import json
import logging
from typing import Dict, List, Optional, Any
from .postgres import pg_client

logger = logging.getLogger("elevalte.repository")


# Simple secure password hashing without external dependencies
def hash_password(password: str, salt: str = "elevalte_salt_2026") -> str:
    return hashlib.sha256(f"{salt}{password}".encode()).hexdigest()


class AutoPersistDict(dict):
    """Dictionary that triggers a persistence callback whenever a key is set."""
    def __init__(self, initial=None, on_set=None):
        super().__init__(initial or {})
        self.on_set = on_set

    def __setitem__(self, key, value):
        super().__setitem__(key, value)
        if self.on_set:
            try:
                self.on_set(value)
            except Exception as e:
                logger.warning(f"Error in AutoPersistDict callback: {e}")


class AutoPersistList(list):
    """List that triggers a persistence callback whenever an item is added."""
    def __init__(self, initial=None, on_add=None):
        super().__init__(initial or [])
        self.on_add = on_add

    def append(self, item):
        super().append(item)
        if self.on_add:
            try:
                self.on_add(item)
            except Exception as e:
                logger.warning(f"Error in AutoPersistList append callback: {e}")

    def insert(self, index, item):
        super().insert(index, item)
        if self.on_add:
            try:
                self.on_add(item)
            except Exception as e:
                logger.warning(f"Error in AutoPersistList insert callback: {e}")


class InMemoryDatabase:
    def __init__(self):
        self.reset()
        # If Supabase PostgreSQL is connected, synchronize with persistent database
        if pg_client.is_connected:
            self.sync_from_postgres()

    def reset(self):
        # Users & Auth
        self.users = AutoPersistDict(
            {
                "std_001": {
                    "id": "std_001",
                    "email": "alex.johnson@university.edu",
                    "password_hash": hash_password("password123"),
                    "name": "Alex Johnson",
                    "role": "student",
                    "created_at": datetime.now().isoformat()
                }
            },
            on_set=self.save_user
        )

        # Student Profiles
        self.students = AutoPersistDict(
            {
                "std_001": {
                    "id": "std_001",
                    "name": "Alex Johnson",
                    "email": "alex.johnson@university.edu",
                    "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
                    "course": "Bachelor of Technology",
                    "branch": "Computer Science & Engineering",
                    "year": "3rd Year",
                    "semester": "5th Semester",
                    "target_goal": "Prepare for Semester Exams",
                    "exam_name": "Fall Semester Final Exams",
                    "exam_date": (date.today() + timedelta(days=12)).isoformat(),
                    "days_remaining": 12,
                    "target_score": "9.2 CGPA / 90%",
                    "daily_study_hours": "2 hours",
                    "preferred_time": "Evening (6 PM - 10 PM)",
                    "streak_days": 7,
                    "total_study_minutes": 755,
                    "xp": 1240,
                    "level": 8,
                    "level_title": "Consistent Learner",
                    "plan_adapted": False,
                    "plan_adapted_message": None,
                    "updated_at": datetime.now().isoformat()
                }
            },
            on_set=self.save_student
        )

        # Topics & Current Mastery
        self.topics: Dict[str, Dict[str, Any]] = {
            "Graphs": {
                "id": "top_graphs",
                "subject": "Data Structures & Algorithms",
                "topic": "Graphs",
                "mastery": 38.0, # Initial 38%
                "accuracy": 0.42,
                "exam_weight": 2.0,
                "mistakes": 4,
                "days_since_practiced": 1,
                "previous_accuracy": 0.45
            },
            "AVL Trees": {
                "id": "top_avl",
                "subject": "Data Structures & Algorithms",
                "topic": "AVL Trees",
                "mastery": 52.0,
                "accuracy": 0.54,
                "exam_weight": 1.5,
                "mistakes": 3,
                "days_since_practiced": 2,
                "previous_accuracy": 0.50
            },
            "DBMS": {
                "id": "top_dbms",
                "subject": "Database Management Systems",
                "topic": "DBMS",
                "mastery": 58.0,
                "accuracy": 0.58,
                "exam_weight": 1.5,
                "mistakes": 2,
                "days_since_practiced": 2,
                "previous_accuracy": 0.55
            },
            "Operating Systems": {
                "id": "top_os",
                "subject": "Operating Systems",
                "topic": "Operating Systems",
                "mastery": 45.0,
                "accuracy": 0.45,
                "exam_weight": 1.5,
                "mistakes": 2,
                "days_since_practiced": 1,
                "previous_accuracy": 0.48
            },
            "Mathematics": {
                "id": "top_math",
                "subject": "Discrete Mathematics",
                "topic": "Mathematics",
                "mastery": 64.0,
                "accuracy": 0.64,
                "exam_weight": 1.0,
                "mistakes": 1,
                "days_since_practiced": 3,
                "previous_accuracy": 0.60
            },
            "Python": {
                "id": "top_python",
                "subject": "Programming",
                "topic": "Python",
                "mastery": 88.0,
                "accuracy": 0.88,
                "exam_weight": 1.0,
                "mistakes": 0,
                "days_since_practiced": 4,
                "previous_accuracy": 0.85
            },
            "Arrays": {
                "id": "top_arrays",
                "subject": "Data Structures & Algorithms",
                "topic": "Arrays",
                "mastery": 91.0,
                "accuracy": 0.91,
                "exam_weight": 1.0,
                "mistakes": 0,
                "days_since_practiced": 5,
                "previous_accuracy": 0.90
            }
        }

        # Questions Bank
        self.questions: List[Dict[str, Any]] = [
            {
                "id": 1,
                "subject": "Data Structures & Algorithms",
                "topic": "Graphs",
                "difficulty": "Medium",
                "question": "Which data structure is primarily utilized to implement Breadth-First Search (BFS) on an unweighted graph?",
                "options": [
                    {"id": "A", "text": "Stack"},
                    {"id": "B", "text": "Queue"},
                    {"id": "C", "text": "Binary Heap"},
                    {"id": "D", "text": "Hash Table"}
                ],
                "correctAnswer": "B",
                "explanation": "BFS explores vertices level-by-level in FIFO order using a Queue."
            },
            {
                "id": 2,
                "subject": "Data Structures & Algorithms",
                "topic": "Graphs",
                "difficulty": "Medium",
                "question": "What is the time complexity of Breadth-First Search using an Adjacency List for V vertices and E edges?",
                "options": [
                    {"id": "A", "text": "O(V^2)"},
                    {"id": "B", "text": "O(V + E)"},
                    {"id": "C", "text": "O(E * log V)"},
                    {"id": "D", "text": "O(V * E)"}
                ],
                "correctAnswer": "B",
                "explanation": "Each vertex is queued once and every outgoing edge inspected once or twice, yielding O(V + E)."
            },
            {
                "id": 3,
                "subject": "Data Structures & Algorithms",
                "topic": "Graphs",
                "difficulty": "Hard",
                "question": "Can standard Dijkstra's algorithm guarantee the correct shortest path on graphs containing negative edge weights?",
                "options": [
                    {"id": "A", "text": "Yes, always"},
                    {"id": "B", "text": "Yes, if no negative cycles exist"},
                    {"id": "C", "text": "No, greedy choice breaks with negative edge weights"},
                    {"id": "D", "text": "Yes, if transformed to positive values"}
                ],
                "correctAnswer": "C",
                "explanation": "Dijkstra locks in distance greedily once a node is visited. Negative edges invalidate this invariant."
            },
            {
                "id": 4,
                "subject": "Data Structures & Algorithms",
                "topic": "Graphs",
                "difficulty": "Medium",
                "question": "Which algorithm is most suitable to detect a cycle in a directed graph using topological sort?",
                "options": [
                    {"id": "A", "text": "Kahn's Algorithm (in-degree BFS)"},
                    {"id": "B", "text": "Prim's Algorithm"},
                    {"id": "C", "text": "Kruskal's Algorithm"},
                    {"id": "D", "text": "Floyd-Warshall"}
                ],
                "correctAnswer": "A",
                "explanation": "Kahn's algorithm tracks in-degrees; if the processed count is less than V, a cycle exists."
            },
            {
                "id": 5,
                "subject": "Data Structures & Algorithms",
                "topic": "AVL Trees",
                "difficulty": "Hard",
                "question": "In an AVL tree, what rotation is required when a node is inserted into the left subtree of the right child?",
                "options": [
                    {"id": "A", "text": "Single Right Rotation (LL)"},
                    {"id": "B", "text": "Single Left Rotation (RR)"},
                    {"id": "C", "text": "Right-Left Rotation (RL)"},
                    {"id": "D", "text": "Left-Right Rotation (LR)"}
                ],
                "correctAnswer": "C",
                "explanation": "Zig-zag imbalance (Right then Left) requires a double Right-Left (RL) rotation."
            },
            {
                "id": 6,
                "subject": "Database Management Systems",
                "topic": "DBMS",
                "difficulty": "Medium",
                "question": "Which SQL clause is used to filter aggregated group records produced by a GROUP BY statement?",
                "options": [
                    {"id": "A", "text": "WHERE"},
                    {"id": "B", "text": "HAVING"},
                    {"id": "C", "text": "FILTER"},
                    {"id": "D", "text": "LIMIT"}
                ],
                "correctAnswer": "B",
                "explanation": "HAVING filters groups post-aggregation; WHERE filters individual rows prior to grouping."
            },
            {
                "id": 7,
                "subject": "Operating Systems",
                "topic": "Operating Systems",
                "difficulty": "Medium",
                "question": "Which condition is NOT one of Coffman's four necessary conditions for deadlock?",
                "options": [
                    {"id": "A", "text": "Mutual Exclusion"},
                    {"id": "B", "text": "Hold and Wait"},
                    {"id": "C", "text": "Preemption Allowed"},
                    {"id": "D", "text": "Circular Wait"}
                ],
                "correctAnswer": "C",
                "explanation": "The condition is No Preemption. Allowing preemption prevents deadlocks."
            }
        ]

        # Active Tasks for today
        self.today_tasks: List[Dict[str, Any]] = [
            {
                "id": "task_1",
                "subject": "Data Structures & Algorithms",
                "topic": "Graph Traversal (BFS & DFS)",
                "title": "Learn — Graph Traversal",
                "type": "Learn",
                "durationMinutes": 30,
                "completed": False,
                "xpReward": 50
            },
            {
                "id": "task_2",
                "subject": "Data Structures & Algorithms",
                "topic": "Breadth-First & Depth-First Search",
                "title": "Practice — BFS & DFS",
                "type": "Practice",
                "durationMinutes": 25,
                "completed": False,
                "xpReward": 40
            },
            {
                "id": "task_3",
                "subject": "Data Structures & Algorithms",
                "topic": "AVL Tree Rotations",
                "title": "Review — Previous Mistakes",
                "type": "Review",
                "durationMinutes": 20,
                "completed": True,
                "xpReward": 30
            },
            {
                "id": "task_4",
                "subject": "Database Management Systems",
                "topic": "SQL Joins",
                "title": "Practice — SQL Joins",
                "type": "Practice",
                "durationMinutes": 20,
                "completed": True,
                "xpReward": 35
            },
            {
                "id": "task_5",
                "subject": "Operating Systems",
                "topic": "Memory Paging",
                "title": "Learn — Page Replacement",
                "type": "Learn",
                "durationMinutes": 30,
                "completed": True,
                "xpReward": 45
            }
        ]

        # Mistakes Log
        self.mistakes = AutoPersistList(
            [
                {
                    "id": "mst_1",
                    "student_id": "std_001",
                    "topic": "Graph Traversal",
                    "subject": "Data Structures & Algorithms",
                    "mistakeCount": 4,
                    "question": "Which data structure is used to implement Breadth-First Search (BFS)?",
                    "studentAnswer": "A: Stack (Selected 4 times)",
                    "correctAnswer": "B: Queue",
                    "explanation": "BFS explores vertices in level-order FIFO sequence requiring a Queue.",
                    "lastAttempted": "Oct 08, 2026"
                },
                {
                    "id": "mst_2",
                    "student_id": "std_001",
                    "topic": "AVL Rotation",
                    "subject": "Data Structures & Algorithms",
                    "mistakeCount": 3,
                    "question": "Identify the required rotation when inserting into the left subtree of the right child of an unbalanced node.",
                    "studentAnswer": "B: Single Left Rotation (RR)",
                    "correctAnswer": "C: Right-Left Rotation (RL)",
                    "explanation": "Because the imbalance zig-zags (Right then Left), an RL double rotation is required.",
                    "lastAttempted": "Oct 07, 2026"
                },
                {
                    "id": "mst_3",
                    "student_id": "std_001",
                    "topic": "SQL Joins",
                    "subject": "Database Management Systems",
                    "mistakeCount": 2,
                    "question": "Which JOIN returns all rows from the left table even if there are no matching rows in the right table?",
                    "studentAnswer": "A: INNER JOIN",
                    "correctAnswer": "B: LEFT OUTER JOIN",
                    "explanation": "LEFT OUTER JOIN keeps all rows from the primary left table, populating NULL for missing right matches.",
                    "lastAttempted": "Oct 06, 2026"
                }
            ],
            on_add=self.save_mistake
        )

        # Activity Log
        self.activities = AutoPersistList(
            [
                {
                    "id": "act_1",
                    "student_id": "std_001",
                    "title": "Quiz Completed: Graph Algorithms",
                    "type": "quiz",
                    "timestamp": "2 hours ago",
                    "detail": "Scored 7/10 (70% accuracy) — 3 mistakes recorded for targeted review.",
                    "badge": "+35 XP"
                },
                {
                    "id": "act_2",
                    "student_id": "std_001",
                    "title": "Smart Notes Generated: Shortest Paths",
                    "type": "notes",
                    "timestamp": "4 hours ago",
                    "detail": "Dijkstra & Bellman-Ford summarized into 4 key formula cards.",
                    "badge": "+15 XP"
                },
                {
                    "id": "act_3",
                    "student_id": "std_001",
                    "title": "Deep Study Session Completed",
                    "type": "session",
                    "timestamp": "Yesterday",
                    "detail": "Completed 45 minutes of AVL Tree self-balancing exercises.",
                    "badge": "🔥 Day 7 Streak"
                }
            ],
            on_add=self.save_activity
        )

        # Resources Store
        self.resources: List[Dict[str, Any]] = [
            {
                "id": "res_1",
                "title": "Graph Traversal — Beginner to Advanced Guide",
                "subject": "Data Structures & Algorithms",
                "topic": "Graphs",
                "type": "Notes",
                "duration": "18 min read",
                "isAIRecommended": True,
                "recommendationReason": "Recommended because Graphs is currently one of your weakest topics (38% mastery).",
                "url": "#",
                "readCount": 1420
            },
            {
                "id": "res_2",
                "title": "AVL Trees Balancing & Rotations Step-by-Step",
                "subject": "Data Structures & Algorithms",
                "topic": "AVL Trees",
                "type": "PDF",
                "duration": "12 pages",
                "isAIRecommended": True,
                "recommendationReason": "High mistake frequency in LL, RR, LR and RL rotation exam questions.",
                "url": "#",
                "readCount": 980
            },
            {
                "id": "res_3",
                "title": "BFS vs DFS Visualized: When to Use Which",
                "subject": "Data Structures & Algorithms",
                "topic": "Graphs",
                "type": "Video",
                "duration": "14 min watch",
                "isAIRecommended": True,
                "recommendationReason": "Recommended to clarify queue vs stack mechanics before today's quiz.",
                "url": "#",
                "readCount": 2310
            },
            {
                "id": "res_4",
                "title": "Mastering SQL Joins & Aggregate Grouping",
                "subject": "Database Management Systems",
                "topic": "DBMS",
                "type": "Notes",
                "duration": "15 min read",
                "isAIRecommended": False,
                "url": "#",
                "readCount": 890
            }
        ]

        # Student-partitioned storage mapping
        self.student_topics: Dict[str, Dict[str, Dict[str, Any]]] = {
            "std_001": self.topics
        }
        self.student_tasks: Dict[str, List[Dict[str, Any]]] = {
            "std_001": self.today_tasks
        }
        self.student_plans: Dict[str, List[Dict[str, Any]]] = {}

    # --------------------------------------------------------------------------
    # Supabase PostgreSQL Synchronization Methods
    # --------------------------------------------------------------------------
    def sync_from_postgres(self):
        """Loads persistent data from Supabase PostgreSQL tables into active state."""
        if not pg_client.is_connected:
            return

        try:
            logger.info("Synchronizing data state from Supabase PostgreSQL...")

            # 1. Load users
            db_users = pg_client.execute_query("SELECT id, email, password_hash, name, role, created_at FROM users;")
            for u in db_users:
                self.users[u["id"]] = dict(u)

            # 2. Load students
            db_students = pg_client.execute_query("SELECT * FROM students;")
            for s in db_students:
                sid = s["id"]
                s_dict = dict(s)
                if isinstance(s_dict.get("exam_date"), (date, datetime)):
                    s_dict["exam_date"] = s_dict["exam_date"].isoformat()
                self.students[sid] = s_dict

            # 3. Load student topic mastery
            db_mastery = pg_client.execute_query("SELECT * FROM student_topic_mastery;")
            for m in db_mastery:
                sid = m["student_id"]
                tname = m["topic"]
                if sid not in self.student_topics:
                    self.student_topics[sid] = {}
                self.student_topics[sid][tname] = {
                    "id": m["id"],
                    "subject": m["subject"],
                    "topic": tname,
                    "mastery": float(m["mastery"]),
                    "accuracy": float(m["accuracy"]),
                    "exam_weight": float(m["exam_weight"]),
                    "mistakes": int(m["mistakes"]),
                    "days_since_practiced": int(m["days_since_practiced"]),
                    "previous_accuracy": float(m["previous_accuracy"])
                }
                if sid == "std_001":
                    self.topics[tname] = self.student_topics[sid][tname]

            # 4. Load questions
            db_questions = pg_client.execute_query("SELECT id, subject, topic, difficulty, question, options, correct_answer, explanation FROM questions ORDER BY id;")
            if db_questions:
                loaded_q = []
                for q in db_questions:
                    opts = q["options"]
                    if isinstance(opts, str):
                        try:
                            opts = json.loads(opts)
                        except Exception:
                            opts = []
                    loaded_q.append({
                        "id": q["id"],
                        "subject": q["subject"],
                        "topic": q["topic"],
                        "difficulty": q["difficulty"],
                        "question": q["question"],
                        "options": opts,
                        "correctAnswer": q["correct_answer"],
                        "explanation": q["explanation"]
                    })
                self.questions = loaded_q

            # 5. Load mistakes
            db_mistakes = pg_client.execute_query("SELECT * FROM mistakes;")
            if db_mistakes:
                loaded_m = []
                for m in db_mistakes:
                    loaded_m.append({
                        "id": m["id"],
                        "student_id": m["student_id"],
                        "topic": m["topic"],
                        "subject": m["subject"],
                        "mistakeCount": m["mistake_count"],
                        "question": m["question"],
                        "studentAnswer": m["student_answer"],
                        "correctAnswer": m["correct_answer"],
                        "explanation": m["explanation"],
                        "lastAttempted": m.get("last_attempted", "Just now")
                    })
                self.mistakes = AutoPersistList(loaded_m, on_add=self.save_mistake)

            # 6. Load study plans
            db_plans = pg_client.execute_query("SELECT student_id, plan_data FROM study_plans WHERE is_active = TRUE;")
            for p in db_plans:
                sid = p["student_id"]
                pdata = p["plan_data"]
                if isinstance(pdata, str):
                    try:
                        pdata = json.loads(pdata)
                    except Exception:
                        pdata = None
                if pdata:
                    self.student_plans[sid] = pdata

            logger.info("Supabase PostgreSQL data synchronization complete.")
        except Exception as e:
            logger.error(f"Error syncing from PostgreSQL: {e}")

    # --------------------------------------------------------------------------
    # Persistence Write Methods
    # --------------------------------------------------------------------------
    def save_user(self, user: Dict[str, Any]):
        if pg_client.is_connected:
            pg_client.execute_non_query(
                """INSERT INTO users (id, email, password_hash, name, role, created_at)
                   VALUES (%s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
                   ON CONFLICT (id) DO UPDATE SET
                       email = EXCLUDED.email,
                       password_hash = EXCLUDED.password_hash,
                       name = EXCLUDED.name;""",
                (user["id"], user["email"], user["password_hash"], user["name"], user.get("role", "student"))
            )

    def save_student(self, student: Dict[str, Any]):
        if pg_client.is_connected:
            exam_d = student.get("exam_date")
            if isinstance(exam_d, (datetime, date)):
                exam_d = exam_d.isoformat()
            pg_client.execute_non_query(
                """INSERT INTO students (
                       id, name, email, avatar_url, course, branch, year, semester,
                       target_goal, exam_name, exam_date, days_remaining, target_score,
                       daily_study_hours, preferred_time, streak_days, total_study_minutes,
                       xp, level, level_title, plan_adapted, plan_adapted_message, updated_at
                   ) VALUES (
                       %s, %s, %s, %s, %s, %s, %s, %s,
                       %s, %s, %s, %s, %s,
                       %s, %s, %s, %s,
                       %s, %s, %s, %s, %s, CURRENT_TIMESTAMP
                   ) ON CONFLICT (id) DO UPDATE SET
                       name = EXCLUDED.name,
                       email = EXCLUDED.email,
                       course = EXCLUDED.course,
                       branch = EXCLUDED.branch,
                       year = EXCLUDED.year,
                       semester = EXCLUDED.semester,
                       target_goal = EXCLUDED.target_goal,
                       exam_name = EXCLUDED.exam_name,
                       exam_date = EXCLUDED.exam_date,
                       days_remaining = EXCLUDED.days_remaining,
                       target_score = EXCLUDED.target_score,
                       daily_study_hours = EXCLUDED.daily_study_hours,
                       preferred_time = EXCLUDED.preferred_time,
                       streak_days = EXCLUDED.streak_days,
                       total_study_minutes = EXCLUDED.total_study_minutes,
                       xp = EXCLUDED.xp,
                       level = EXCLUDED.level,
                       level_title = EXCLUDED.level_title,
                       plan_adapted = EXCLUDED.plan_adapted,
                       plan_adapted_message = EXCLUDED.plan_adapted_message,
                       updated_at = CURRENT_TIMESTAMP;""",
                (
                    student["id"], student["name"], student["email"], student.get("avatar_url"),
                    student.get("course", "Bachelor of Technology"), student.get("branch", "Computer Science & Engineering"),
                    student.get("year", "3rd Year"), student.get("semester", "5th Semester"),
                    student.get("target_goal", "Prepare for Semester Exams"), student.get("exam_name", "Final Exams"),
                    exam_d or "2026-10-21", student.get("days_remaining", 12), student.get("target_score", "90%"),
                    student.get("daily_study_hours", "2 hours"), student.get("preferred_time", "Evening"),
                    student.get("streak_days", 7), student.get("total_study_minutes", 755),
                    student.get("xp", 1240), student.get("level", 8), student.get("level_title", "Consistent Learner"),
                    student.get("plan_adapted", False), student.get("plan_adapted_message")
                )
            )

    def save_topic_mastery(self, student_id: str, topic_dict: Dict[str, Any]):
        tname = topic_dict["topic"]
        sid = student_id or "std_001"
        if sid in self.student_topics and tname in self.student_topics[sid]:
            self.student_topics[sid][tname] = topic_dict
        if sid == "std_001" and tname in self.topics:
            self.topics[tname] = topic_dict

        if pg_client.is_connected:
            tid = f"mst_{tname.lower().replace(' ', '_')}_{sid}"
            pg_client.execute_non_query(
                """INSERT INTO student_topic_mastery (
                       id, student_id, topic, subject, mastery, accuracy, exam_weight,
                       mistakes, days_since_practiced, previous_accuracy, updated_at
                   ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
                   ON CONFLICT (student_id, topic) DO UPDATE SET
                       mastery = EXCLUDED.mastery,
                       accuracy = EXCLUDED.accuracy,
                       exam_weight = EXCLUDED.exam_weight,
                       mistakes = EXCLUDED.mistakes,
                       days_since_practiced = EXCLUDED.days_since_practiced,
                       previous_accuracy = EXCLUDED.previous_accuracy,
                       updated_at = CURRENT_TIMESTAMP;""",
                (
                    tid, sid, tname, topic_dict.get("subject", "Data Structures & Algorithms"),
                    float(topic_dict["mastery"]), float(topic_dict.get("accuracy", 0.5)),
                    float(topic_dict.get("exam_weight", 1.0)), int(topic_dict.get("mistakes", 0)),
                    int(topic_dict.get("days_since_practiced", 0)), float(topic_dict.get("previous_accuracy", 0.5))
                )
            )

    def save_mistake(self, mistake: Dict[str, Any]):
        if pg_client.is_connected:
            mid = mistake.get("id") or f"mst_{uuid.uuid4().hex[:8]}"
            sid = mistake.get("student_id", "std_001")
            pg_client.execute_non_query(
                """INSERT INTO mistakes (
                       id, student_id, topic, subject, question_id, question,
                       student_answer, correct_answer, explanation, mistake_count, is_resolved, last_attempted
                   ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                   ON CONFLICT (id) DO UPDATE SET
                       mistake_count = EXCLUDED.mistake_count,
                       student_answer = EXCLUDED.student_answer,
                       last_attempted = EXCLUDED.last_attempted,
                       last_attempted_at = CURRENT_TIMESTAMP;""",
                (
                    mid, sid, mistake.get("topic", "General"), mistake.get("subject", "Computer Science"),
                    mistake.get("question_id"), mistake.get("question", ""),
                    mistake.get("studentAnswer", mistake.get("student_answer", "")),
                    mistake.get("correctAnswer", mistake.get("correct_answer", "")),
                    mistake.get("explanation", ""),
                    int(mistake.get("mistakeCount", mistake.get("mistake_count", 1))),
                    bool(mistake.get("is_resolved", False)),
                    mistake.get("lastAttempted", mistake.get("last_attempted", "Just now"))
                )
            )

    def save_activity(self, activity: Dict[str, Any]):
        if pg_client.is_connected:
            aid = activity.get("id") or f"act_{uuid.uuid4().hex[:8]}"
            sid = activity.get("student_id", "std_001")
            pg_client.execute_non_query(
                """INSERT INTO activities (id, student_id, title, activity_type, timestamp_text, detail, badge)
                   VALUES (%s, %s, %s, %s, %s, %s, %s)
                   ON CONFLICT (id) DO NOTHING;""",
                (
                    aid, sid, activity.get("title", ""), activity.get("type", "quiz"),
                    activity.get("timestamp", "Just now"), activity.get("detail", ""),
                    activity.get("badge")
                )
            )

    def save_task_completion(self, student_id: str, task_id: str, completed: bool = True):
        sid = student_id or "std_001"
        if pg_client.is_connected:
            pg_client.execute_non_query(
                """UPDATE study_tasks SET completed = %s, completed_at = CURRENT_TIMESTAMP
                   WHERE id = %s AND student_id = %s;""",
                (completed, task_id, sid)
            )

    def save_quiz_attempt(self, attempt: Dict[str, Any]):
        if pg_client.is_connected:
            aid = attempt.get("id") or f"att_{uuid.uuid4().hex[:8]}"
            sid = attempt.get("student_id", "std_001")
            pg_client.execute_non_query(
                """INSERT INTO quiz_attempts (id, student_id, topic, score, total_questions, accuracy_percentage, time_spent_seconds)
                   VALUES (%s, %s, %s, %s, %s, %s, %s)
                   ON CONFLICT (id) DO NOTHING;""",
                (
                    aid, sid, attempt.get("topic", "General"),
                    attempt["score"], attempt["total_questions"],
                    attempt["accuracy_percentage"], attempt.get("time_spent_seconds", 120)
                )
            )

    # --------------------------------------------------------------------------
    # Student Partitioning & Access Methods
    # --------------------------------------------------------------------------
    def get_student(self, student_id: str) -> Optional[Dict[str, Any]]:
        sid = student_id or "std_001"
        if pg_client.is_connected:
            rows = pg_client.execute_query("SELECT * FROM students WHERE id = %s;", (sid,))
            if rows:
                s_dict = dict(rows[0])
                if isinstance(s_dict.get("exam_date"), (date, datetime)):
                    s_dict["exam_date"] = s_dict["exam_date"].isoformat()
                self.students[sid] = s_dict
                return s_dict
        return self.students.get(sid, self.students.get("std_001"))

    def get_student_topics(self, student_id: str) -> Dict[str, Dict[str, Any]]:
        sid = student_id or "std_001"
        if pg_client.is_connected:
            rows = pg_client.execute_query(
                "SELECT * FROM student_topic_mastery WHERE student_id = %s;",
                (sid,)
            )
            if rows:
                topics_map = {}
                for m in rows:
                    tname = m["topic"]
                    topics_map[tname] = {
                        "id": m["id"],
                        "subject": m["subject"],
                        "topic": tname,
                        "mastery": float(m["mastery"]),
                        "accuracy": float(m["accuracy"]),
                        "exam_weight": float(m["exam_weight"]),
                        "mistakes": int(m["mistakes"]),
                        "days_since_practiced": int(m["days_since_practiced"]),
                        "previous_accuracy": float(m["previous_accuracy"]),
                        "category": m.get("category", "NEEDS_PRACTICE"),
                        "priority": m.get("priority", "MEDIUM")
                    }
                self.student_topics[sid] = topics_map
                if sid == "std_001":
                    for tn, tdata in topics_map.items():
                        self.topics[tn] = tdata
                return topics_map
        if sid not in self.student_topics:
            import copy
            self.student_topics[sid] = copy.deepcopy(self.topics)
        return self.student_topics[sid]

    def get_student_tasks(self, student_id: str) -> List[Dict[str, Any]]:
        sid = student_id or "std_001"
        if pg_client.is_connected:
            rows = pg_client.execute_query(
                "SELECT * FROM study_tasks WHERE student_id = %s ORDER BY id;",
                (sid,)
            )
            if rows:
                loaded = [
                    {
                        "id": t["id"],
                        "subject": t["subject"],
                        "topic": t["topic"],
                        "title": t["title"],
                        "type": t["task_type"],
                        "durationMinutes": t["duration_minutes"],
                        "completed": t["completed"],
                        "xpReward": t["xp_reward"]
                    }
                    for t in rows
                ]
                self.student_tasks[sid] = loaded
                if sid == "std_001":
                    self.today_tasks = loaded
                return loaded
        if sid not in self.student_tasks:
            import copy
            self.student_tasks[sid] = copy.deepcopy(self.today_tasks)
        return self.student_tasks[sid]

    def get_student_mistakes(self, student_id: str) -> List[Dict[str, Any]]:
        sid = student_id or "std_001"
        if pg_client.is_connected:
            rows = pg_client.execute_query(
                """SELECT * FROM mistakes WHERE student_id = %s
                   ORDER BY last_attempted_at DESC, id DESC;""",
                (sid,)
            )
            if rows is not None and len(rows) > 0:
                return [
                    {
                        "id": m["id"],
                        "student_id": m["student_id"],
                        "topic": m["topic"],
                        "subject": m["subject"],
                        "mistakeCount": m["mistake_count"],
                        "question": m["question"],
                        "studentAnswer": m["student_answer"],
                        "correctAnswer": m["correct_answer"],
                        "explanation": m["explanation"],
                        "lastAttempted": m.get("last_attempted", "Just now")
                    }
                    for m in rows
                ]
        user_mistakes = [m for m in self.mistakes if m.get("student_id") == sid]
        if not user_mistakes and sid == "std_001":
            return self.mistakes
        return user_mistakes

    def get_student_activities(self, student_id: str) -> List[Dict[str, Any]]:
        sid = student_id or "std_001"
        if pg_client.is_connected:
            rows = pg_client.execute_query(
                "SELECT * FROM activities WHERE student_id = %s ORDER BY created_at DESC LIMIT 10;",
                (sid,)
            )
            if rows:
                return [
                    {
                        "id": a["id"],
                        "student_id": a["student_id"],
                        "title": a["title"],
                        "type": a["activity_type"],
                        "timestamp": a["timestamp_text"],
                        "detail": a["detail"],
                        "badge": a.get("badge")
                    }
                    for a in rows
                ]
        user_acts = [a for a in self.activities if a.get("student_id") == sid]
        if not user_acts and sid == "std_001":
            return self.activities
        return user_acts

    def get_student_plan(self, student_id: str) -> Optional[List[Dict[str, Any]]]:
        sid = student_id or "std_001"
        if pg_client.is_connected:
            rows = pg_client.execute_query(
                "SELECT plan_data FROM study_plans WHERE student_id = %s AND is_active = TRUE ORDER BY created_at DESC LIMIT 1;",
                (sid,)
            )
            if rows and rows[0].get("plan_data"):
                pdata = rows[0]["plan_data"]
                if isinstance(pdata, str):
                    try:
                        pdata = json.loads(pdata)
                    except Exception:
                        pdata = None
                if pdata:
                    self.student_plans[sid] = pdata
                    return pdata
        return self.student_plans.get(sid)

    def get_questions(self, subject: Optional[str] = None, topic: Optional[str] = None) -> List[Dict[str, Any]]:
        if pg_client.is_connected:
            rows = pg_client.execute_query(
                "SELECT id, subject, topic, difficulty, question, options, correct_answer, explanation FROM questions ORDER BY id;"
            )
            if rows:
                qs = []
                for q in rows:
                    opts = q["options"]
                    if isinstance(opts, str):
                        try:
                            opts = json.loads(opts)
                        except Exception:
                            opts = []
                    qs.append({
                        "id": q["id"],
                        "subject": q["subject"],
                        "topic": q["topic"],
                        "difficulty": q["difficulty"],
                        "question": q["question"],
                        "options": opts,
                        "correctAnswer": q["correct_answer"],
                        "explanation": q["explanation"]
                    })
                self.questions = qs
        filtered = [
            q for q in self.questions
            if (not topic or topic.lower() in q["topic"].lower()) or
               (not subject or subject.lower() in q["subject"].lower())
        ]
        return filtered or self.questions


    def set_student_plan(self, student_id: str, plan: List[Dict[str, Any]]) -> None:
        sid = student_id or "std_001"
        self.student_plans[sid] = plan
        if plan and len(plan) > 0 and "tasks" in plan[0]:
            self.student_tasks[sid] = plan[0]["tasks"]
            if sid == "std_001":
                self.today_tasks = plan[0]["tasks"]

        # Persist plan to Supabase PostgreSQL
        if pg_client.is_connected:
            try:
                pid = f"plan_{sid}"
                plan_json = json.dumps(plan)
                pg_client.execute_non_query(
                    """INSERT INTO study_plans (id, student_id, title, is_active, plan_data)
                       VALUES (%s, %s, %s, TRUE, %s)
                       ON CONFLICT (id) DO UPDATE SET
                           plan_data = EXCLUDED.plan_data,
                           is_active = TRUE;""",
                    (pid, sid, "Adaptive Study Plan", plan_json)
                )
                # Persist day 1 tasks to study_tasks
                if plan and len(plan) > 0 and "tasks" in plan[0]:
                    for t in plan[0]["tasks"]:
                        pg_client.execute_non_query(
                            """INSERT INTO study_tasks (id, student_id, plan_id, topic, subject, title, task_type, duration_minutes, completed, xp_reward)
                               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                               ON CONFLICT (id) DO UPDATE SET
                                   title = EXCLUDED.title,
                                   duration_minutes = EXCLUDED.duration_minutes,
                                   completed = EXCLUDED.completed;""",
                            (
                                t["id"], sid, pid, t.get("topic", "General"), t.get("subject", "Data Structures & Algorithms"),
                                t.get("title", "Study Task"), t.get("type", "Practice"),
                                int(t.get("durationMinutes", 25)), bool(t.get("completed", False)),
                                int(t.get("xpReward", 35))
                            )
                        )
            except Exception as e:
                logger.warning(f"Error persisting study plan to PostgreSQL: {e}")


db = InMemoryDatabase()
