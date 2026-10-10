"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  CalendarDays,
  PenTool,
  TrendingUp,
  AlertCircle,
  FolderArchive,
  Trophy,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
} from "lucide-react";
import { StudentProfile } from "@/types";
import { cn } from "@/lib/utils";

interface SidebarProps {
  profile: StudentProfile;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  profile,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  const navLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "AI Study Buddy", href: "/ai-tutor", icon: Bot, isSpecial: true },
    { label: "Study Plan", href: "/study-plan", icon: CalendarDays },
    { label: "Practice", href: "/practice", icon: PenTool },
    { label: "Progress", href: "/progress", icon: TrendingUp },
    { label: "Mistakes", href: "/mistakes", icon: AlertCircle, badge: "3" },
    { label: "Resources", href: "/resources", icon: FolderArchive },
    { label: "Achievements", href: "/achievements", icon: Trophy, badge: "Lvl 8" },
  ];

  const bottomLinks = [
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Help & Docs", href: "/docs", icon: HelpCircle },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/90 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2.5 transition-all overflow-hidden",
            isCollapsed && "justify-center w-full"
          )}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-purple flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
            Λ
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-wider text-slate-900 font-display">
                ELEV<span className="text-brand-600">Λ</span>LTE
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                AI Student Engine
              </span>
            </div>
          )}
        </Link>

        {/* Collapse toggle button for desktop */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <div className="mb-2 px-2">
          {!isCollapsed ? (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Core Platform
            </span>
          ) : (
            <div className="h-2" />
          )}
        </div>

        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all duration-150",
                isActive
                  ? "bg-brand-50 text-brand-700 font-semibold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80",
                isCollapsed && "justify-center px-2",
                item.isSpecial && !isActive && "text-brand-700 bg-brand-50/50 hover:bg-brand-50"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-transform group-hover:scale-105",
                  isActive
                    ? "text-brand-600"
                    : item.isSpecial
                    ? "text-brand-600"
                    : "text-slate-500 group-hover:text-slate-800"
                )}
              />

              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                        item.badge === "3"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-indigo-100 text-indigo-700"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.isSpecial && !item.badge && (
                    <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
                  )}
                </div>
              )}

              {/* Active pill indicator */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-brand-600 rounded-r-full" />
              )}
            </Link>
          );
        })}

        <div className="pt-4 pb-2 px-2">
          {!isCollapsed && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Preferences
            </span>
          )}
        </div>

        {bottomLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs md:text-sm transition-all",
                isActive
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-slate-800" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* User Profile Card at Bottom */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <Link
          href="/profile"
          onClick={onCloseMobile}
          className={cn(
            "flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-200 transition-all group",
            isCollapsed && "justify-center p-1.5"
          )}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-brand-100 shrink-0">
            {profile.name.charAt(0)}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {profile.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {profile.levelTitle}
              </p>
            </div>
          )}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop & Laptop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block shrink-0 transition-all duration-300 ease-in-out h-screen sticky top-0 z-40",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile & Tablet Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
