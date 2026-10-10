"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import { QuizQuestion, QuizResult } from "@/types";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ProgressBar } from "@/components/common/ProgressBar";
import { submitQuiz } from "@/lib/api";

interface QuizRunnerProps {
  questions: QuizQuestion[];
  onRestart?: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  questions,
  onRestart,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const answersList = questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: selectedAnswers[q.id] || "",
    }));

    const res = await submitQuiz({
      answers: answersList,
      timeSpentSeconds: 165,
    });
    setResult(res);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted && result) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
        {/* Results Hero Card */}
        <Card className="p-6 md:p-8 text-center bg-gradient-to-b from-white to-slate-50 border-slate-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold font-display text-slate-900 mb-1">
            Quiz Completed!
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Here is your diagnostic performance summary
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mb-6">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-400 uppercase">Score</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {result.score} / {result.totalQuestions}
              </p>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-400 uppercase">Accuracy</span>
              <p className="text-xl font-bold text-brand-600 mt-1">
                {result.accuracyPercentage}%
              </p>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-400 uppercase">Correct</span>
              <p className="text-xl font-bold text-emerald-600 mt-1">
                {result.correctAnswersCount}
              </p>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-400 uppercase">Incorrect</span>
              <p className="text-xl font-bold text-rose-600 mt-1">
                {result.incorrectAnswersCount}
              </p>
            </div>
          </div>

          {/* Dynamic AI/ML Calibration Card */}
          {((result as any).updatedMastery || (result as any).topRecommendation) && (
            <div className="mb-6 p-4 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200/80 rounded-2xl text-left max-w-xl mx-auto shadow-xs">
              <div className="flex items-center gap-2 text-brand-800 font-bold text-xs mb-1.5">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>AI/ML Feedback Loop Triggered</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-2">
                Bayesian Knowledge Tracing (BKT) updated your topic mastery. Learning gap analysis classified your priority areas and automatically adapted your daily study plan.
              </p>
              {(result as any).topRecommendation && (
                <div className="text-[11px] font-semibold text-brand-900 bg-white/80 p-2.5 rounded-xl border border-brand-200/60 flex items-center justify-between">
                  <span>Next AI Focus: <strong>{(result as any).topRecommendation.topic}</strong></span>
                  <span className="text-brand-600 font-bold">{(result as any).topRecommendation.priority || (result as any).topRecommendation.impactLevel} PRIORITY</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/mistakes">
              <Button
                variant="primary"
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Review Mistakes & AI Notes
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setIsSubmitted(false);
                setSelectedAnswers({});
                setCurrentIndex(0);
                if (onRestart) onRestart();
              }}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Retake Quiz
            </Button>
          </div>
        </Card>

        {/* Detailed Explanations */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">Detailed Answer Review</h3>
          {result.questionDetails.map((item, idx) => (
            <Card
              key={item.questionId}
              className={`p-5 border ${
                item.isCorrect
                  ? "border-emerald-200 bg-emerald-50/20"
                  : "border-rose-200 bg-rose-50/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-bold text-slate-500">
                  Question {idx + 1} • {item.topic}
                </span>
                {item.isCorrect ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full">
                    <XCircle className="w-3.5 h-3.5" /> Incorrect
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-900 mb-3">{item.question}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                <div
                  className={`p-2.5 rounded-lg border ${
                    item.isCorrect
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900 font-medium"
                      : "bg-rose-50 border-rose-200 text-rose-900 font-medium"
                  }`}
                >
                  <span className="text-slate-500 block text-[10px]">Your Answer:</span>
                  {item.studentAnswer || "Skipped"}
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
                  <span className="text-emerald-700 block text-[10px]">Correct Answer:</span>
                  Option {item.correctAnswer}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Explanation:</strong> {item.explanation}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto p-6 md:p-8 border-slate-200 shadow-sm">
      {/* Quiz Progress header */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
        <span className="font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
          Question {currentIndex + 1} of {total}
        </span>
        <span className="font-medium text-slate-400">
          {currentQuestion.subject} • {currentQuestion.topic}
        </span>
      </div>

      <ProgressBar value={progressPercent} color="brand" size="sm" className="mb-6" />

      {/* Question Text */}
      <h3 className="text-lg md:text-xl font-bold font-display text-slate-900 mb-6 leading-snug">
        {currentQuestion.question}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((opt) => {
          const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3.5 ${
                isSelected
                  ? "bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 text-slate-900 font-medium shadow-xs"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 text-slate-700"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                  isSelected
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {opt.id}
              </div>
              <span className="text-sm leading-relaxed">{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Button
          variant="outline"
          size="md"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        {currentIndex === total - 1 ? (
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            rightIcon={<Sparkles className="w-4 h-4" />}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Next
          </Button>
        )}
      </div>
    </Card>
  );
};
