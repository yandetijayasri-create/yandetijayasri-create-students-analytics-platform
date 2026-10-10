"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Filter,
  CheckCircle2,
  BookOpen,
  Award,
  Sliders,
  Layers,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { generateQuiz } from "@/lib/api";
import { QuizQuestion } from "@/types";

export default function PracticePage() {
  const [subject, setSubject] = useState("Data Structures");
  const [topic, setTopic] = useState("Graphs");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlTopic = params.get("topic");
      if (urlTopic) {
        const formatted = urlTopic.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        setTopic(formatted);
      }
    }
    generateQuiz({ count: 10 }).then(setQuestions);
  }, []);

  const handleStartQuiz = async () => {
    setIsGenerating(true);
    const generated = await generateQuiz({
      subject,
      topic,
      difficulty,
      count: questionCount,
    });
    setQuestions(generated);
    setIsGenerating(false);
    setQuizStarted(true);
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            Practice & Test Your Knowledge
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate AI-powered diagnostic quizzes with active recall tracking and mistake diagnostics.
          </p>
        </div>

        {!quizStarted ? (
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Filter Configuration Card */}
            <Card className="p-6 sm:p-8 border-slate-200">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <Sliders className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Configure Practice Quiz
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option>Data Structures</option>
                    <option>Algorithms</option>
                    <option>DBMS</option>
                    <option>Operating Systems</option>
                    <option>Discrete Mathematics</option>
                    <option>Python</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Topic Focus
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Graphs, BFS/DFS, AVL Trees, SQL Joins"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Easy", "Medium", "Hard"].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setDifficulty(lvl)}
                        className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                          difficulty === lvl
                            ? "bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500/20"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Number of Questions
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 15].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setQuestionCount(cnt)}
                        className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                          questionCount === cnt
                            ? "bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500/20"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {cnt} Questions
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  size="lg"
                  className="w-full"
                  isLoading={isGenerating}
                  onClick={handleStartQuiz}
                  rightIcon={<Sparkles className="w-4 h-4" />}
                >
                  Generate Quiz with AI
                </Button>
              </div>
            </Card>

            {/* Quick Practice Presets */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3">
                Recommended Practice Sprints
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => {
                    setTopic("Graph Traversal");
                    setSubject("Data Structures");
                    handleStartQuiz();
                  }}
                  className="p-4 bg-white rounded-xl border border-rose-200/90 hover:border-rose-300 hover:shadow-subtle transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      High Impact Gap
                    </span>
                    <h5 className="text-sm font-bold text-slate-900 mt-1">
                      Graph Traversal (BFS & DFS)
                    </h5>
                    <p className="text-xs text-slate-500">42% current accuracy</p>
                  </div>
                  <Sparkles className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                </div>

                <div
                  onClick={() => {
                    setTopic("AVL Trees");
                    setSubject("Data Structures");
                    handleStartQuiz();
                  }}
                  className="p-4 bg-white rounded-xl border border-amber-200/90 hover:border-amber-300 hover:shadow-subtle transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Frequent Mistakes
                    </span>
                    <h5 className="text-sm font-bold text-slate-900 mt-1">
                      AVL Rotations & Self Balancing
                    </h5>
                    <p className="text-xs text-slate-500">3 recorded mistakes</p>
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center max-w-2xl mx-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuizStarted(false)}
              >
                ← Back to Quiz Setup
              </Button>
            </div>
            <QuizRunner
              questions={questions}
              onRestart={() => setQuizStarted(false)}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
