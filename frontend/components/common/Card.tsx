"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverable = false,
  bordered = true,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-subtle",
        bordered && "border border-slate-200/90",
        hoverable &&
          "transition-all duration-200 hover:shadow-card hover:border-slate-300 hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
