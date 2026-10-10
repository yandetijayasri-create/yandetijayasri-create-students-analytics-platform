-- ==============================================================================
-- ELEVΛLTE — Supabase PostgreSQL Seed Data
-- AI-Powered Student Success Platform
-- Deterministic hackathon baseline matching Alex Johnson demo profile
-- ==============================================================================

-- 1. USERS & AUTHENTICATION (password: "password123")
INSERT INTO users (id, email, password_hash, name, role)
VALUES 
    (
        'std_001',
        'demo.student@university.edu',
        -- sha256("elevalte_salt_2026password123")
        '6494fae758a69e38d73b5a7933b91bcda421ebefea5c1a74c77ea1c8c85fa712',
        'Demo Student',
        'student'
    ),
    (
        'std_002',
        'alex.johnson@university.edu',
        '6494fae758a69e38d73b5a7933b91bcda421ebefea5c1a74c77ea1c8c85fa712',
        'Alex Johnson',
        'student'
    )
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    name = EXCLUDED.name;

-- 2. STUDENT PROFILE
INSERT INTO students (
    id, name, email, avatar_url, course, branch, year, semester,
    target_goal, exam_name, exam_date, days_remaining, target_score,
    daily_study_hours, preferred_time, streak_days, total_study_minutes,
    xp, level, level_title, plan_adapted, plan_adapted_message
) VALUES 
    (
        'std_001',
        'Demo Student',
        'demo.student@university.edu',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        'Bachelor of Technology',
        'Computer Science & Engineering',
        '3rd Year',
        '5th Semester',
        'Semester Exam',
        'Semester Exam',
        (CURRENT_DATE + INTERVAL '12 days'),
        12,
        '9.2 CGPA / 90%',
        '2 hours',
        'Evening (6 PM - 10 PM)',
        7,
        755,
        1240,
        8,
        'Consistent Learner',
        FALSE,
        NULL
    ),
    (
        'std_002',
        'Alex Johnson',
        'alex.johnson@university.edu',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        'Bachelor of Technology',
        'Computer Science & Engineering',
        '3rd Year',
        '5th Semester',
        'Semester Exam',
        'Semester Exam',
        (CURRENT_DATE + INTERVAL '12 days'),
        12,
        '9.2 CGPA / 90%',
        '2 hours',
        'Evening (6 PM - 10 PM)',
        7,
        755,
        1240,
        8,
        'Consistent Learner',
        FALSE,
        NULL
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    course = EXCLUDED.course,
    branch = EXCLUDED.branch,
    target_goal = EXCLUDED.target_goal,
    exam_name = EXCLUDED.exam_name,
    exam_date = EXCLUDED.exam_date,
    days_remaining = EXCLUDED.days_remaining,
    daily_study_hours = EXCLUDED.daily_study_hours;

-- 3. TOPIC CATALOG
INSERT INTO topics (id, subject, topic, default_exam_weight) VALUES
    ('top_graphs', 'Data Structures & Algorithms', 'Graphs', 2.0),
    ('top_avl', 'Data Structures & Algorithms', 'AVL Trees', 1.5),
    ('top_dbms', 'Database Management Systems', 'DBMS', 1.5),
    ('top_os', 'Operating Systems', 'Operating Systems', 1.5),
    ('top_math', 'Discrete Mathematics', 'Mathematics', 1.0),
    ('top_python', 'Programming', 'Python', 1.0),
    ('top_arrays', 'Data Structures & Algorithms', 'Arrays', 1.0)
ON CONFLICT (topic) DO UPDATE SET
    default_exam_weight = EXCLUDED.default_exam_weight;

-- 4. STUDENT TOPIC MASTERY (BASELINE BEFORE DIAGNOSTIC QUIZ)
-- Graphs: 38% | AVL Trees: 52% | Arrays: 91%
INSERT INTO student_topic_mastery (
    id, student_id, topic, subject, mastery, accuracy, exam_weight, mistakes,
    days_since_practiced, previous_accuracy, category, priority
) VALUES
    ('mst_graphs_std1', 'std_001', 'Graphs', 'Data Structures & Algorithms', 38.0, 0.42, 2.0, 4, 1, 0.45, 'HIGH_PRIORITY', 'HIGH'),
    ('mst_avl_std1', 'std_001', 'AVL Trees', 'Data Structures & Algorithms', 52.0, 0.54, 1.5, 3, 2, 0.50, 'NEEDS_PRACTICE', 'MEDIUM'),
    ('mst_dbms_std1', 'std_001', 'DBMS', 'Database Management Systems', 58.0, 0.58, 1.5, 2, 2, 0.55, 'NEEDS_PRACTICE', 'MEDIUM'),
    ('mst_os_std1', 'std_001', 'Operating Systems', 'Operating Systems', 45.0, 0.45, 1.5, 2, 1, 0.48, 'HIGH_PRIORITY', 'HIGH'),
    ('mst_math_std1', 'std_001', 'Mathematics', 'Discrete Mathematics', 64.0, 0.64, 1.0, 1, 3, 0.60, 'NEEDS_PRACTICE', 'MEDIUM'),
    ('mst_python_std1', 'std_001', 'Python', 'Programming', 88.0, 0.88, 1.0, 0, 4, 0.85, 'STRONG', 'LOW'),
    ('mst_arrays_std1', 'std_001', 'Arrays', 'Data Structures & Algorithms', 91.0, 0.91, 1.0, 0, 5, 0.90, 'STRONG', 'LOW'),
    ('mst_graphs_std2', 'std_002', 'Graphs', 'Data Structures & Algorithms', 38.0, 0.42, 2.0, 4, 1, 0.45, 'HIGH_PRIORITY', 'HIGH'),
    ('mst_avl_std2', 'std_002', 'AVL Trees', 'Data Structures & Algorithms', 52.0, 0.54, 1.5, 3, 2, 0.50, 'NEEDS_PRACTICE', 'MEDIUM'),
    ('mst_dbms_std2', 'std_002', 'DBMS', 'Database Management Systems', 58.0, 0.58, 1.5, 2, 2, 0.55, 'NEEDS_PRACTICE', 'MEDIUM'),
    ('mst_os_std2', 'std_002', 'Operating Systems', 'Operating Systems', 45.0, 0.45, 1.5, 2, 1, 0.48, 'HIGH_PRIORITY', 'HIGH'),
    ('mst_math_std2', 'std_002', 'Mathematics', 'Discrete Mathematics', 64.0, 0.64, 1.0, 1, 3, 0.60, 'NEEDS_PRACTICE', 'MEDIUM'),
    ('mst_python_std2', 'std_002', 'Python', 'Programming', 88.0, 0.88, 1.0, 0, 4, 0.85, 'STRONG', 'LOW'),
    ('mst_arrays_std2', 'std_002', 'Arrays', 'Data Structures & Algorithms', 91.0, 0.91, 1.0, 0, 5, 0.90, 'STRONG', 'LOW')
ON CONFLICT (student_id, topic) DO UPDATE SET
    mastery = EXCLUDED.mastery,
    accuracy = EXCLUDED.accuracy,
    exam_weight = EXCLUDED.exam_weight,
    mistakes = EXCLUDED.mistakes,
    days_since_practiced = EXCLUDED.days_since_practiced;

-- 5. QUESTION BANK (7 ACADEMIC DIAGNOSTIC QUESTIONS)
INSERT INTO questions (id, subject, topic, difficulty, question, options, correct_answer, explanation) VALUES
(
    1,
    'Data Structures & Algorithms',
    'Graphs',
    'Medium',
    'Which data structure is primarily utilized to implement Breadth-First Search (BFS) on an unweighted graph?',
    '[{"id": "A", "text": "Stack"}, {"id": "B", "text": "Queue"}, {"id": "C", "text": "Binary Heap"}, {"id": "D", "text": "Hash Table"}]'::jsonb,
    'B',
    'BFS explores vertices level-by-level in FIFO order using a Queue.'
),
(
    2,
    'Data Structures & Algorithms',
    'Graphs',
    'Medium',
    'What is the time complexity of Breadth-First Search using an Adjacency List for V vertices and E edges?',
    '[{"id": "A", "text": "O(V^2)"}, {"id": "B", "text": "O(V + E)"}, {"id": "C", "text": "O(E * log V)"}, {"id": "D", "text": "O(V * E)"}]'::jsonb,
    'B',
    'Each vertex is queued once and every outgoing edge inspected once or twice, yielding O(V + E).'
),
(
    3,
    'Data Structures & Algorithms',
    'Graphs',
    'Hard',
    'Can standard Dijkstra''s algorithm guarantee the correct shortest path on graphs containing negative edge weights?',
    '[{"id": "A", "text": "Yes, always"}, {"id": "B", "text": "Yes, if no negative cycles exist"}, {"id": "C", "text": "No, greedy choice breaks with negative edge weights"}, {"id": "D", "text": "Yes, if transformed to positive values"}]'::jsonb,
    'C',
    'Dijkstra locks in distance greedily once a node is visited. Negative edges invalidate this invariant.'
),
(
    4,
    'Data Structures & Algorithms',
    'Graphs',
    'Medium',
    'Which algorithm is most suitable to detect a cycle in a directed graph using topological sort?',
    '[{"id": "A", "text": "Kahn''s Algorithm (in-degree BFS)"}, {"id": "B", "text": "Prim''s Algorithm"}, {"id": "C", "text": "Kruskal''s Algorithm"}, {"id": "D", "text": "Floyd-Warshall"}]'::jsonb,
    'A',
    'Kahn''s algorithm tracks in-degrees; if the processed count is less than V, a cycle exists.'
),
(
    5,
    'Data Structures & Algorithms',
    'AVL Trees',
    'Hard',
    'In an AVL tree, what rotation is required when a node is inserted into the left subtree of the right child?',
    '[{"id": "A", "text": "Single Right Rotation (LL)"}, {"id": "B", "text": "Single Left Rotation (RR)"}, {"id": "C", "text": "Right-Left Rotation (RL)"}, {"id": "D", "text": "Left-Right Rotation (LR)"}]'::jsonb,
    'C',
    'Zig-zag imbalance (Right then Left) requires a double Right-Left (RL) rotation.'
),
(
    6,
    'Database Management Systems',
    'DBMS',
    'Medium',
    'Which SQL clause is used to filter aggregated group records produced by a GROUP BY statement?',
    '[{"id": "A", "text": "WHERE"}, {"id": "B", "text": "HAVING"}, {"id": "C", "text": "FILTER"}, {"id": "D", "text": "LIMIT"}]'::jsonb,
    'B',
    'HAVING filters groups post-aggregation; WHERE filters individual rows prior to grouping.'
),
(
    7,
    'Operating Systems',
    'Operating Systems',
    'Medium',
    'Which condition is NOT one of Coffman''s four necessary conditions for deadlock?',
    '[{"id": "A", "text": "Mutual Exclusion"}, {"id": "B", "text": "Hold and Wait"}, {"id": "C", "text": "Preemption Allowed"}, {"id": "D", "text": "Circular Wait"}]'::jsonb,
    'C',
    'The condition is No Preemption. Allowing preemption prevents deadlocks.'
)
ON CONFLICT (id) DO UPDATE SET
    question = EXCLUDED.question,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer,
    explanation = EXCLUDED.explanation;

-- Synchronize sequence
SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions));

-- 6. MISTAKES LOG FOR DEMO STUDENT
INSERT INTO mistakes (id, student_id, topic, subject, question_id, question, student_answer, correct_answer, explanation, mistake_count, is_resolved, last_attempted) VALUES
(
    'mst_1',
    'std_001',
    'Graph Traversal',
    'Data Structures & Algorithms',
    1,
    'Which data structure is used to implement Breadth-First Search (BFS)?',
    'A: Stack (Selected 4 times)',
    'B: Queue',
    'BFS explores vertices in level-order FIFO sequence requiring a Queue.',
    4,
    FALSE,
    'Oct 08, 2026'
),
(
    'mst_2',
    'std_001',
    'AVL Rotation',
    'Data Structures & Algorithms',
    5,
    'Identify the required rotation when inserting into the left subtree of the right child of an unbalanced node.',
    'B: Single Left Rotation (RR)',
    'C: Right-Left Rotation (RL)',
    'Because the imbalance zig-zags (Right then Left), an RL double rotation is required.',
    3,
    FALSE,
    'Oct 07, 2026'
),
(
    'mst_3',
    'std_001',
    'SQL Joins',
    'Database Management Systems',
    6,
    'Which JOIN returns all rows from the left table even if there are no matching rows in the right table?',
    'A: INNER JOIN',
    'B: LEFT OUTER JOIN',
    'LEFT OUTER JOIN keeps all rows from the primary left table, populating NULL for missing right matches.',
    2,
    FALSE,
    'Oct 06, 2026'
)
ON CONFLICT (id) DO UPDATE SET
    mistake_count = EXCLUDED.mistake_count,
    student_answer = EXCLUDED.student_answer;

-- 7. TODAY'S STUDY TASKS FOR DEMO STUDENT
INSERT INTO study_tasks (id, student_id, topic, subject, title, task_type, duration_minutes, completed, xp_reward, scheduled_date) VALUES
    ('task_1', 'std_001', 'Graph Traversal (BFS & DFS)', 'Data Structures & Algorithms', 'Learn — Graph Traversal', 'Learn', 30, FALSE, 50, CURRENT_DATE),
    ('task_2', 'std_001', 'Breadth-First & Depth-First Search', 'Data Structures & Algorithms', 'Practice — BFS & DFS', 'Practice', 25, FALSE, 40, CURRENT_DATE),
    ('task_3', 'std_001', 'AVL Tree Rotations', 'Data Structures & Algorithms', 'Review — Previous Mistakes', 'Review', 20, TRUE, 30, CURRENT_DATE),
    ('task_4', 'std_001', 'SQL Joins', 'Database Management Systems', 'Practice — SQL Joins', 'Practice', 20, TRUE, 35, CURRENT_DATE),
    ('task_5', 'std_001', 'Memory Paging', 'Operating Systems', 'Learn — Page Replacement', 'Learn', 30, TRUE, 45, CURRENT_DATE)
ON CONFLICT (id) DO UPDATE SET
    completed = EXCLUDED.completed;

-- 8. RECENT ACTIVITY LOG
INSERT INTO activities (id, student_id, title, activity_type, timestamp_text, detail, badge) VALUES
    ('act_1', 'std_001', 'Quiz Completed: Graph Algorithms', 'quiz', '2 hours ago', 'Scored 7/10 (70% accuracy) — 3 mistakes recorded for targeted review.', '+35 XP'),
    ('act_2', 'std_001', 'Smart Notes Generated: Shortest Paths', 'notes', '4 hours ago', 'Dijkstra & Bellman-Ford summarized into 4 key formula cards.', '+15 XP'),
    ('act_3', 'std_001', 'Deep Study Session Completed', 'session', 'Yesterday', 'Completed 45 minutes of AVL Tree self-balancing exercises.', '🔥 Day 7 Streak')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title;

-- 9. LEARNING RESOURCES
INSERT INTO resources (id, title, subject, topic, resource_type, duration, is_ai_recommended, recommendation_reason, url, read_count) VALUES
    ('res_1', 'Graph Traversal — Beginner to Advanced Guide', 'Data Structures & Algorithms', 'Graphs', 'Notes', '18 min read', TRUE, 'Recommended because Graphs is currently one of your weakest topics (38% mastery).', '#', 1420),
    ('res_2', 'AVL Trees Balancing & Rotations Step-by-Step', 'Data Structures & Algorithms', 'AVL Trees', 'PDF', '12 pages', TRUE, 'High mistake frequency in LL, RR, LR and RL rotation exam questions.', '#', 980),
    ('res_3', 'BFS vs DFS Visualized: When to Use Which', 'Data Structures & Algorithms', 'Graphs', 'Video', '14 min watch', TRUE, 'Recommended to clarify queue vs stack mechanics before today''s quiz.', '#', 2310),
    ('res_4', 'Mastering SQL Joins & Aggregate Grouping', 'Database Management Systems', 'DBMS', 'Notes', '15 min read', FALSE, NULL, '#', 890)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    is_ai_recommended = EXCLUDED.is_ai_recommended;
