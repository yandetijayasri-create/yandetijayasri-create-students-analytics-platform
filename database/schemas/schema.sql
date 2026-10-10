-- ==============================================================================
-- ELEVΛLTE — Relational Database Schema (PostgreSQL)
-- AI-Powered Student Success Platform
-- ==============================================================================

CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    course VARCHAR(128) NOT NULL,
    branch VARCHAR(128) NOT NULL,
    year VARCHAR(64) NOT NULL,
    semester VARCHAR(64) NOT NULL,
    target_goal VARCHAR(255) NOT NULL,
    exam_name VARCHAR(255) NOT NULL,
    exam_date DATE NOT NULL,
    target_score VARCHAR(64) NOT NULL,
    daily_study_hours VARCHAR(64) NOT NULL,
    preferred_time VARCHAR(128) NOT NULL,
    streak_days INTEGER DEFAULT 0,
    total_study_minutes INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    level_title VARCHAR(128) DEFAULT 'Novice Learner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    mastery_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(64) PRIMARY KEY,
    subject_id VARCHAR(64) REFERENCES subjects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    mastery_percentage INTEGER DEFAULT 0,
    accuracy_percentage INTEGER DEFAULT 0,
    category VARCHAR(32) DEFAULT 'NEEDS_PRACTICE', -- STRONG, NEEDS_PRACTICE, HIGH_PRIORITY
    priority VARCHAR(16) DEFAULT 'MEDIUM', -- HIGH, MEDIUM, LOW
    trend VARCHAR(16) DEFAULT 'stable', -- improving, stable, declining
    last_practiced_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS study_plans (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS study_tasks (
    id VARCHAR(64) PRIMARY KEY,
    plan_id VARCHAR(64) REFERENCES study_plans(id) ON DELETE CASCADE,
    topic_id VARCHAR(64) REFERENCES topics(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    task_type VARCHAR(32) NOT NULL, -- Learn, Practice, Review
    duration_minutes INTEGER NOT NULL,
    scheduled_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    xp_reward INTEGER DEFAULT 30,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    topic_id VARCHAR(64) REFERENCES topics(id) ON DELETE CASCADE,
    difficulty VARCHAR(16) NOT NULL, -- Easy, Medium, Hard
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL,
    explanation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    total_questions INTEGER NOT NULL,
    correct_count INTEGER NOT NULL,
    accuracy_percentage INTEGER NOT NULL,
    time_spent_seconds INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mistakes (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    mistake_count INTEGER DEFAULT 1,
    student_last_answer TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    last_attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS progress_history (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    recorded_date DATE NOT NULL,
    study_minutes INTEGER NOT NULL,
    overall_mastery INTEGER NOT NULL,
    quiz_accuracy INTEGER NOT NULL,
    activities_completed INTEGER NOT NULL
);

-- Indices for performance optimization
CREATE INDEX IF NOT EXISTS idx_student_subjects ON subjects(student_id);
CREATE INDEX IF NOT EXISTS idx_subject_topics ON topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_tasks_schedule ON study_tasks(scheduled_date, is_completed);
CREATE INDEX IF NOT EXISTS idx_mistakes_student ON mistakes(student_id, is_resolved);
