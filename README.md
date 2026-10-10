# ELEVΛLTE

> **Learn Smarter • Grow Faster • Achieve More**

ELEVΛLTE is a modern, AI-powered student success platform engineered for college undergraduates. It connects goal setting, adaptive study scheduling, conversational AI tutoring, diagnostic quiz assessments, machine learning learning-gap detection, and mistake tracking into a single, cohesive academic copilot.

---

## 📁 Project Directory Structure

```text
ElevAlte/
│
├── frontend/             # Next.js 14 App Router, TypeScript, Tailwind CSS, Recharts, Framer Motion
│   ├── app/              # 15 Complete Routes: /, login, register, onboarding, dashboard,
│   │                     # ai-tutor, study-plan, practice, mistakes, progress, resources,
│   │                     # achievements, profile, settings, docs
│   ├── components/       # Layout, common, dashboard, quiz, progress, ai components
│   ├── lib/              # api.ts (REST client), mock-data.ts, utils.ts
│   └── types/            # Comprehensive TypeScript interface definitions
│
├── backend/              # FastAPI Python 3.11 Backend
│   ├── app/
│   │   ├── main.py       # FastAPI application factory with CORS middleware
│   │   ├── config.py     # Configuration and settings
│   │   ├── routers/      # REST API endpoints matching frontend contracts
│   │   └── schemas/      # Pydantic v2 validation models
│   └── requirements.txt  # FastAPI, uvicorn, pydantic, httpx
│
├── ai-ml/                # Artificial Intelligence & Machine Learning Engine
│   ├── algorithms/
│   │   ├── gap_classifier.py        # Identifies knowledge gaps & priority tiers
│   │   ├── mastery_engine.py        # Bayesian Knowledge Tracing (BKT) engine
│   │   ├── plan_optimizer.py        # Constrained study schedule optimizer
│   │   └── recommendation_ranker.py # Multi-attribute recommendation scoring
│   └── requirements.txt
│
├── database/             # Relational Database Layer
│   ├── schemas/
│   │   └── schema.sql    # Complete PostgreSQL schema (tables, foreign keys, indices)
│   └── seeds/
│       └── sample_data.sql # Seed data matching Alex Johnson demo student profile
│
├── tests/                # Automated Pytest Test Suite
│   ├── test_api_endpoints.py # End-to-end FastAPI endpoint tests
│   └── test_ml_algorithms.py # Validation of BKT, gap classifier, and plan optimizer
│
├── docs/                 # Documentation & Architecture
│   ├── architecture.md      # High-level architecture and system design
│   ├── api_reference.md     # OpenAPI / REST endpoint specifications
│   ├── ai_ml_methodology.md # Mathematical BKT models & gap scoring formulas
│   └── quickstart.md        # Local execution and hackathon demonstration guide
│
├── .env.example          # Environment variables template
├── .gitignore            # Git exclusion rules for Node, Python, and secrets
└── README.md             # Project documentation
```

---

## 🚀 Quickstart Guide

### 1. Run the Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser to experience the platform.

### 2. Run the Backend (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Interactive OpenAPI Swagger UI is available at **`http://localhost:8000/api/v1/docs`**.

### 3. Run Automated Tests
```powershell
$env:PATH = "C:\Users\yande\AppData\Local\Programs\Python311;C:\Users\yande\AppData\Local\Programs\Python311\Scripts;" + $env:PATH
python -m pytest tests -v
```
All **32 automated tests pass (100% pass rate)**, verifying:
- Live REST API endpoints & JWT authentication
- Bayesian Knowledge Tracing (BKT) probability recalibrations
- Multi-tier Learning Gap Classification (`HIGH_PRIORITY`, `MEDIUM_PRIORITY`, `LOW_PRIORITY`)
- Constrained Study Plan Optimization & weak-topic intervention front-loading
- Complete 14-step End-to-End closed-loop hackathon demonstration

---

## 🏆 Key Innovations

1. **Active Closed-Loop Learning Feedback Loop**:
   - **Goal**: Exam target and target score calibrated during Onboarding.
   - **Plan**: Auto-generated spaced repetition daily schedule with XP rewards.
   - **Learn**: Conversational AI study buddy answering questions with live student analytics context.
   - **Practice**: On-demand adaptive quiz generator with sanitized client payloads (zero answer leakage).
   - **Analyze**: Bayesian Knowledge Tracing isolating misconceptions and mistake counters.
   - **Adapt**: Automatic real-time study plan recalibration front-loading intervention tasks for weak topics.

2. **Presentation & Hackathon Ready**:
   - 100% responsive across desktop, tablet, and mobile with bottom navigation drawer.
   - Dynamic connection pill on Navbar indicating real-time backend status.
   - Interactive charts built with Recharts (Study Time, Subject Mastery, Trajectory, Heatmap).
   - Zero mock dependency when running against FastAPI backend.
