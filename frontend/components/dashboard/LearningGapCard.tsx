"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { LearningGap } from "@/types";
import { ProgressBar } from "@/components/common/ProgressBar";
import { cn, getPriorityBadge } from "@/lib/utils";

interface LearningGapCardProps {
  gap: LearningGap;
}

export const LearningGapCard: React.FC<LearningGapCardProps> = ({ gap }) => {
  const badge = getPriorityBadge(gap.priority);

  const trendIcon = {
    declining: <TrendingDown className="w-3.5 h-3.5 text-rose-500" />,
    improving: <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />,
    stable: <Minus className="w-3.5 h-3.5 text-slate-400" />,
  }[gap.trend];

  const progressColor =
    gap.accuracy < 50 ? "rose" : gap.accuracy < 70 ? "amber" : "emerald";

  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-subtle transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-900">{gap.topic}</span>
          <span className="text-[11px] text-slate-400">{gap.subject}</span>
        </div>
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full border",
            badge.bg,
            badge.text,
            badge.border
          )}
        >
          {badge.label}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-slate-500 font-medium">Topic Accuracy</span>
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            {trendIcon}
            <span>{gap.accuracy}%</span>
          </div>
        </div>
        <ProgressBar value={gap.accuracy} color={progressColor} size="sm" />
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px]">Last practiced {gap.lastPracticed}</span>
        <Link
          href={`/practice?topic=${encodeURIComponent(gap.topic.toLowerCase())}`}
          className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-0.5 group"
        >
          Practice
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
};
