"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { ProgressAnalytics } from "@/types";

interface AnalyticsChartsProps {
  data: ProgressAnalytics;
}

export const WeeklyStudyChart: React.FC<{ data: ProgressAnalytics["weeklyStudyTime"] }> = ({
  data,
}) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="day" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} unit="h" />
          <Tooltip
            contentStyle={{ backgroundColor: "#0F172A", borderRadius: "12px", border: "none", color: "#FFF" }}
            itemStyle={{ color: "#FFF", fontSize: "12px" }}
          />
          <Bar dataKey="hours" name="Actual Hours" fill="#6366F1" radius={[6, 6, 0, 0]} />
          <Bar dataKey="target" name="Target Hours" fill="#E2E8F0" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SubjectPerformanceChart: React.FC<{ data: ProgressAnalytics["subjectPerformance"] }> = ({
  data,
}) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: "#64748B", fontSize: 11 }} unit="%" />
          <YAxis type="category" dataKey="subject" width={95} tick={{ fill: "#334155", fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#0F172A", borderRadius: "12px", border: "none", color: "#FFF" }}
            itemStyle={{ color: "#FFF", fontSize: "12px" }}
          />
          <Bar dataKey="score" name="Mastery Score" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PerformanceTrendChart: React.FC<{ data: ProgressAnalytics["performanceTrend"] }> = ({
  data,
}) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="date" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis domain={[50, 100]} tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: "#0F172A", borderRadius: "12px", border: "none", color: "#FFF" }}
            itemStyle={{ color: "#FFF", fontSize: "12px" }}
          />
          <Line
            type="monotone"
            dataKey="score"
            name="Actual Score"
            stroke="#4F46E5"
            strokeWidth={3}
            dot={{ fill: "#4F46E5", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            name="ML Predicted Path"
            stroke="#94A3B8"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const StudyConsistencyHeatmap: React.FC<{ data: ProgressAnalytics["heatmapDays"] }> = ({
  data,
}) => {
  const getIntensityClass = (level: number) => {
    switch (level) {
      case 1:
        return "bg-indigo-100 hover:bg-indigo-200";
      case 2:
        return "bg-indigo-300 hover:bg-indigo-400";
      case 3:
        return "bg-brand-500 hover:bg-brand-600";
      case 4:
        return "bg-indigo-700 hover:bg-indigo-800";
      default:
        return "bg-slate-100 hover:bg-slate-200";
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
        {data.map((day, idx) => (
          <div
            key={idx}
            title={`${day.date}: ${day.count} study activities completed`}
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md transition-all cursor-pointer ${getIntensityClass(
              day.intensity
            )}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
        <span>Less consistent</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-slate-100" />
          <div className="w-3 h-3 rounded bg-indigo-100" />
          <div className="w-3 h-3 rounded bg-indigo-300" />
          <div className="w-3 h-3 rounded bg-brand-500" />
          <div className="w-3 h-3 rounded bg-indigo-700" />
        </div>
        <span>Highly consistent</span>
      </div>
    </div>
  );
};
