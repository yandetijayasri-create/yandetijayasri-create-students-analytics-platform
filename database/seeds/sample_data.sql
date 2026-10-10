-- ==============================================================================
-- ElevAlte Mock Student Seed Data
-- ==============================================================================

INSERT INTO students (
    id, name, email, avatar_url, course, branch, year, semester,
    target_goal, exam_name, exam_date, target_score, daily_study_hours,
    preferred_time, streak_days, total_study_minutes, xp, level, level_title
) VALUES (
    'std_001',
    'Alex',
    'alex.johnson@university.edu',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    'Bachelor of Technology',
    'Computer Science & Engineering',
    '3rd Year',
    '5th Semester',
    'Prepare for Semester Exams',
    'Fall Semester Final Exams',
    '2026-10-21',
    '9.2 CGPA / 90%',
    '2 hours',
    'Evening (6 PM - 10 PM)',
    7,
    755,
    1240,
    8,
    'Consistent Learner'
) ON CONFLICT (id) DO NOTHING;
