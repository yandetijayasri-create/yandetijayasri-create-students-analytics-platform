"use client";

import React, { useState } from "react";
import {
  Bell,
  Moon,
  Bot,
  Shield,
  Sliders,
  Check,
  Smartphone,
  Mail,
  Sparkles,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState(true);
  const [shareAnonymousData, setShareAnonymousData] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              Platform Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Customize notification cadences, AI study buddy tone, and learning telemetry.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            leftIcon={saved ? <Check className="w-3.5 h-3.5" /> : undefined}
          >
            {saved ? "Preferences Saved!" : "Save Settings"}
          </Button>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Section 1: Study & AI Preferences */}
          <Card className="p-6 border-slate-200">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">
                AI & Adaptive Learning Engine
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">AI Daily Task Recommendations</p>
                  <p className="text-[11px] text-slate-500">
                    Automatically highlight the single highest-impact task based on quiz errors.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAiSuggestions(!aiSuggestions)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    aiSuggestions ? "bg-brand-600" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      aiSuggestions ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-900">Adaptive Quiz Difficulty</p>
                  <p className="text-[11px] text-slate-500">
                    Dynamically scale question complexity as topic mastery increases.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAdaptiveDifficulty(!adaptiveDifficulty)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    adaptiveDifficulty ? "bg-brand-600" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      adaptiveDifficulty ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Section 2: Notifications */}
          <Card className="p-6 border-slate-200">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Bell className="w-5 h-5 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Reminders & Notifications
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Daily Study Reminders</p>
                  <p className="text-[11px] text-slate-500">
                    Receive alert 30 minutes before your scheduled evening study block.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStudyReminders(!studyReminders)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    studyReminders ? "bg-brand-600" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      studyReminders ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-900">Email Digest & Weekly Report</p>
                  <p className="text-[11px] text-slate-500">
                    Receive Monday morning summary of weekly mastery and streak metrics.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    emailNotifications ? "bg-brand-600" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      emailNotifications ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Section 3: Interface & Theme */}
          <Card className="p-6 border-slate-200">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Moon className="w-5 h-5 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">Interface & Appearance</h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Dark Mode (Experimental)</p>
                <p className="text-[11px] text-slate-500">
                  Switch from clean SaaS white to ultra-low eye strain dark palette.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  darkMode ? "bg-brand-600" : "bg-slate-200"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    darkMode ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </Card>

          {/* Section 4: Privacy & Data */}
          <Card className="p-6 border-slate-200">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Shield className="w-5 h-5 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">Privacy & Academic Telemetry</h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Share Anonymous Diagnostic Metrics</p>
                <p className="text-[11px] text-slate-500">
                  Help improve cohort question benchmark scores without sharing personal identity.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShareAnonymousData(!shareAnonymousData)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  shareAnonymousData ? "bg-brand-600" : "bg-slate-200"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    shareAnonymousData ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
