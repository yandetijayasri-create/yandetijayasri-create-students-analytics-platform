"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Calendar,
  Flame,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Target,
  BookOpen,
  PenTool,
  BrainCircuit,
  Plus,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { ProgressBar } from "@/components/common/ProgressBar";
import { StudyTaskItem } from "@/components/dashboard/StudyTaskItem";
import { AIRecommendationCard } from "@/components/dashboard/AIRecommendationCard";
import { LearningGapCard } from "@/components/dashboard/LearningGapCard";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { getDashboard, completeStudyTask, DashboardData } from "@/lib/api";
import { StudyTask } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = () => {
    getDashboard()
      .then((res) => {
        setData(res);
        setTasks(res.todayTasks);
        setError(null);
      })
      .catch((err) => {
        console.warn("Failed to load dashboard:", err);
        setError("Unable to load latest dashboard insights. Using cached/demo mode.");
      });
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleToggleTask = async (taskId: string) => {
    try {
      await completeStudyTask(taskId);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      );
    } catch (e) {
      console.warn("Complete task error:", e);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      );
    }
  };

  const handleStartTask = (task: StudyTask) => {
    if (task.type === "Practice") {
      router.push("/practice");
    } else if (task.type === "Review") {
      router.push("/mistakes");
    } else {
      router.push("/ai-tutor");
    }
  };

  if (!data) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-20 bg-white rounded-2xl border border-slate-200/80" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200/80" />
            ))}
          </div>
          <div className="h-48 bg-white rounded-2xl border border-slate-200/80" />
        </div>
      </AppLayout>
    );
  }

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* ==================================================== */}
        {/* GREETING & HEADER */}
        {/* ==================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              Good Morning, {data.profile.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Here&apos;s what matters most for your learning today.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Link href="/study-plan">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Calendar className="w-3.5 h-3.5" />}
              >
                View Study Plan
              </Button>
            </Link>
            <Link href="/ai-tutor">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Study Session
              </Button>
            </Link>
          </div>
        </div>

        {/* ==================================================== */}
        {/* DYNAMIC ADAPTIVE PLAN BANNER (AI/ML RECALIBRATED)   */}
        {/* ==================================================== */}
        {data.planAdapted && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-brand-50 via-indigo-50/40 to-purple-50 border border-brand-200/80 shadow-2xs animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-100/80 px-2.5 py-0.5 rounded-full border border-brand-200">
                    AI Adaptive Engine
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Real-time Recalibration</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-medium mt-0.5">
                  {data.planAdaptedMessage || "Your study plan was dynamically recalibrated based on your latest diagnostic quiz results. Urgent intervention tasks have been front-loaded for weak topics."}
                </p>
              </div>
            </div>
            <Link href="/study-plan" className="self-end sm:self-auto shrink-0">
              <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Review Adapted Schedule
              </Button>
            </Link>
          </div>
        )}

        {/* ==================================================== */}
        {/* CURRENT GOAL BANNER */}
        {/* ==================================================== */}
        <Card className="p-5 sm:p-6 bg-gradient-to-r from-white via-indigo-50/20 to-white border-brand-200/60 shadow-subtle">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                    Current Goal
                  </span>
                  <span className="text-xs text-amber-700 font-semibold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {data.profile.daysRemaining} days remaining
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {data.profile.targetGoal}
                </h3>
                <p className="text-xs text-slate-500">
                  Target: {data.profile.targetScore} • {data.profile.examName}
                </p>
              </div>
            </div>

            <div className="md:w-72 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                <span className="text-slate-600">Goal Preparedness</span>
                <span className="text-brand-600 font-bold">78%</span>
              </div>
              <ProgressBar value={78} color="brand" size="md" />
              <span className="text-[10px] text-slate-400 mt-1.5 block">
                On track to achieve target grade with current pace
              </span>
            </div>
          </div>
        </Card>

        {/* ==================================================== */}
        {/* TODAY'S OVERVIEW STAT CARDS */}
        {/* ==================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 sm:p-5 border-slate-200/90">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold text-slate-500">Study Time</span>
              <Clock className="w-4 h-4 text-brand-600" />
            </div>
            <p className="text-2xl font-bold font-display text-slate-900">
              {data.stats.studyTimeToday}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              +35m vs daily average
            </p>
          </Card>

          <Card className="p-4 sm:p-5 border-slate-200/90">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold text-slate-500">Tasks Completed</span>
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold font-display text-slate-900">
              {completedCount} / {tasks.length}
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              {Math.round((completedCount / tasks.length) * 100)}% daily quota done
            </p>
          </Card>

          <Card className="p-4 sm:p-5 border-slate-200/90">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold text-slate-500">Quiz Accuracy</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold font-display text-emerald-600">
              {data.stats.quizAccuracy}%
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              ↑ 4% this week
            </p>
          </Card>

          <Card className="p-4 sm:p-5 border-slate-200/90">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold text-slate-500">Study Streak</span>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-2xl font-bold font-display text-slate-900">
              {data.stats.streakDays} Days
            </p>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">
              Personal record streak!
            </p>
          </Card>
        </div>

        {/* ==================================================== */}
        {/* AI RECOMMENDATION (HIGHLIGHTED HERO CARD) */}
        {/* ==================================================== */}
        <div>
          <AIRecommendationCard recommendation={data.recommendation} />
        </div>

        {/* ==================================================== */}
        {/* TODAY'S STUDY PLAN & RECENT ACTIVITY */}
        {/* ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Today's Tasks (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Today&apos;s Study Plan
                </h3>
                <p className="text-xs text-slate-500">
                  Curated sequence to maximize retention and exam readiness
                </p>
              </div>
              <Link
                href="/study-plan"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>Full Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <StudyTaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleTask}
                  onStartTask={handleStartTask}
                />
              ))}
            </div>
          </div>

          {/* Recent Activity (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Recent Activity
                </h3>
                <p className="text-xs text-slate-500">
                  Latest study milestones and quiz submissions
                </p>
              </div>
              <Link
                href="/progress"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <Card className="p-4 border-slate-200/90">
              <RecentActivityList activities={data.recentActivities} />
            </Card>
          </div>
        </div>

        {/* ==================================================== */}
        {/* LEARNING GAPS (ML DIAGNOSTIC SECTION) */}
        {/* ==================================================== */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Learning Gaps Detected
                </h3>
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Identified automatically by our ML engine from your recent quiz mistakes
              </p>
            </div>
            <Link
              href="/mistakes"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View Mistake Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.learningGaps.slice(0, 4).map((gap) => (
              <LearningGapCard key={gap.id} gap={gap} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
