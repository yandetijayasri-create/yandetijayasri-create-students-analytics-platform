# ELEVΛLTE — System Architecture

> **Tagline**: Learn Smarter • Grow Faster • Achieve More  
> **Platform Category**: Intelligent EdTech SaaS & Academic Success Platform

---

## 1. High-Level System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      Next.js 14 Web Frontend                           │
│  (React 18 • TypeScript • Tailwind CSS • Framer Motion • Recharts)     │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ HTTP / REST / JSON
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FastAPI Backend Engine                          │
│     (Python 3.11 • Pydantic v2 • Starlette • Uvicorn ASGI Server)      │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼                                 ▼
┌────────────────────────────────────┐  ┌────────────────────────────────┐
│           AI & ML Engine           │  │       Database Layer           │
│  - Bayesian Knowledge Tracing     │  │  - PostgreSQL / SQLite Schemas │
│  - Learning Gap Classifier         │  │  - Migration & Seed System     │
│  - Adaptive Schedule Optimizer     │  │  - Student Telemetry Storage   │
│  - Recommendation Ranker           │  └────────────────────────────────┘
└────────────────────────────────────┘
```

---

## 2. Core Educational Feedback Loop

ElevAlte operates on an active feedback loop that answers four fundamental student questions:

```text
       GOAL           ───►  "What is my target?"
        ↓
       PLAN           ───►  "What should I study today?"
        ↓
      LEARN           ───►  "How do I understand this concept?"
        ↓
    PRACTICE          ───►  "Can I solve diagnostic problems?"
        ↓
    ANALYZE (ML)      ───►  "What are my hidden weaknesses?"
        ↓
    ADAPT (AI)        ───►  "What should I do next?"
```

---

## 3. Directory Layout & Module Responsibilities

```text
ElevAlte/
├── frontend/     # Next.js App Router, responsive SaaS UI, Recharts analytics
├── backend/      # FastAPI REST endpoints matching frontend lib/api.ts contracts
├── ai-ml/        # Algorithms (BKT, Gap Classifier, Schedule Optimizer, Ranker)
├── database/     # Relational schema, indices, sample student seed data
├── tests/        # Pytest test suite covering endpoints & ML algorithms
├── docs/         # Architecture, API specifications, and quickstart guides
├── .env.example  # Global environment variables template
├── .gitignore    # Rules for Python, Node, checkpoints, and secrets
└── README.md     # Project overview
```
