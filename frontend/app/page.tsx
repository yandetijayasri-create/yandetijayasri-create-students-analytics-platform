"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Target,
  Calendar,
  BookOpen,
  CheckCircle2,
  BarChart3,
  RefreshCw,
  Bot,
  BrainCircuit,
  Layers,
  Compass,
  Sliders,
  Award,
  AlertTriangle,
  Lightbulb,
  TrendingDown,
  TrendingUp,
  Cpu,
  Flame,
  ChevronRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export default function LandingPage() {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  const workflowSteps = [
    {
      title: "GOAL",
      desc: "Define your exams, syllabus modules, target GPA, or competitive milestones.",
      icon: Target,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "PLAN",
      desc: "AI auto-schedules daily bite-sized study blocks mapped to your exam countdown.",
      icon: Calendar,
      color: "from-indigo-600 to-purple-600",
    },
    {
      title: "LEARN",
      desc: "Grasp complex concepts rapidly with conversational AI and smart concise notes.",
      icon: BookOpen,
      color: "from-purple-600 to-pink-600",
    },
    {
      title: "PRACTICE",
      desc: "Test active recall with dynamic diagnostic quizzes and instant feedback.",
      icon: CheckCircle2,
      color: "from-pink-600 to-rose-600",
    },
    {
      title: "ANALYZE",
      desc: "ML algorithms compute topic mastery, detecting hidden weaknesses in real time.",
      icon: BarChart3,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "ADAPT",
      desc: "Study plans automatically adjust so you spend time only where it counts most.",
      icon: RefreshCw,
      color: "from-emerald-500 to-teal-600",
    },
  ];

  const features = [
    {
      icon: Bot,
      title: "AI Study Buddy",
      desc: "Ask syllabus questions and receive simple, step-by-step explanations anytime.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Calendar,
      title: "Personalized Study Plan",
      desc: "Generate dynamic schedules based on your goals, exam dates, and daily availability.",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      icon: BookOpen,
      title: "Smart Notes",
      desc: "Turn lengthy textbook material and dense lectures into crisp revision cards.",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: CheckCircle2,
      title: "AI Quiz Generator",
      desc: "Generate customized topic-wise practice quizzes with immediate explanation keys.",
      color: "bg-pink-50 text-pink-600",
    },
    {
      icon: AlertTriangle,
      title: "Learning Gap Detection",
      desc: "Identify weak concepts from quiz mistakes before they hurt your exam grade.",
      color: "bg-rose-50 text-rose-600",
    },
    {
      icon: Sparkles,
      title: "Adaptive Recommendations",
      desc: "Intelligently recommends the single highest-impact task you should study next.",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      desc: "Visualize study time, mastery trends, quiz accuracy, and momentum metrics.",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: RefreshCw,
      title: "Mistake Tracker",
      desc: "Logs recurring mistakes automatically so you can conduct targeted revision sprints.",
      color: "bg-sky-50 text-sky-600",
    },
  ];

  const timelineSteps = [
    {
      num: "01",
      title: "Set Your Goal",
      desc: "Input your college branch, target exam date, and daily study availability.",
    },
    {
      num: "02",
      title: "Get Your Plan",
      desc: "Receive an AI-structured syllabus breakdown spaced across your preparation calendar.",
    },
    {
      num: "03",
      title: "Learn & Practice",
      desc: "Study with interactive AI explanations and take adaptive diagnostic quizzes.",
    },
    {
      num: "04",
      title: "Review Your Progress",
      desc: "ML models isolate specific conceptual gaps and track retention decay.",
    },
    {
      num: "05",
      title: "Adapt & Improve",
      desc: "Your plan dynamically updates to reinforce weaknesses until mastery is locked in.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* ---------------------------------------------------- */}
      {/* STICKY HEADER */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-purple flex items-center justify-center text-white font-bold text-base shadow-sm">
              Λ
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-wider text-slate-900 font-display">
                ELEV<span className="text-brand-600">Λ</span>LTE
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                AI Student Platform
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-brand-600 transition-colors">
              How It Works
            </a>
            <a href="#solution" className="hover:text-brand-600 transition-colors">
              Why ElevAlte
            </a>
            <a href="#engine" className="hover:text-brand-600 transition-colors">
              AI + ML Engine
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
                <span>Next-Gen EdTech SaaS for College Students</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 font-display tracking-tight leading-[1.12]">
                Your AI-Powered Path to{" "}
                <span className="gradient-text">Academic Success</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Learn smarter with personalized study plans, AI guidance, adaptive practice,
                and intelligent progress insights — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto shadow-md hover:shadow-lg hover:scale-102 transition-all"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Get Started Free
                  </Button>
                </Link>
                <a href="#features" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore Features
                  </Button>
                </a>
              </div>

              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold pt-2">
                Plan • Learn • Practise • Improve
              </p>
            </div>

            {/* Right: Realistic Animated Student Dashboard Preview */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Dashboard Mockup Container */}
                <div className="bg-white/95 rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200/90 backdrop-blur-md animate-float">
                  {/* Top Bar of Preview */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold flex items-center justify-center text-xs">
                        A
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Alex • Fall Final Exams</p>
                        <p className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-amber-500 text-amber-500" /> 12 Days Remaining
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Overall Progress</span>
                      <p className="text-base font-extrabold text-brand-600">78% Complete</p>
                    </div>
                  </div>

                  {/* AI Recommendation Alert */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-900 to-indigo-900 text-white mb-4 shadow-sm border border-brand-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-brand-300" />
                      <span className="text-[11px] font-bold text-brand-200 uppercase tracking-wide">
                        AI Recommended Action
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white">Focus on Graph Traversal today.</p>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                      Recent quiz accuracy is 42%. High impact for your 12-day exam countdown.
                    </p>
                  </div>

                  {/* Two Column stats inside preview */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 font-medium">Today&apos;s Plan</span>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">Learn: Graph Traversal</p>
                      <span className="text-[10px] text-brand-600 font-semibold">30 min • High Priority</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 font-medium">Latest Quiz Score</span>
                      <p className="text-xs font-bold text-emerald-600 mt-0.5">7 / 10 (70% Acc)</p>
                      <span className="text-[10px] text-slate-400">3 mistakes tracked</span>
                    </div>
                  </div>

                  {/* Weak Topics Bar */}
                  <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700 mb-1.5">
                      <span>Learning Gaps Detected</span>
                      <span className="text-rose-600">Graphs 42% • DBMS 58%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-rose-500 h-full" style={{ width: "42%" }} />
                      <div className="bg-amber-400 h-full" style={{ width: "26%" }} />
                      <div className="bg-emerald-500 h-full" style={{ width: "32%" }} />
                    </div>
                  </div>
                </div>

                {/* Decorative floating badges */}
                <div className="absolute -bottom-4 -left-4 bg-white px-3.5 py-2 rounded-xl shadow-lg border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2 animate-bounce">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Adaptive Plan Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* PROBLEM SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              The Modern Student Struggle
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight mt-3">
              Students don&apos;t need more apps. <br className="hidden sm:inline" />
              They need one clear learning journey.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border-slate-200/80 hover:shadow-card transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-6 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">1. Too Many Tools</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Notes, videos, calendars, AI tools and practice platforms are scattered across different places,
                leaving students exhausted before they even start studying.
              </p>
            </Card>

            <Card className="p-8 border-slate-200/80 hover:shadow-card transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-6 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">2. No Clear Direction</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Students often don&apos;t know what they should study next or which topics need urgent attention,
                wasting precious hours on already-mastered concepts.
              </p>
            </Card>

            <Card className="p-8 border-slate-200/80 hover:shadow-card transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-105 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">3. Generic Support</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                One-size-fits-all learning doesn&apos;t adapt to every student&apos;s pace, level, or goals. Standard
                chatbots lack memory of syllabus requirements and exam deadlines.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SOLUTION WORKFLOW SECTION */}
      {/* ---------------------------------------------------- */}
      <section id="solution" className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              The ElevAlte Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight mt-3">
              Meet ElevAlte
            </h2>
            <p className="text-base text-slate-600 mt-2">
              One intelligent space that turns learning activity into personalized action.
            </p>
          </div>

          {/* Workflow Interactive Pipeline */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-400 hover:shadow-card transition-all group"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-xs mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Step {idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FEATURES SECTION (8 CARDS) */}
      {/* ---------------------------------------------------- */}
      <section id="features" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Engineered for Mastery
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight mt-3">
              Everything a student needs to succeed
            </h2>
            <p className="text-base text-slate-600 mt-2">
              A comprehensive toolkit combining generative AI clarity with machine learning precision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card
                  key={idx}
                  className="p-6 border-slate-200/80 hover:shadow-card hover:-translate-y-1 transition-all group"
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* HOW IT WORKS TIMELINE */}
      {/* ---------------------------------------------------- */}
      <section id="how-it-works" className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Intelligent Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight mt-3">
              Your learning journey, intelligently connected.
            </h2>
          </div>

          <div className="relative">
            {/* Timeline cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
              {timelineSteps.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-subtle hover:border-brand-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-2xl font-black text-brand-600 font-display mb-3 block">
                      {item.num}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1 text-[11px] text-brand-600 font-semibold">
                    <span>Phase {idx + 1}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* AI + ML DIFFERENTIATOR */}
      {/* ---------------------------------------------------- */}
      <section id="engine" className="py-20 md:py-28 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Deep Technical Moat
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight mt-3">
              More than an AI chatbot
            </h2>
            <p className="text-base text-slate-600 mt-2">
              Most platforms just wrap ChatGPT. ElevAlte marries Generative AI synthesis with
              predictive Machine Learning diagnostics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
            {/* AI Engine Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-indigo-50/70 to-purple-50/40 p-8 rounded-3xl border border-indigo-100 shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">AI ENGINE</h3>
                  <span className="text-xs text-indigo-700 font-medium">Generative Intelligence</span>
                </div>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-700">
                {[
                  "Explains tough concepts with step-by-step clarity",
                  "Generates concise, exam-ready revision summaries",
                  "Creates syllabus-specific multi-tier quizzes",
                  "Builds customized multi-week study schedules",
                  "Answers questions with context-aware references",
                ].map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Center STUDENT Hub */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center py-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase tracking-wider shadow-lg ring-4 ring-brand-100 animate-pulse">
                STUDENT
              </div>
              <div className="hidden lg:flex flex-col items-center text-[10px] font-bold text-slate-400 mt-2">
                <span>↕</span>
                <span>DATA</span>
              </div>
            </div>

            {/* ML Engine Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 p-8 rounded-3xl border border-emerald-100 shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">ML ENGINE</h3>
                  <span className="text-xs text-emerald-700 font-medium">Diagnostic Analytics</span>
                </div>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-700">
                {[
                  "Detects specific knowledge gaps and misconception clusters",
                  "Calculates dynamic topic mastery percentage scores",
                  "Analyzes multi-week performance trends and retention decay",
                  "Prioritizes high-impact weak topics ahead of deadlines",
                  "Personalizes recommendation weights using test telemetry",
                ].map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feedback loop strip */}
          <div className="mt-8 p-4 bg-slate-100 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-around gap-2 text-xs font-semibold text-slate-700 text-center">
            <span>Student Data</span>
            <span className="text-brand-600">→</span>
            <span>AI + ML Processing</span>
            <span className="text-brand-600">→</span>
            <span>Personalized Learning</span>
            <span className="text-brand-600">→</span>
            <span className="text-emerald-700 font-bold">Better Exam Results</span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* CALL TO ACTION */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-brand-950 via-slate-950 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
            Know what to study. <br />
            <span className="gradient-text">Know why it matters.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Let ElevAlte turn your academic goals into a personalized learning journey.
            No more second-guessing what to revise next.
          </p>

          <div className="pt-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-8 shadow-xl hover:scale-105 transition-all"
                rightIcon={<ArrowRight className="w-4 h-4 text-slate-950" />}
              >
                Start Learning Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* FOOTER */}
      {/* ---------------------------------------------------- */}
      <footer className="bg-white border-t border-slate-200 py-12 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                Λ
              </div>
              <span className="font-extrabold text-base tracking-wider text-slate-900 font-display">
                ELEV<span className="text-brand-600">Λ</span>LTE
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
              <a href="#features" className="hover:text-brand-600 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-brand-600 transition-colors">
                How It Works
              </a>
              <a href="#solution" className="hover:text-brand-600 transition-colors">
                About
              </a>
              <Link href="/privacy" className="hover:text-brand-600 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-brand-600 transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-brand-600 transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-slate-400">
              © {new Date().getFullYear()} ELEVΛLTE. All rights reserved.
            </p>
            <p className="font-medium text-slate-500">
              Learn Smarter • Grow Faster • Achieve More
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
