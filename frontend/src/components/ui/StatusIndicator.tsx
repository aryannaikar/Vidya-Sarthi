import React from "react";
import { cn } from "@/lib/utils";

export interface StatusIndicatorProps {
  status?: "live" | "urgent" | "closed" | "saved" | "active";
  pulse?: boolean;
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status = "active",
  pulse = false,
  label,
  className,
}) => {
  const colorMap = {
    live: "bg-[var(--success)]",
    active: "bg-[var(--cobalt)]",
    urgent: "bg-[var(--warning)]",
    closed: "bg-[var(--charcoal-subtle)]",
    saved: "bg-[var(--cobalt)]",
  };

  const ringMap = {
    live: "bg-[var(--success)]/20",
    active: "bg-[var(--cobalt)]/20",
    urgent: "bg-[var(--warning)]/20",
    closed: "bg-transparent",
    saved: "bg-[var(--cobalt)]/20",
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              ringMap[status]
            )}
          />
        )}
        <span
          className={cn("relative inline-flex rounded-full h-2 w-2", colorMap[status])}
        />
      </span>
      {label && (
        <span className="text-xs font-medium text-[var(--charcoal-muted)]">
          {label}
        </span>
      )}
    </div>
  );
};
