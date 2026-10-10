"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Bot,
  BrainCircuit,
  Calendar,
  Clock,
  Target,
  BookOpen,
  User,
  Plus,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { submitOnboarding } from "@/lib/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("Analyzing your goals...");

  // Step 1: About You
  const [name, setName] = useState("Alex Johnson");
  const [course, setCourse] = useState("Bachelor of Technology");
  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [year, setYear] = useState("3rd Year");
  const [semester, setSemester] = useState("5th Semester");

  // Step 2: Subjects
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    "Data Structures",
    "Python",
    "DBMS",
    "Mathematics",
    "Operating Systems",
  ]);
  const [newSubject, setNewSubject] = useState("");

  // Step 3: Goal
  const [goal, setGoal] = useState("Prepare for semester exams");

  // Step 4: Availability
  const [hoursPerDay, setHoursPerDay] = useState("2 hours");
  const [preferredTime, setPreferredTime] = useState("Evening");

  // Step 5: Exam & Target
  const [examDate, setExamDate] = useState("2026-10-21");
  const [targetScore, setTargetScore] = useState("90% / 9.0+ CGPA");

  const goalOptions = [
    { title: "Prepare for semester exams", desc: "Target high grades on upcoming college midterms & finals" },
    { title: "Improve grades", desc: "Systematically target and repair weak modules to raise overall GPA" },
    { title: "Learn programming", desc: "Build rigorous DSA and software engineering fundamentals" },
    { title: "Prepare for competitive exam", desc: "GATE, placements, coding interviews, and standardized tests" },
    { title: "Build a skill", desc: "Self-paced deep mastery in core systems and computer science" },
  ];

  const availabilityHours = ["30 min", "1 hour", "2 hours", "3+ hours"];
  const availabilityTimes = [
    { label: "Morning", sub: "6:00 AM – 11:00 AM" },
    { label: "Afternoon", sub: "11:00 AM – 4:00 PM" },
    { label: "Evening", sub: "4:00 PM – 9:00 PM" },
    { label: "Night", sub: "9:00 PM – 1:00 AM" },
  ];

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubject.trim() && !selectedSubjects.includes(newSubject.trim())) {
      setSelectedSubjects([...selectedSubjects, newSubject.trim()]);
      setNewSubject("");
    }
  };

  const handleFinish = async () => {
    setIsProcessing(true);
    setProcessingStatus("Understanding your subjects & syllabus...");

    try {
      await submitOnboarding({
        name,
        course,
        branch,
        year,
        semester,
        subjects: selectedSubjects,
        goal,
        available_study_time: hoursPerDay,
        preferred_study_time: preferredTime,
        exam_date: examDate,
        target_score: targetScore,
      });
      setProcessingStatus("Building your adaptive learning path...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      console.warn("Onboarding API warning:", err);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-purple flex items-center justify-center shadow-glow animate-pulse">
            <BrainCircuit className="w-12 h-12 text-white animate-spin [animation-duration:8s]" />
          </div>
          <div className="absolute -bottom-2 -right-2 p-2 bg-slate-950 rounded-xl border border-white/20">
            <Sparkles className="w-5 h-5 text-brand-300 animate-bounce" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mb-3">
          ElevAlte AI is Generating Your Plan
        </h2>

        <p className="text-sm font-medium text-brand-200 transition-all duration-300 min-h-6">
          {processingStatus}
        </p>

        <div className="w-64 max-w-full bg-slate-800 h-2 rounded-full mt-6 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-500 to-accent-purple h-full rounded-full animate-pulse w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
            Λ
          </div>
          <span className="font-extrabold text-base tracking-wider text-slate-900 font-display">
            ELEV<span className="text-brand-600">Λ</span>LTE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Step {step} of 5</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`w-5 h-1.5 rounded-full transition-all ${
                  s <= step ? "bg-brand-600" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Multi-step Card */}
      <div className="max-w-2xl mx-auto w-full my-6 flex-1 flex flex-col justify-center">
        <Card className="p-6 sm:p-10 border-slate-200 shadow-sm animate-in fade-in duration-200">
          {/* STEP 1: ABOUT YOU */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  Step 1 • Profile Calibration
                </span>
                <h2 className="text-2xl font-bold font-display text-slate-900 mt-1">
                  Tell us about your academics
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  We use this to calibrate course curriculum depth and benchmarks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Degree / Course
                  </label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Branch / Major
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Current Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option>1st Year (Freshman)</option>
                    <option>2nd Year (Sophomore)</option>
                    <option>3rd Year (Junior)</option>
                    <option>4th Year (Senior)</option>
                    <option>Postgraduate / Masters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option>1st Semester</option>
                    <option>2nd Semester</option>
                    <option>3rd Semester</option>
                    <option>4th Semester</option>
                    <option>5th Semester</option>
                    <option>6th Semester</option>
                    <option>7th Semester</option>
                    <option>8th Semester</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SUBJECTS */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  Step 2 • Course Subjects
                </span>
                <h2 className="text-2xl font-bold font-display text-slate-900 mt-1">
                  Which subjects are you studying this term?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select all that apply or add custom college modules.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Data Structures",
                  "Python",
                  "DBMS",
                  "Mathematics",
                  "Operating Systems",
                  "Computer Networks",
                  "Software Engineering",
                  "Machine Learning Basics",
                ].map((sub) => {
                  const isChecked = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub)}
                      className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? "bg-brand-50 border-brand-500 text-brand-900 font-semibold shadow-2xs"
                          : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <span className="text-sm">{sub}</span>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                          isChecked ? "bg-brand-600 text-white" : "border border-slate-300"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Subject */}
              <form onSubmit={handleAddCustomSubject} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Add another subject..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                <Button type="submit" variant="outline" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Add
                </Button>
              </form>
            </div>
          )}

          {/* STEP 3: GOAL */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  Step 3 • Primary Academic Goal
                </span>
                <h2 className="text-2xl font-bold font-display text-slate-900 mt-1">
                  What is your primary target right now?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  ElevAlte configures task urgency and spaced repetition around this objective.
                </p>
              </div>

              <div className="space-y-3">
                {goalOptions.map((opt) => {
                  const isSelected = goal === opt.title;
                  return (
                    <button
                      key={opt.title}
                      type="button"
                      onClick={() => setGoal(opt.title)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 text-slate-900 shadow-2xs"
                          : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full mt-0.5 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-brand-600 text-white"
                            : "border border-slate-300"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{opt.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: AVAILABILITY */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  Step 4 • Study Availability
                </span>
                <h2 className="text-2xl font-bold font-display text-slate-900 mt-1">
                  When and how long can you study daily?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  We generate realistic daily sessions to prevent burnout.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Target Study Hours per Day
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {availabilityHours.map((h) => {
                    const isSelected = hoursPerDay === h;
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setHoursPerDay(h)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? "bg-brand-600 text-white font-bold border-brand-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-sm">{h}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Preferred Time Window
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availabilityTimes.map((t) => {
                    const isSelected = preferredTime === t.label;
                    return (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => setPreferredTime(t.label)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 text-slate-900 font-semibold"
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        <p className="text-sm font-bold">{t.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{t.sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: EXAM & DEADLINE */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  Step 5 • Exam & Target Score
                </span>
                <h2 className="text-2xl font-bold font-display text-slate-900 mt-1">
                  Lock in your exam deadline
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Our scheduler will backsolve topic milestones directly to this date.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Next Major Exam Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Calculated exam buffer: ~12 study days remaining
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Target Score / GPA Goal
                  </label>
                  <input
                    type="text"
                    value={targetScore}
                    onChange={(e) => setTargetScore(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    placeholder="e.g. 90% or 9.0 CGPA"
                  />
                </div>

                <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">AI Adaptive Readiness:</strong> ElevAlte
                    will now build your first sprint plan with 3 daily tasks and continuous
                    diagnostic quizzes.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
            {step > 1 ? (
              <Button
                variant="outline"
                size="md"
                onClick={() => setStep(step - 1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(step + 1)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleFinish}
                rightIcon={<Sparkles className="w-4 h-4" />}
              >
                Create My Personalized Plan
              </Button>
            )}
          </div>
        </Card>
      </div>

      <div className="text-center text-xs text-slate-400 pb-2">
        You can always update your preferences under Profile Settings
      </div>
    </div>
  );
}
