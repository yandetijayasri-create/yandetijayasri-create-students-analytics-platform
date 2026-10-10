"use client";

import React from "react";
import { CheckCircle2, Circle, Clock, Play, Award } from "lucide-react";
import { StudyTask } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/Button";

interface StudyTaskItemProps {
  task: StudyTask;
  onToggleComplete: (taskId: string) => void;
  onStartTask?: (task: StudyTask) => void;
}

export const StudyTaskItem: React.FC<StudyTaskItemProps> = ({
  task,
  onToggleComplete,
  onStartTask,
}) => {
  const typeBadgeColors = {
    Learn: "bg-blue-50 text-blue-700 border-blue-200",
    Practice: "bg-purple-50 text-purple-700 border-purple-200",
    Review: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div
      className={cn(
        "group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-200 gap-3",
        task.completed
          ? "bg-slate-50/70 border-slate-200 text-slate-400"
          : "bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-subtle"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleComplete(task.id)}
          className="mt-0.5 text-slate-300 hover:text-emerald-500 transition-colors shrink-0"
          aria-label={task.completed ? "Mark incomplete" : "Mark completed"}
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
          ) : (
            <Circle className="w-5 h-5 group-hover:text-slate-400" />
          )}
        </button>

        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={cn(
                "text-xs font-semibold",
                task.completed ? "line-through text-slate-400" : "text-slate-900"
              )}
            >
              {task.title}
            </span>
            <span
              className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-full border",
                typeBadgeColors[task.type]
              )}
            >
              {task.type}
            </span>
          </div>

          <p className="text-xs text-slate-500 flex items-center gap-3">
            <span>{task.topic}</span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3" />
              {task.durationMinutes} min
            </span>
            <span className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
              <Award className="w-3 h-3" />
              +{task.xpReward} XP
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        {!task.completed ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStartTask && onStartTask(task)}
              leftIcon={<Play className="w-3 h-3 text-brand-600 fill-brand-600" />}
            >
              Start
            </Button>
            <Button
              variant="soft"
              size="sm"
              onClick={() => onToggleComplete(task.id)}
            >
              Done
            </Button>
          </>
        ) : (
          <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
            Completed
          </span>
        )}
      </div>
    </div>
  );
};
