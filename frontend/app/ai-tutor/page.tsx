"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AIChatBox } from "@/components/ai/AIChatBox";
import { Sparkles } from "lucide-react";

export default function AITutorPage() {
  return (
    <AppLayout>
      <div className="space-y-4 max-w-4xl mx-auto">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
              ElevAlte AI Study Buddy
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-600" />
              Academic Model
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Your personal study companion — get simplified breakdowns, quizzes, and code insights.
          </p>
        </div>

        <AIChatBox />
      </div>
    </AppLayout>
  );
}
