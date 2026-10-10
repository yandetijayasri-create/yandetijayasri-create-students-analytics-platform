"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bot, CalendarDays, PenTool, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "AI", href: "/ai-tutor", icon: Bot, highlight: true },
    { label: "Plan", href: "/study-plan", icon: CalendarDays },
    { label: "Practice", href: "/practice", icon: PenTool },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all",
                isActive
                  ? "text-brand-600 font-semibold"
                  : "text-slate-500 hover:text-slate-900",
                item.highlight && !isActive && "text-brand-500 font-medium"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-xl transition-all",
                  item.highlight && isActive && "bg-brand-50"
                )}
              >
                <Icon className={cn("w-5 h-5", item.highlight && "text-brand-600")} />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
