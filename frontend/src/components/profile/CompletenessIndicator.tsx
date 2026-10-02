"use client";

import React from "react";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  label: string;
  completed: boolean;
  importance: "required" | "recommended";
}

interface CompletenessIndicatorProps {
  percentage: number;
  checklist: ChecklistItem[];
  className?: string;
}

export const CompletenessIndicator: React.FC<CompletenessIndicatorProps> = ({
  percentage,
  checklist,
  className,
}) => {
  return (
    <div
      className={cn(
        "p-5 rounded-[var(--radius-lg)] bg-[var(--surface-card)] border border-[var(--border)] shadow-[var(--shadow-card)] space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[var(--charcoal)] tracking-tight">
            Profile Completeness
          </span>
          <p className="text-[11px] text-[var(--charcoal-muted)]">
            Based on required academic and technical matching criteria
          </p>
        </div>
        <span className="text-base font-semibold font-mono text-[var(--cobalt)]">
          {percentage}%
        </span>
      </div>

      {/* Linear progress bar */}
      <div className="w-full h-2 rounded-full bg-[var(--surface-subtle)] overflow-hidden">
        <div
          className="h-full bg-[var(--cobalt)] transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-2 pt-1 border-t border-[var(--border-subtle)]">
        {checklist.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs py-0.5"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px]",
                  item.completed
                    ? "bg-[var(--success-subtle)] text-[var(--success)]"
                    : "bg-[var(--surface-subtle)] text-[var(--charcoal-subtle)]"
                )}
              >
                {item.completed ? (
                  <Check className="w-2.5 h-2.5" />
                ) : (
                  <Circle className="w-2.5 h-2.5" />
                )}
              </span>
              <span
                className={cn(
                  item.completed
                    ? "text-[var(--charcoal)] font-medium"
                    : "text-[var(--charcoal-muted)]"
                )}
              >
                {item.label}
              </span>
            </div>

            <span
              className={cn(
                "text-[10px] font-mono uppercase tracking-wider",
                item.importance === "required"
                  ? "text-[var(--charcoal-subtle)] font-medium"
                  : "text-[var(--cobalt)]"
              )}
            >
              {item.importance}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
