"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  RefreshCw,
  Edit3,
  Flame,
  Target,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { ProgressBar } from "@/components/common/ProgressBar";
import { getStudyPlan, generateStudyPlan, getProfile, completeStudyTask } from "@/lib/api";
import { StudyPlanDay, StudentProfile } from "@/types";

export default function StudyPlanPage() {
  const [plan, setPlan] = useState<StudyPlanDay[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("My performance changed");
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    getStudyPlan().then(setPlan);
    getProfile().then(setProfile);
  }, []);

  const toggleDayTask = async (dayId: string, taskId: string) => {
    try {
      await completeStudyTask(taskId);
    } catch (e) {
      console.warn("Complete task API error:", e);
    }
    setPlan((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            tasks: day.tasks.map((t) =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            ),
          };
        }
        return day;
      })
    );
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const updated = await generateStudyPlan({ reason: selectedReason });
    setPlan(updated);
    setIsRegenerating(false);
    setIsModalOpen(false);
  };

  const totalTasks = plan.reduce((acc, d) => acc + d.tasks.length, 0);
  const completedTasks = plan.reduce(
    (acc, d) => acc + d.tasks.filter((t) => t.completed).length,
    0
  );
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              My Personalized Study Plan
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              AI-generated multi-week calendar optimized for maximum retention and exam coverage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              onClick={() => setIsModalOpen(true)}
            >
              Edit Plan
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              onClick={() => setIsModalOpen(true)}
            >
              Regenerate with AI
            </Button>
          </div>
        </div>

        {/* Overview Banner */}
        {profile && (
          <Card className="p-6 bg-white border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="pr-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Target Goal</span>
                <p className="text-sm font-bold text-slate-900 mt-1 truncate">
                  {profile.targetGoal}
                </p>
                <span className="text-xs text-brand-600 font-medium">Semester Final Exams</span>
              </div>

              <div className="pt-3 md:pt-0 md:px-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Exam Countdown</span>
                <p className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {profile.daysRemaining} Days Left
                </p>
                <span className="text-xs text-slate-400">Target Date: {profile.examDate}</span>
              </div>

              <div className="pt-3 md:pt-0 md:px-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Daily Study Window</span>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {profile.dailyStudyHours} / day
                </p>
                <span className="text-xs text-slate-400">{profile.preferredTime}</span>
              </div>

              <div className="pt-3 md:pt-0 md:pl-4">
                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 uppercase mb-1">
                  <span>Plan Completion</span>
                  <span className="text-brand-600 font-bold">{completionPercentage}%</span>
                </div>
                <ProgressBar value={completionPercentage} color="brand" size="sm" />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {completedTasks} of {totalTasks} topics completed
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Weekly Calendar View */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-slate-900">
              Week Schedule
            </h3>
            <span className="text-xs text-slate-400">Sprint 1 of 3</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {plan.map((day) => (
              <Card
                key={day.id}
                className={`p-4 border transition-all ${
                  day.isToday
                    ? "border-brand-500 ring-2 ring-brand-500/15 shadow-card"
                    : "border-slate-200/90"
                }`}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{day.dayName}</h4>
                    <span className="text-[11px] text-slate-400">{day.dateStr}</span>
                  </div>
                  {day.isToday && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                      Today
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  {day.tasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleDayTask(day.id, t.id)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                        t.completed
                          ? "bg-slate-50/80 border-slate-200 text-slate-400"
                          : "bg-white border-slate-200/80 hover:border-slate-300 text-slate-800"
                      }`}
                    >
                      <button className="mt-0.5 shrink-0 text-slate-300 hover:text-emerald-500">
                        {t.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs font-semibold leading-snug ${
                            t.completed ? "line-through text-slate-400" : "text-slate-900"
                          }`}
                        >
                          {t.topic}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          <span>{t.subject}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {t.durationMinutes}m
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Modal: Regenerate with AI */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Why should we adapt your plan?"
          description="ElevAlte will recalibrate your daily workload and topic allocations."
        >
          <div className="space-y-4">
            <div className="space-y-2.5">
              {[
                { title: "My performance changed", desc: "Adapt focus based on recent diagnostic quiz scores" },
                { title: "I have less time", desc: "Condense daily schedule to high-priority topics only" },
                { title: "I finished topics early", desc: "Advance calendar and unlock upcoming modules" },
                { title: "I need more practice", desc: "Allocate heavier problem-solving blocks to weak topics" },
              ].map((opt) => (
                <button
                  key={opt.title}
                  type="button"
                  onClick={() => setSelectedReason(opt.title)}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    selectedReason === opt.title
                      ? "bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 text-slate-900"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center shrink-0 ${
                      selectedReason === opt.title
                        ? "bg-brand-600 text-white"
                        : "border border-slate-300"
                    }`}
                  >
                    {selectedReason === opt.title && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{opt.title}</p>
                    <p className="text-[11px] text-slate-500">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={isRegenerating}
                onClick={handleRegenerate}
                rightIcon={<Sparkles className="w-4 h-4" />}
              >
                Generate Updated Plan
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
