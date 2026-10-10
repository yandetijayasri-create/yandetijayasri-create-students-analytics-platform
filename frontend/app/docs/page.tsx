"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Sparkles, BrainCircuit, ShieldCheck, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/common/Card";

export default function DocsPage() {
  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            ElevAlte Documentation & Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Understanding the student success loop: Goal → Plan → Learn → Practice → Analyze → Adapt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900">AI Pedagogical Engine</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              ElevAlte leverages modern LLMs specialized for undergraduate STEM education. It
              deconstructs complex algorithmic invariants into first-principles intuition, generates
              concise flash revision notes, and crafts diagnostic quizzes calibrated to college syllabus standards.
            </p>
            <Link href="/ai-tutor" className="text-xs font-bold text-brand-600 flex items-center gap-1">
              <span>Try AI Study Buddy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>

          <Card className="p-6 border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">ML Gap Diagnostics</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Every quiz submission and practice test generates telemetry on response speed, error
              frequency, and misconception clusters. The ML engine calculates topic mastery decay and
              prioritizes high-weight modules ahead of your target exam date.
            </p>
            <Link href="/progress" className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <span>Explore Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
