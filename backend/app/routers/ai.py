from fastapi import APIRouter, Depends
from datetime import datetime
import os
from ..schemas.ai import AIAskRequest, AIMessageResponse
from ..config import settings
from ..db.repository import db
from .auth import get_current_user_id

router = APIRouter(prefix="/ai", tags=["AI Tutor"])

@router.post("/ask", response_model=AIMessageResponse)
def ask_ai_tutor(req: AIAskRequest, current_user_id: str = Depends(get_current_user_id)):
    raw_query = req.message or req.query or "Explain key concepts"
    q = raw_query.lower()
    time_str = datetime.now().strftime("%I:%M %p")

    sid = req.student_id or current_user_id or "std_001"
    student = db.students.get(sid, db.students["std_001"])
    topics_map = db.get_student_topics(sid)
    sorted_by_mastery = sorted(topics_map.values(), key=lambda t: t.get("mastery", 50))
    weakest = sorted_by_mastery[0] if sorted_by_mastery else {"topic": "Graphs", "mastery": 38.0, "accuracy": 0.42, "mistakes": 4}
    strongest = sorted_by_mastery[-1] if sorted_by_mastery else {"topic": "Arrays", "mastery": 91.0}
    days_left = student.get("days_remaining", 12)

    # 1. Personalized Study Advice / Why Graphs / Weak Topics queries
    if any(k in q for k in ["study today", "what should i study", "weak", "why", "priority", "recommend", "plan", "advice"]):
        content = (
            f"### 🎯 Personalized Academic Guidance for {student.get('name', 'Student')}\n\n"
            f"Based on your real-time **Bayesian Knowledge Tracing (BKT)** diagnostics:\n\n"
            f"- **Top Focus Area: {weakest['topic']}** ({weakest.get('mastery', 38.0)}% mastery, {weakest.get('mistakes', 4)} logged mistakes).\n"
            f"- **Next In Line**: {sorted_by_mastery[1]['topic'] if len(sorted_by_mastery) > 1 else 'AVL Trees'} ({sorted_by_mastery[1].get('mastery', 52.0) if len(sorted_by_mastery) > 1 else 52.0}% mastery).\n"
            f"- **High Mastery (Revision Reduced)**: {strongest['topic']} ({strongest.get('mastery', 91.0)}% mastery).\n\n"
            f"**Strategic Insight**: Your exam is in **{days_left} days**. "
            f"Because {weakest['topic']} carries an exam weight of {weakest.get('exam_weight', 2.0)}x, "
            f"your study plan has intensified {weakest['topic']} interventions (75 minutes) while reducing revision for {strongest['topic']}."
        )
        steps = [
            f"Step 1: Open today's study plan and complete '{weakest['topic']} Traversal' (30 mins)",
            f"Step 2: Review your {weakest.get('mistakes', 4)} logged misconceptions in the Mistake Tracker",
            f"Step 3: Take a 5-question diagnostic quiz to boost {weakest['topic']} mastery above 70%",
            f"Step 4: Verify that high-mastery topics like {strongest['topic']} remain locked in"
        ]
    elif "avl" in q or "rotation" in q or "tree" in q:
        content = (
            "### AVL Tree Rotations & Balance Guarantees\n\n"
            "AVL trees enforce height-balancing where $|Height(Left) - Height(Right)| \\le 1$:\n\n"
            "- **Left-Left (LL)**: Single Right Rotation at critical ancestor.\n"
            "- **Right-Right (RR)**: Single Left Rotation at critical ancestor.\n"
            "- **Left-Right (LR)**: Double rotation — Left rotate left child, then Right rotate critical ancestor.\n"
            "- **Right-Left (RL)**: Double rotation — Right rotate right child, then Left rotate critical ancestor.\n\n"
            "Guarantees search, insertion, and deletion within strict **O(log n)** time."
        )
        steps = [
            "Compute Balance Factor: Height(Left) - Height(Right)",
            "Detect balance violation: (|Balance Factor| >= 2)",
            "Identify rotation category from ancestor & child signs",
            "Perform atomic pointer updates in O(1) time"
        ]
    elif "graph" in q or "bfs" in q or "dfs" in q:
        content = (
            "### Graph Traversal: BFS vs DFS Deep Dive\n\n"
            "- **BFS (Breadth-First Search)**: Uses a **Queue** (FIFO). Explores nodes level-by-level. Optimal for finding the unweighted shortest path.\n"
            "- **DFS (Depth-First Search)**: Uses a **Stack** (LIFO) or recursive call stack. Explores deep along branches before backtracking. Best for cycle detection and topological sorting.\n\n"
            "Both achieve **O(V + E)** time complexity with adjacency lists."
        )
        steps = [
            "Initialize visited tracking array/hash set to prevent cycles",
            "Initialize frontier data structure (Queue for BFS, Stack for DFS)",
            "Loop while frontier is non-empty: pop vertex and inspect adjacency list",
            "Add unvisited neighbors to frontier and mark visited immediately"
        ]
    elif "quiz" in q or "question" in q or "practice" in q:
        content = (
            "### Target Practice Question\n\n"
            "**Question**: Given an unweighted directed graph with V vertices and E edges, which traversal algorithm should be used to find the shortest path from vertex A to B in minimum time?\n\n"
            "- **A**: Depth-First Search (DFS)\n"
            "- **B**: Breadth-First Search (BFS)\n"
            "- **C**: Dijkstra's Algorithm\n"
            "- **D**: Prim's Algorithm\n\n"
            "*Hint*: Think about level-by-level exploration order!"
        )
        steps = [
            "Analyze graph properties: unweighted directed",
            "Recall property: BFS finds unweighted shortest paths in O(V + E)",
            "Dijkstra adds unnecessary log V overhead on unweighted graphs"
        ]
    else:
        content = (
            f"### Academic Analysis: \"{raw_query}\"\n\n"
            "Here is the structured conceptual breakdown:\n\n"
            "1. **Core Concept**: Break down the core invariant and formal definition.\n"
            "2. **Algorithm Steps**: Walk through deterministic state transitions.\n"
            "3. **Exam Complexity**: Always state worst-case time & space bounds.\n\n"
            "Let me know if you would like a step-by-step example or a practice diagnostic question!"
        )
        steps = [
            "Define mathematical base case and invariants",
            "Trace with a concrete sample execution",
            "Verify time and space complexity constraints"
        ]

    return AIMessageResponse(
        id=f"ai_{int(datetime.now().timestamp())}",
        sender="assistant",
        content=content,
        timestamp=time_str,
        steps=steps,
        quickActions=["Why Graphs?", "Explain Simpler", "Give Example", "Show Steps", "Quiz Me", "My Weak Topics"]
    )
