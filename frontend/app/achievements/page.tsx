"use client";

import React, { useState } from "react";
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/common/Card";
import { ProgressBar } from "@/components/common/ProgressBar";
import { mockAchievements, mockProfile } from "@/lib/mock-data";

export default function AchievementsPage() {
  const [achievements] = useState(mockAchievements);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const currentXP = mockProfile.xp;
  const nextLevelXP = 1500;
  const xpPercentage = Math.round((currentXP / nextLevelXP) * 100);

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            Student Achievements & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Earn experience points (XP), unlock mastery badges, and build unbreakable learning habits.
          </p>
        </div>

        {/* Level & XP Hero Banner */}
        <Card className="p-6 sm:p-8 bg-gradient-to-r from-indigo-900 via-brand-900 to-slate-900 text-white border-indigo-700/50 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent-purple/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg ring-4 ring-white/10 shrink-0">
                8
              </div>
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  Current Rank
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                  Level {mockProfile.level} — {mockProfile.levelTitle}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  {unlockedCount} of {achievements.length} badges unlocked
                </p>
              </div>
            </div>

            <div className="md:w-80 bg-white/10 p-4 rounded-2xl border border-white/15 backdrop-blur-md">
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-slate-200">Level Progress</span>
                <span className="text-amber-300 font-bold">{currentXP} / {nextLevelXP} XP</span>
              </div>
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-300 mt-1.5 block">
                260 XP needed to reach Level 9 (Academic Scholar)
              </span>
            </div>
          </div>
        </Card>

        {/* Badges Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-display text-slate-900">
            All Achievements
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((item) => (
              <Card
                key={item.id}
                className={`p-5 border transition-all ${
                  item.unlocked
                    ? "bg-white border-slate-200/90 shadow-subtle hover:border-brand-400 hover:shadow-card"
                    : "bg-slate-50/70 border-slate-200/60 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs ${
                      item.unlocked
                        ? "bg-brand-50 border border-brand-200"
                        : "bg-slate-200 border border-slate-300 grayscale"
                    }`}
                  >
                    {item.icon}
                  </div>

                  {item.unlocked ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-500" /> Locked
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {item.description}
                </p>

                {item.unlocked && item.dateUnlocked && (
                  <span className="text-[10px] font-medium text-slate-400 block pt-2 border-t border-slate-100">
                    Unlocked: {item.dateUnlocked}
                  </span>
                )}

                {!item.unlocked && item.currentProgress !== undefined && item.totalRequired !== undefined && (
                  <div className="pt-2 border-t border-slate-200/60">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                      <span>Requirement Progress</span>
                      <span>{item.currentProgress} / {item.totalRequired}</span>
                    </div>
                    <ProgressBar
                      value={(item.currentProgress / item.totalRequired) * 100}
                      color="brand"
                      size="sm"
                    />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
