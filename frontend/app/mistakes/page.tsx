"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Filter,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { getMistakes } from "@/lib/api";
import { MistakeRecord } from "@/types";

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    getMistakes().then(setMistakes);
  }, []);

  const totalMistakes = mistakes.reduce((acc, m) => acc + m.mistakeCount, 0);

  const filteredMistakes =
    activeFilter === "All"
      ? mistakes
      : mistakes.filter((m) => m.topic.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              Your Learning Mistakes
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Turn mistakes into progress. We aggregate your repeated misconceptions into actionable revision cards.
            </p>
          </div>

          <Link href="/practice">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Start Mistake Sprint
            </Button>
          </Link>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">
              Repeated Mistakes Logged
            </span>
            <p className="text-2xl font-bold font-display text-rose-600 mt-1">
              {totalMistakes} Occurrences
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Across 4 key syllabus concepts</p>
          </Card>

          <Card className="p-5 border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">
              Highest Mistake Frequency
            </span>
            <p className="text-2xl font-bold font-display text-slate-900 mt-1">
              Graph Traversal
            </p>
            <p className="text-xs text-rose-600 font-semibold mt-0.5">4 mistakes recorded</p>
          </Card>

          <Card className="p-5 border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">
              Resolved This Week
            </span>
            <p className="text-2xl font-bold font-display text-emerald-600 mt-1">
              8 Resolved
            </p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">
              Verified through follow-up quizzes
            </p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium">Filter by topic:</span>
          {["All", "Graph Traversal", "AVL Rotation", "SQL Joins", "Dijkstra"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                activeFilter === f
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Mistake Detail Cards */}
        <div className="space-y-4">
          {filteredMistakes.map((item) => (
            <Card
              key={item.id}
              className="p-6 border-slate-200/90 hover:shadow-card transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    {item.mistakeCount} Mistakes Recorded
                  </span>
                  <span className="text-sm font-bold text-slate-900">{item.topic}</span>
                  <span className="text-xs text-slate-400">• {item.subject}</span>
                </div>

                <span className="text-[11px] text-slate-400">
                  Last attempted: {item.lastAttempted}
                </span>
              </div>

              {/* Question Statement */}
              <p className="text-sm font-semibold text-slate-900 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {item.question}
              </p>

              {/* Answers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold mb-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Your Previous Answer</span>
                  </div>
                  <p className="text-rose-900 font-medium">{item.studentAnswer}</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Correct Answer</span>
                  </div>
                  <p className="text-emerald-900 font-medium">{item.correctAnswer}</p>
                </div>
              </div>

              {/* AI Diagnostic Explanation */}
              <div className="p-3.5 bg-indigo-50/40 rounded-xl border border-indigo-100 text-xs text-slate-700 leading-relaxed mb-4 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-900 font-bold">Concept Diagnostic: </strong>
                  {item.explanation}
                </div>
              </div>

              {/* Practice Again CTA */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Link href={`/practice?topic=${encodeURIComponent(item.topic.toLowerCase())}`}>
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Practice Again
                  </Button>
                </Link>
                <Link href="/ai-tutor">
                  <Button variant="outline" size="sm">
                    Explain via AI
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
