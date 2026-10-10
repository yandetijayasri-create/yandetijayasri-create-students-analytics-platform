"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Minus,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { ProgressBar } from "@/components/common/ProgressBar";
import {
  WeeklyStudyChart,
  SubjectPerformanceChart,
  PerformanceTrendChart,
  StudyConsistencyHeatmap,
} from "@/components/progress/AnalyticsCharts";
import { getProgress } from "@/lib/api";
import { ProgressAnalytics } from "@/types";

export default function ProgressPage() {
  const [data, setData] = useState<ProgressAnalytics | null>(null);

  useEffect(() => {
    getProgress().then(setData);
  }, []);

  if (!data) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-28 bg-white rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-white rounded-2xl" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  const strongTopics = data.topicMastery.filter((t) => t.category === "STRONG");
  const needsPracticeTopics = data.topicMastery.filter((t) => t.category === "NEEDS_PRACTICE");
  const highPriorityTopics = data.topicMastery.filter((t) => t.category === "HIGH_PRIORITY");

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            Progress & Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time telemetry measuring syllabus mastery, active retention, study momentum, and ML predictions.
          </p>
        </div>

        {/* Top 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Overall Mastery</span>
              <Award className="w-4 h-4 text-brand-600" />
            </div>
            <p className="text-3xl font-extrabold font-display text-brand-600">
              {data.overallMastery}%
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              +6% over the last 14 days
            </p>
          </Card>

          <Card className="p-5 border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Total Study Time</span>
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-3xl font-extrabold font-display text-slate-900">
              {data.studyTimeHours}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Across 32 active study sessions
            </p>
          </Card>

          <Card className="p-5 border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Quiz Accuracy</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-extrabold font-display text-emerald-600">
              {data.quizAccuracy}%
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Top 15% percentile in cohort
            </p>
          </Card>

          <Card className="p-5 border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Topics Completed</span>
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-3xl font-extrabold font-display text-slate-900">
              {data.topicsCompleted}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Out of 23 required exam modules
            </p>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Weekly Study Time */}
          <Card className="p-6 border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Weekly Study Time</h3>
                <p className="text-xs text-slate-400">Actual hours vs 2.0h daily target</p>
              </div>
              <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
                15.3h Total
              </span>
            </div>
            <WeeklyStudyChart data={data.weeklyStudyTime} />
          </Card>

          {/* Chart 2: Performance Trend with ML Prediction */}
          <Card className="p-6 border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Score & Mastery Trajectory</h3>
                <p className="text-xs text-slate-400">Historical performance + ML predicted trajectory</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Target: 90%
              </span>
            </div>
            <PerformanceTrendChart data={data.performanceTrend} />
          </Card>

          {/* Chart 3: Subject Performance */}
          <Card className="p-6 border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Subject Performance Distribution</h3>
                <p className="text-xs text-slate-400">Mastery percentages across university courses</p>
              </div>
            </div>
            <SubjectPerformanceChart data={data.subjectPerformance} />
          </Card>

          {/* Chart 4: Study Consistency Heatmap */}
          <Card className="p-6 border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Study Consistency Heatmap</h3>
                  <p className="text-xs text-slate-400">Daily learning sessions over past 20 days</p>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  7-Day Streak
                </span>
              </div>
              <StudyConsistencyHeatmap data={data.heatmapDays} />
            </div>
            <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
              Students who study 5+ consecutive days retain 38% more exam concepts on average.
            </p>
          </Card>
        </div>

        {/* ==================================================== */}
        {/* DEDICATED LEARNING GAP ANALYSIS (PAGE 11 REQUIREMENTS) */}
        {/* ==================================================== */}
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">
                Understand Where You Need to Improve
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                Diagnostic Matrix
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Automated classification into High Priority, Needs Practice, and Strong modules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* HIGH PRIORITY */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b-2 border-rose-500">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  HIGH PRIORITY
                </span>
                <span className="text-xs font-semibold text-rose-600">Urgent Revision</span>
              </div>

              {highPriorityTopics.map((topic, idx) => (
                <Card key={idx} className="p-4 border-rose-200/90 bg-rose-50/15">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{topic.topic}</h4>
                      <span className="text-[11px] text-slate-400">{topic.subject}</span>
                    </div>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      {topic.mastery}% Mastery
                    </span>
                  </div>

                  <ProgressBar value={topic.mastery} color="rose" size="sm" className="mb-3" />

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-[11px] text-slate-600 mb-3">
                    <strong className="text-rose-700">AI Recommendation: </strong>
                    Practice BFS and DFS before moving to advanced shortest path algorithms.
                  </div>

                  <Link href={`/practice?topic=${encodeURIComponent(topic.topic.toLowerCase())}`}>
                    <Button variant="primary" size="sm" className="w-full">
                      Start Practice
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>

            {/* NEEDS PRACTICE */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b-2 border-amber-500">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  NEEDS PRACTICE
                </span>
                <span className="text-xs font-semibold text-amber-600">Solidify Concepts</span>
              </div>

              {needsPracticeTopics.map((topic, idx) => (
                <Card key={idx} className="p-4 border-amber-200/90 bg-amber-50/15">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{topic.topic}</h4>
                      <span className="text-[11px] text-slate-400">{topic.subject}</span>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {topic.mastery}% Mastery
                    </span>
                  </div>

                  <ProgressBar value={topic.mastery} color="amber" size="sm" className="mb-3" />

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-[11px] text-slate-600 mb-3">
                    <strong className="text-amber-700">AI Recommendation: </strong>
                    Review core formulas and complete 10 diagnostic problem sets.
                  </div>

                  <Link href={`/practice?topic=${encodeURIComponent(topic.topic.toLowerCase())}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Practice Topic
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>

            {/* STRONG */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b-2 border-emerald-500">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  STRONG
                </span>
                <span className="text-xs font-semibold text-emerald-600">High Mastery</span>
              </div>

              {strongTopics.map((topic, idx) => (
                <Card key={idx} className="p-4 border-emerald-200/90 bg-emerald-50/15">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{topic.topic}</h4>
                      <span className="text-[11px] text-slate-400">{topic.subject}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {topic.mastery}% Mastery
                    </span>
                  </div>

                  <ProgressBar value={topic.mastery} color="emerald" size="sm" className="mb-3" />

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-[11px] text-slate-600 mb-3">
                    <strong className="text-emerald-700">AI Recommendation: </strong>
                    Keep retention fresh with a bi-weekly 5-minute refresher quiz.
                  </div>

                  <Button variant="ghost" size="sm" className="w-full text-slate-600" disabled>
                    ✓ Mastered
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
