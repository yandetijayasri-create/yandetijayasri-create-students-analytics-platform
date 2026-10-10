"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  FileText,
  Video,
  PenTool,
  Sparkles,
  ExternalLink,
  Clock,
  Eye,
  Filter,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { getResources } from "@/lib/api";
import { LearningResource } from "@/types";

export default function ResourcesPage() {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getResources().then(setResources);
  }, []);

  const categories = ["All", "Notes", "PDFs", "Videos", "Practice", "AI Recommended"];

  const filtered = resources.filter((item) => {
    const matchesCategory =
      activeCategory === "All"
        ? true
        : activeCategory === "AI Recommended"
        ? item.isAIRecommended
        : item.type === activeCategory ||
          (activeCategory === "PDFs" && item.type === "PDF");

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getTypeIcon = (type: LearningResource["type"]) => {
    switch (type) {
      case "Notes":
        return <BookOpen className="w-4 h-4 text-brand-600" />;
      case "PDF":
        return <FileText className="w-4 h-4 text-rose-600" />;
      case "Video":
        return <Video className="w-4 h-4 text-purple-600" />;
      case "Practice":
        return <PenTool className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              Smart Learning Resources
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Curated notes, visual breakdowns, cheat sheets, and AI-targeted study materials.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat === "AI Recommended" && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="p-6 border-slate-200/90 hover:shadow-card transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {getTypeIcon(item.type)}
                    <span>{item.type}</span>
                  </div>

                  {item.isAIRecommended && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      AI Recommended
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 mb-4">
                  {item.subject} • {item.topic}
                </p>

                {item.recommendationReason && (
                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-600 leading-relaxed mb-4">
                    <strong className="text-brand-900 font-semibold">Why this? </strong>
                    {item.recommendationReason}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {item.duration}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={<ExternalLink className="w-3 h-3" />}
                >
                  Open Resource
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
