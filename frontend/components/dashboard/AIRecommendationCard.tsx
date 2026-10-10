"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, TrendingDown, Target, BrainCircuit } from "lucide-react";
import { AIRecommendation } from "@/types";
import { Button } from "@/components/common/Button";

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  recommendation,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-brand-900 to-slate-900 text-white p-6 md:p-7 shadow-xl border border-indigo-700/40">
      {/* Decorative gradient glow effect */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-accent-purple/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-brand-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-brand-200 border border-white/15 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-brand-300 animate-pulse" />
              AI Adaptive Recommendation
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/30 font-medium">
              High Impact Priority
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white mb-2">
            {recommendation.headline}
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {recommendation.reason}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>Current Accuracy: <strong className="text-white">{recommendation.accuracy}%</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Exam Window: <strong className="text-white">{recommendation.daysToExam} days</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <BrainCircuit className="w-4 h-4 text-brand-300" />
              <span>Confidence: <strong className="text-white">High (94%)</strong></span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
          <Link href={recommendation.actionUrl}>
            <Button
              size="lg"
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold shadow-lg hover:shadow-xl hover:scale-102 transition-all border border-white/50"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {recommendation.actionLabel}
            </Button>
          </Link>
          <Link href="/ai-tutor">
            <Button
              variant="outline"
              size="md"
              className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              Ask AI Why
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
