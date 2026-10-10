# ELEVΛLTE — Quickstart & Demonstration Guide

Follow these steps to run ElevAlte locally for hackathon demonstration.

---

## 1. Prerequisites
- **Node.js**: v18+ (Installed at `$LOCALAPPDATA\nodejs`)
- **Python**: 3.11+ (Installed at `$LOCALAPPDATA\Programs\Python311`)

---

## 2. Launching Backend (FastAPI)

```powershell
# In PowerShell:
$env:PATH = "C:\Users\yande\AppData\Local\Programs\Python311;C:\Users\yande\AppData\Local\Programs\Python311\Scripts;" + $env:PATH
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

- **Health Check**: `http://127.0.0.1:8000/health`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/api/v1/docs`
- **ReDoc**: `http://127.0.0.1:8000/api/v1/redoc`

---

## 3. Launching Frontend (Next.js 14)

```powershell
# In PowerShell:
$env:PATH = "C:\Users\yande\AppData\Local\nodejs;" + $env:PATH
cd frontend
npm run dev
```

Open your browser at **`http://localhost:3000`**:
- `/` — Interactive Landing Page with Live Student Preview
- `/login` — Login Screen (live JWT authentication)
- `/register` — Account Registration
- `/onboarding` — 5-Step Academic Calibration
- `/dashboard` — Main Student Success Command Center (Live ML recommendations & dynamic adaptive plan alert)
- `/ai-tutor` — Conversational AI Academic Study Buddy with live student context
- `/study-plan` — Spaced Repetition Calendar & Regenerate modal
- `/practice` — AI Quiz Generator & Diagnostic Test Runner
- `/mistakes` — Mistakes Tracker & Repetition Counters
- `/progress` — Recharts Analytics & Mastery Breakdown
- `/resources` — Resource Library with AI Recommended badges
- `/achievements` — Student Milestones & XP Level Progress
- `/profile` — Academic Profile & Goal Editor
- `/settings` — Preferences, Study Alerts & AI Toggles

---

## 4. Running Automated Tests

Run the full end-to-end test suite (32 test cases, 100% pass rate):
```powershell
$env:PATH = "C:\Users\yande\AppData\Local\Programs\Python311;C:\Users\yande\AppData\Local\Programs\Python311\Scripts;" + $env:PATH
python -m pytest tests -v
```

All 32 test cases execute and validate API endpoints, security sanitization, BKT mastery updates, learning gap classification, and end-to-end hackathon data flow.

---

## 5. End-to-End Hackathon Live Demo Script

Demonstrate the real closed-loop AI adaptation in under 2 minutes:

1. **Check Initial Dashboard (`/dashboard`)**:
   - Initial topic state: Graphs = 38% mastery, AVL Trees = 52%, Arrays = 91%.
   - Notice the AI Recommendation points directly to **Graphs** due to upcoming exam in 12 days and low baseline mastery.
2. **Take Diagnostic Quiz (`/practice`)**:
   - Select topic: **Graphs**.
   - Notice questions are fetched dynamically without answers leaked in client payload.
   - Intentionally select incorrect answers on questions 2, 3, and 4 (score: 1/4 = 25%).
   - Click **Submit Quiz**.
3. **Inspect Real-Time AI Feedback Banner**:
   - Dynamic banner displays BKT mastery recalibration, Learning Gap classification (`HIGH_PRIORITY`), and recommendation to focus on Graph Traversal.
4. **Inspect Mistake Tracker (`/mistakes`)**:
   - 3 missed questions are automatically recorded with mistake repetition counters incremented and detailed explanations.
5. **Inspect Dynamic Study Plan Recalibration (`/study-plan`)**:
   - Day 1 tasks have automatically adapted: 75 minutes of Graph intervention tasks front-loaded, while Arrays revision is scaled down.
6. **Return to Dashboard (`/dashboard`)**:
   - Top banner displays: *"✨ AI Adaptive Engine: Your study plan was dynamically recalibrated based on your latest diagnostic quiz results."*
7. **Ask AI Study Buddy (`/ai-tutor`)**:
   - Click "Why Graphs?" or ask *"What should I study today?"*.
   - AI Study Buddy provides personalized guidance referencing the student's exact 38% mastery, 4 mistakes, and 12 days until exams.
