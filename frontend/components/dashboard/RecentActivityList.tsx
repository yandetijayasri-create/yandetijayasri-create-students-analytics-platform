"use client";

import React from "react";
import { ActivityItem } from "@/types";
import { CheckCircle2, FileText, Timer, Award } from "lucide-react";

interface RecentActivityListProps {
  activities: ActivityItem[];
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({
  activities,
}) => {
  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "quiz":
        return <CheckCircle2 className="w-4 h-4 text-purple-600" />;
      case "notes":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "session":
        return <Timer className="w-4 h-4 text-amber-600" />;
      case "mastery":
        return <Award className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-3">
      {activities.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-xs shrink-0 mt-0.5">
            {getIcon(item.type)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <h5 className="text-xs font-semibold text-slate-900 truncate">
                {item.title}
              </h5>
              <span className="text-[10px] text-slate-400 shrink-0">
                {item.timestamp}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{item.detail}</p>
          </div>

          {item.badge && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0 self-center">
              {item.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
