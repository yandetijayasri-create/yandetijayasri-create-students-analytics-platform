-- ==============================================================================
-- ELEVΛLTE — Supabase PostgreSQL Relational Schema
-- AI-Powered Student Analysis, Adaptive Learning & Student Success Platform
-- Compatible with Supabase PostgreSQL, Transaction Pooler, and Direct Connections
-- ==============================================================================

-- Enable UUID extension if required
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. USERS & AUTHENTICATION
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(64) DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. STUDENT PROFILES & ACADEMIC CALIBRATION
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    course VARCHAR(128) NOT NULL DEFAULT 'Bachelor of Technology',
    branch VARCHAR(128) NOT NULL DEFAULT 'Computer Science & Engineering',
    year VARCHAR(64) NOT NULL DEFAULT '3rd Year',
    semester VARCHAR(64) NOT NULL DEFAULT '5th Semester',
    target_goal VARCHAR(255) NOT NULL DEFAULT 'Prepare for Semester Exams',
    exam_name VARCHAR(255) NOT NULL DEFAULT 'Fall Semester Final Exams',
    exam_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '12 days'),
    days_remaining INTEGER DEFAULT 12,
    target_score VARCHAR(64) DEFAULT '9.2 CGPA / 90%',
    daily_study_hours VARCHAR(64) DEFAULT '2 hours',
    preferred_time VARCHAR(128) DEFAULT 'Evening (6 PM - 10 PM)',
    streak_days INTEGER DEFAULT 7,
    total_study_minutes INTEGER DEFAULT 755,
    xp INTEGER DEFAULT 1240,
    level INTEGER DEFAULT 8,
    level_title VARCHAR(128) DEFAULT 'Consistent Learner',
    plan_adapted BOOLEAN DEFAULT FALSE,
    plan_adapted_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 3. ACADEMIC SUBJECT CATALOG
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    mastery_percentage INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 4. TOPIC CATALOG & TOPIC DEFINITIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(64) PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    topic VARCHAR(255) UNIQUE NOT NULL,
    default_exam_weight DOUBLE PRECISION DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 5. STUDENT TOPIC MASTERY (BAYESIAN KNOWLEDGE TRACING PERSISTENCE)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_topic_mastery (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    mastery DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    accuracy DOUBLE PRECISION NOT NULL DEFAULT 0.50,
    exam_weight DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    mistakes INTEGER NOT NULL DEFAULT 0,
    days_since_practiced INTEGER NOT NULL DEFAULT 0,
    previous_accuracy DOUBLE PRECISION NOT NULL DEFAULT 0.50,
    category VARCHAR(32) DEFAULT 'NEEDS_PRACTICE',
    priority VARCHAR(16) DEFAULT 'MEDIUM',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, topic)
);

-- ------------------------------------------------------------------------------
-- 6. QUESTION BANK
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    difficulty VARCHAR(16) NOT NULL DEFAULT 'Medium',
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer VARCHAR(8) NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 7. QUIZ ATTEMPTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    accuracy_percentage INTEGER NOT NULL,
    time_spent_seconds INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 8. QUIZ ATTEMPT ANSWERS & QUESTION AUDIT
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quiz_attempt_answers (
    id SERIAL PRIMARY KEY,
    attempt_id VARCHAR(64) NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    student_answer VARCHAR(16),
    correct_answer VARCHAR(16) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    topic VARCHAR(255) NOT NULL,
    explanation TEXT
);

-- ------------------------------------------------------------------------------
-- 9. MISTAKES & MISCONCEPTION TRACKER
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mistakes (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    question_id INTEGER REFERENCES questions(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    student_answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    mistake_count INTEGER NOT NULL DEFAULT 1,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    last_attempted VARCHAR(64) DEFAULT 'Just now',
    last_attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 10. LEARNING GAPS (ML CLASSIFIER OUTPUT)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS learning_gaps (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    accuracy INTEGER NOT NULL,
    priority VARCHAR(16) NOT NULL DEFAULT 'HIGH',
    category VARCHAR(32) NOT NULL DEFAULT 'HIGH_PRIORITY',
    trend VARCHAR(16) DEFAULT 'stable',
    last_practiced VARCHAR(64) DEFAULT 'Yesterday',
    recommendation TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, topic)
);

-- ------------------------------------------------------------------------------
-- 11. AI RECOMMENDATIONS (MULTI-ATTRIBUTE RANKER OUTPUT)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    headline TEXT NOT NULL,
    reason TEXT NOT NULL,
    accuracy INTEGER NOT NULL,
    days_to_exam INTEGER NOT NULL,
    impact_level VARCHAR(16) NOT NULL DEFAULT 'High',
    action_label VARCHAR(128) NOT NULL,
    action_url VARCHAR(255) NOT NULL,
    score DOUBLE PRECISION DEFAULT 1.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 12. STUDY PLANS (ADAPTIVE PLAN OPTIMIZER OUTPUT)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS study_plans (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    daily_hours DOUBLE PRECISION DEFAULT 2.0,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '7 days'),
    is_active BOOLEAN DEFAULT TRUE,
    plan_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 13. STUDY TASKS (INDIVIDUAL SCHEDULED TASKS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS study_tasks (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    plan_id VARCHAR(64) REFERENCES study_plans(id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    task_type VARCHAR(32) NOT NULL DEFAULT 'Practice',
    duration_minutes INTEGER NOT NULL DEFAULT 25,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    xp_reward INTEGER NOT NULL DEFAULT 35,
    scheduled_date DATE DEFAULT CURRENT_DATE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ------------------------------------------------------------------------------
-- 14. STUDENT ACTIVITY LOG
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    activity_type VARCHAR(32) NOT NULL,
    timestamp_text VARCHAR(64) NOT NULL,
    detail TEXT NOT NULL,
    badge VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 15. CURATED LEARNING RESOURCES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resources (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    resource_type VARCHAR(32) NOT NULL,
    duration VARCHAR(64) NOT NULL,
    is_ai_recommended BOOLEAN DEFAULT FALSE,
    recommendation_reason TEXT,
    url TEXT DEFAULT '#',
    read_count INTEGER DEFAULT 100
);

-- ------------------------------------------------------------------------------
-- 16. PROGRESS HISTORY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS progress_history (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    study_minutes INTEGER NOT NULL DEFAULT 0,
    overall_mastery INTEGER NOT NULL DEFAULT 50,
    quiz_accuracy INTEGER NOT NULL DEFAULT 50,
    activities_completed INTEGER NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------------------------
-- 17. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_student_topic_mastery_sid ON student_topic_mastery(student_id);
CREATE INDEX IF NOT EXISTS idx_student_topic_mastery_topic ON student_topic_mastery(student_id, topic);
CREATE INDEX IF NOT EXISTS idx_student_tasks_sid ON study_tasks(student_id, completed);
CREATE INDEX IF NOT EXISTS idx_mistakes_sid ON mistakes(student_id, is_resolved);
CREATE INDEX IF NOT EXISTS idx_activities_sid ON activities(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_sid ON quiz_attempts(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic);
CREATE INDEX IF NOT EXISTS idx_recommendations_sid ON recommendations(student_id, is_active);
CREATE INDEX IF NOT EXISTS idx_study_plans_sid ON study_plans(student_id, is_active);
CREATE INDEX IF NOT EXISTS idx_study_tasks_plan ON study_tasks(plan_id);
CREATE INDEX IF NOT EXISTS idx_study_tasks_schedule ON study_tasks(student_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_attempt ON quiz_attempt_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_question ON quiz_attempt_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_question ON mistakes(question_id);
CREATE INDEX IF NOT EXISTS idx_progress_history_sid_date ON progress_history(student_id, recorded_date);


