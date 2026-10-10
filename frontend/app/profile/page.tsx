"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  Calendar,
  Clock,
  Target,
  Edit2,
  Check,
  Flame,
  Award,
  BookOpen,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { getProfile, updateProfile } from "@/lib/api";
import { StudentProfile } from "@/types";
import { mockProfile } from "@/lib/mock-data";

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>(mockProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Edit fields state
  const [editName, setEditName] = useState(profile.name);
  const [editCourse, setEditCourse] = useState(profile.course);
  const [editBranch, setEditBranch] = useState(profile.branch);
  const [editYear, setEditYear] = useState(profile.year);
  const [editSemester, setEditSemester] = useState(profile.semester);
  const [editTargetScore, setEditTargetScore] = useState(profile.targetScore);
  const [editGoal, setEditGoal] = useState(profile.targetGoal);
  const [editExamDate, setEditExamDate] = useState(profile.examDate);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data);
        setEditName(data.name);
        setEditCourse(data.course);
        setEditBranch(data.branch);
        setEditYear(data.year);
        setEditSemester(data.semester);
        setEditTargetScore(data.targetScore);
        setEditGoal(data.targetGoal);
        setEditExamDate(data.examDate);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    try {
      const updated = await updateProfile({
        name: editName,
        course: editCourse,
        branch: editBranch,
        year: editYear,
        semester: editSemester,
        targetScore: editTargetScore,
      });
      setProfile(updated);
    } catch (err) {
      console.warn("Failed to update profile:", err);
      setProfile({
        ...profile,
        name: editName,
        course: editCourse,
        branch: editBranch,
        year: editYear,
        semester: editSemester,
        targetScore: editTargetScore,
      });
    }
    setIsEditModalOpen(false);
  };

  const handleSaveGoal = async () => {
    try {
      const updated = await updateProfile({
        targetGoal: editGoal,
        examDate: editExamDate,
      });
      setProfile(updated);
    } catch (err) {
      console.warn("Failed to update goal:", err);
      setProfile({
        ...profile,
        targetGoal: editGoal,
        examDate: editExamDate,
      });
    }
    setIsGoalModalOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              Student Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your academic credentials, syllabus enrollment, and target milestones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              leftIcon={<Edit2 className="w-3.5 h-3.5" />}
            >
              Edit Profile
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsGoalModalOpen(true)}
              leftIcon={<Target className="w-3.5 h-3.5" />}
            >
              Update Goal
            </Button>
          </div>
        </div>

        {/* Profile Identity Card */}
        <Card className="p-6 sm:p-8 border-slate-200">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-purple text-white flex items-center justify-center font-bold text-3xl shadow-md ring-4 ring-brand-100">
                {profile.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-amber-500 text-white rounded-xl shadow-xs">
                <Flame className="w-4 h-4 fill-white" />
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold font-display text-slate-900">
                  {profile.name}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  {profile.levelTitle}
                </span>
              </div>

              <p className="text-xs text-slate-500">{profile.email}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <GraduationCap className="w-4 h-4 text-brand-600" />
                  {profile.course}
                </span>
                <span>•</span>
                <span>{profile.branch}</span>
                <span>•</span>
                <span className="font-semibold text-slate-900">
                  {profile.year} ({profile.semester})
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Academic Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Enrollment & Subjects */}
          <Card className="p-6 border-slate-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">Current Semester Subjects</h3>
              </div>
              <span className="text-xs text-slate-400">5 Enrolled</span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: "Data Structures & Algorithms", code: "CS301", mastery: 82 },
                { name: "Database Management Systems", code: "CS302", mastery: 58 },
                { name: "Operating Systems", code: "CS303", mastery: 45 },
                { name: "Discrete Mathematics", code: "MA201", mastery: 71 },
                { name: "Python for Data Science", code: "CS305", mastery: 88 },
              ].map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-900 block">{sub.name}</span>
                    <span className="text-[11px] text-slate-400">{sub.code}</span>
                  </div>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full ${
                      sub.mastery >= 75
                        ? "text-emerald-700 bg-emerald-50"
                        : sub.mastery >= 50
                        ? "text-amber-700 bg-amber-50"
                        : "text-rose-700 bg-rose-50"
                    }`}
                  >
                    {sub.mastery}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Academic Goals & Preferences */}
          <Card className="p-6 border-slate-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">Goal & Preferences</h3>
              </div>
              <button
                onClick={() => setIsGoalModalOpen(true)}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                Change
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <span className="text-[10px] uppercase font-bold text-brand-700">Primary Goal</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{profile.targetGoal}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Target: {profile.targetScore} • Final exam date {profile.examDate}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block">Daily Target</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {profile.dailyStudyHours}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block">Preferred Window</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {profile.preferredTime}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-400 block">Learning Style</span>
                <p className="text-xs font-semibold text-slate-800 mt-1">
                  Active Recall + Diagnostic Mistake Resolution
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Modal: Edit Profile */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Profile Information"
        >
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Course</label>
              <input
                type="text"
                value={editCourse}
                onChange={(e) => setEditCourse(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Branch</label>
              <input
                type="text"
                value={editBranch}
                onChange={(e) => setEditBranch(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Year</label>
                <input
                  type="text"
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                <input
                  type="text"
                  value={editSemester}
                  onChange={(e) => setEditSemester(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: Update Goal */}
        <Modal
          isOpen={isGoalModalOpen}
          onClose={() => setIsGoalModalOpen(false)}
          title="Update Academic Goal"
        >
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Goal Title</label>
              <input
                type="text"
                value={editGoal}
                onChange={(e) => setEditGoal(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Score</label>
              <input
                type="text"
                value={editTargetScore}
                onChange={(e) => setEditTargetScore(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Exam Date</label>
              <input
                type="date"
                value={editExamDate}
                onChange={(e) => setEditExamDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setIsGoalModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveGoal}>
                Update Plan
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
