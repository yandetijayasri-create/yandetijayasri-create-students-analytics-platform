# ELEVΛLTE — API Reference Specification

Base URL: `http://localhost:8000/api/v1`  
Root Endpoints: `http://localhost:8000/` and `http://localhost:8000/health`  
Interactive Docs: `http://localhost:8000/docs` and `http://localhost:8000/redoc`

---

## 1. System & Health Check

### `GET /health` (or `GET /api/v1/health`)
- **Description**: Returns server operational status and platform metadata.
- **Response**: `200 OK`
  ```json
  {
    "status": "healthy",
    "platform": "ELEVΛLTE",
    "version": "1.0.0"
  }
  ```

---

## 2. Authentication (`/api/v1/auth`)

### `POST /api/v1/auth/register`
- **Description**: Registers a new student account, hashes the password securely, initializes baseline profile, and issues a JWT Bearer token.
- **Request Body**:
  ```json
  {
    "name": "Alex Johnson",
    "email": "alex.johnson@university.edu",
    "password": "securepassword123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "token": "<jwt_access_token>",
    "user_id": "std_001",
    "email": "alex.johnson@university.edu",
    "name": "Alex Johnson"
  }
  ```
- **Status Codes**: `200 OK`, `400 Bad Request` (Email already registered), `500 Internal Server Error`.

### `POST /api/v1/auth/login`
- **Description**: Verifies credentials and returns a valid JWT token.
- **Request Body**:
  ```json
  {
    "email": "alex.johnson@university.edu",
    "password": "securepassword123"
  }
  ```
- **Response**: `200 OK` (AuthResponse with token).
- **Status Codes**: `200 OK`, `401 Unauthorized` (Invalid email or password).

### `GET /api/v1/auth/me`
- **Description**: Returns identity of the authenticated user.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` (UserMeResponse).

---

## 3. Profile & Onboarding (`/api/v1/profile`)

### `GET /api/v1/profile`
- **Description**: Retrieves student profile attributes (course, branch, year, semester, streak, hours, target score).
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` (StudentResponse).

### `PUT /api/v1/profile`
- **Description**: Updates profile details or target goals.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: Partial update object (e.g. `{ "name": "...", "target_score": "..." }`).
- **Response**: `200 OK`.

### `POST /api/v1/profile/onboarding`
- **Description**: Calibrates student onboarding data, initializes enrolled subjects, invokes Study Plan Optimizer to create the first adaptive schedule, and awards 100 XP.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "Alex Johnson",
    "course": "Bachelor of Technology",
    "branch": "Computer Science & Engineering",
    "year": "3rd Year",
    "semester": "5th Semester",
    "subjects": ["Data Structures", "DBMS", "Operating Systems"],
    "goal": "Prepare for Semester Exams",
    "available_study_time": "2 hours",
    "preferred_study_time": "Evening",
    "exam_date": "2026-10-21",
    "target_score": "90%"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "status": "success",
    "student": { ... },
    "study_plan": [ ... ],
    "message": "Personalized study plan successfully generated!"
  }
  ```

---

## 4. Dashboard (`/api/v1/dashboard`)

### `GET /api/v1/dashboard`
- **Description**: Consolidated single-call dashboard payload: student profile, today's tasks, top AI recommendation (with impact score and reason), classified learning gaps, recent activities, and high-level stats.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` (DashboardResponse).

---

## 5. Study Plan (`/api/v1/study-plan`)

### `GET /api/v1/study-plan`
- **Description**: Retrieves the 7-day optimized schedule with task durations, subjects, and completion flags.
- **Response**: `200 OK` (List of StudyPlanDaySchema).

### `POST /api/v1/study-plan/generate`
- **Description**: Triggers the AI/ML Study Plan Optimizer to recalculate schedule based on performance shifts or updated hours.
- **Request Body**:
  ```json
  {
    "reason": "Recalibrated post quiz analysis",
    "hoursPerDay": 2.5,
    "examDate": "2026-10-21"
  }
  ```
- **Response**: `200 OK` (List of StudyPlanDaySchema).

### `POST /api/v1/study-plan/{task_id}/complete`
- **Description**: Marks task complete, adds study minutes, awards XP, and records activity.
- **Response**: `200 OK`
  ```json
  {
    "status": "success",
    "task_id": "task_1",
    "completed": true,
    "xpGained": 35,
    "totalXp": 1275,
    "message": "Task marked as completed! XP awarded."
  }
  ```

---

## 6. Diagnostic Quizzes & Submissions (`/api/v1/quiz`)

### `POST /api/v1/quiz/generate`
- **Description**: Generates diagnostic quiz questions. **Zero Answer Leakage**: correct answers and explanations are scrubbed.
- **Request Body**:
  ```json
  {
    "subject": "Data Structures",
    "topic": "Graphs",
    "difficulty": "Medium",
    "count": 5
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "quiz_id": "quiz_7_graphs",
    "topic": "Graphs",
    "subject": "Data Structures",
    "questions": [
      {
        "id": 1,
        "subject": "Data Structures & Algorithms",
        "topic": "Graphs",
        "difficulty": "Medium",
        "question": "Which data structure is primarily utilized to implement BFS?",
        "options": [
          { "id": "A", "text": "Stack" },
          { "id": "B", "text": "Queue" },
          { "id": "C", "text": "Binary Heap" },
          { "id": "D", "text": "Hash Table" }
        ]
      }
    ],
    "total_questions": 1
  }
  ```

### `POST /api/v1/quiz/submit`
- **Description**: Submits student answers, calculates accuracy, updates latent topic mastery using Bayesian Knowledge Tracing (BKT), classifies learning gaps, re-ranks recommendations, recalibrates study plan, logs mistakes, and awards XP.
- **Request Body**:
  ```json
  {
    "answers": [
      { "questionId": 1, "selectedAnswer": "B" },
      { "questionId": 2, "selectedAnswer": "A" }
    ],
    "timeSpentSeconds": 120,
    "student_id": "std_001"
  }
  ```
- **Response**: `200 OK` (QuizResultResponse containing score, accuracy, question details, updatedMastery, topRecommendation, learningGaps).

---

## 7. Learning Gaps & Recommendations

### `GET /api/v1/recommendations`
- **Description**: Returns prioritized topic recommendations ranked by impact score `(1 - Mastery) * ExamWeight * Urgency * MistakePenalty`.
- **Response**: `200 OK`.

---

## 8. Mistakes Tracker (`/api/v1/mistakes`)

### `GET /api/v1/mistakes`
- **Description**: Lists aggregated repeat misconceptions with student answer, correct answer, recurrence count, and AI diagnostic explanations.
- **Response**: `200 OK` (List of MistakeItem).

### `POST /api/v1/mistakes/{mistake_id}/retry`
- **Description**: Prepares a targeted practice URL for the weak topic.
- **Response**: `200 OK` (`{ "status": "ready", "practice_url": "/practice?topic=graphs" }`).

---

## 9. Progress Analytics (`/api/v1/progress`)

### `GET /api/v1/progress`
- **Description**: Telemetry metrics powering Recharts dashboards:
  - `overallMastery`: Dynamic syllabus mastery average
  - `weeklyStudyTime`: Daily hours vs daily target
  - `subjectPerformance`: Syllabus subject breakdown
  - `topicMastery`: Categorized as `STRONG`, `NEEDS_PRACTICE`, `HIGH_PRIORITY`
  - `performanceTrend`: Historic scores + ML predicted score trajectory
  - `heatmapDays`: Activity consistency heatmap data
- **Response**: `200 OK` (ProgressAnalyticsResponse).

---

## 10. AI Study Buddy (`/api/v1/ai/ask`)

### `POST /api/v1/ai/ask`
- **Description**: Queries academic AI assistant. When external LLM keys are unset, falls back to built-in academic knowledge engine.
- **Request Body**:
  ```json
  {
    "message": "Explain BFS vs DFS traversal in simple terms",
    "topic": "Graphs",
    "student_id": "std_001"
  }
  ```
- **Response**: `200 OK` (AIMessageResponse with structured concept breakdown, algorithm steps, and quickAction buttons).

---

## 11. Learning Resources (`/api/v1/resources`)

### `GET /api/v1/resources`
- **Query Parameters**: `subject`, `topic`, `resource_type`, `search`.
- **Response**: `200 OK` (List of ResourceSchema with AI recommended flags).
