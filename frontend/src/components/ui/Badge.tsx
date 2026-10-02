import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "cobalt"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  monospace?: boolean;
  children: React.ReactNode;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--surface-subtle)] text-[var(--charcoal)] border-[var(--border)]",
  cobalt:
    "bg-[var(--cobalt-light)] text-[var(--cobalt)] border-[var(--primary-border)]",
  success:
    "bg-[var(--success-subtle)] text-[var(--success)] border-[#A7F3D0]",
  warning:
    "bg-[var(--warning-subtle)] text-[var(--warning)] border-[#FDE68A]",
  danger:
    "bg-[var(--danger-subtle)] text-[var(--danger)] border-[#FECDD3]",
  neutral:
    "bg-[#F0EEE6] text-[var(--charcoal-muted)] border-[var(--border-subtle)]",
};

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  dot = false,
  monospace = false,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium border rounded-[var(--radius-sm)]",
        monospace && "font-mono tracking-tight",
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            variant === "cobalt" && "bg-[var(--cobalt)]",
            variant === "success" && "bg-[var(--success)]",
            variant === "warning" && "bg-[var(--warning)]",
            variant === "danger" && "bg-[var(--danger)]",
            (variant === "default" || variant === "neutral") &&
              "bg-[var(--charcoal-muted)]"
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};
