"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Flame,
  Sparkles,
  Menu,
  ChevronDown,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { StudentProfile } from "@/types";
import { Badge } from "@/components/common/Badge";
import { checkHealth } from "@/lib/api";

interface NavbarProps {
  profile: StudentProfile;
  onToggleSidebar?: () => void;
  onOpenMobileDrawer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onToggleSidebar,
  onOpenMobileDrawer,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "mock" | "offline">("checking");

  useEffect(() => {
    checkHealth().then((res) => {
      if (res.connected && res.status === "healthy") {
        setConnectionStatus("connected");
      } else if (res.connected && res.status === "demo_mock") {
        setConnectionStatus("mock");
      } else {
        setConnectionStatus("offline");
      }
    }).catch(() => {
      setConnectionStatus("offline");
    });
  }, []);

  const notifications = [
    {
      id: "n1",
      title: "AI Diagnostic Ready",
      desc: "New gap analysis found 42% accuracy in Graphs.",
      time: "10m ago",
      unread: true,
    },
    {
      id: "n2",
      title: "Streak Protected 🔥",
      desc: "You've studied 7 days in a row! 50 bonus XP added.",
      time: "2h ago",
      unread: true,
    },
    {
      id: "n3",
      title: "Exam Countdown",
      desc: "12 days left until Semester Final Examinations.",
      time: "1d ago",
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between transition-all">
      {/* Left side: Mobile drawer button & Quick search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileDrawer}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, questions, smart notes... (Press '/' to focus)"
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>
      </div>

      {/* Right side: Connection Status, Streak, AI Assistant shortcut, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Connection status indicator (Phase 6) */}
        {connectionStatus === "connected" && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-700 font-medium text-[11px] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Backend Connected ✓</span>
          </div>
        )}
        {connectionStatus === "offline" && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-amber-700 font-medium text-[11px] shadow-2xs">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>Backend Offline</span>
          </div>
        )}
        {connectionStatus === "mock" && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-200/80 rounded-full text-indigo-700 font-medium text-[11px] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Demo Mode (Mock)</span>
          </div>
        )}

        {/* Streak indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/70 rounded-full text-amber-700 font-semibold text-xs shadow-xs">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          <span>{profile.streakDays} Days</span>
        </div>

        {/* AI Quick Button */}
        <Link
          href="/ai-tutor"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-brand-600 to-accent-purple text-white rounded-full text-xs font-semibold shadow-xs hover:shadow-glow transition-all hover:scale-102"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </Link>

        {/* Notifications toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900">Notifications</span>
                  <Badge variant="brand" size="sm">2 New</Badge>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                      n.unread ? "bg-brand-50/20" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-semibold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-2.5 text-center border-t border-slate-100 bg-slate-50/30">
                <Link
                  href="/dashboard"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  Mark all as read
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Mini dropdown */}
        <Link
          href="/profile"
          className="flex items-center gap-2 pl-2 pr-1 py-1 hover:bg-slate-100 rounded-xl transition-colors group"
        >
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-400 text-white flex items-center justify-center font-bold text-xs ring-2 ring-brand-100 group-hover:ring-brand-300 transition-all">
            {profile.name.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-none">{profile.name}</p>
            <p className="text-[11px] text-slate-500 leading-none mt-1">Level {profile.level}</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block group-hover:text-slate-600" />
        </Link>
      </div>
    </header>
  );
};
