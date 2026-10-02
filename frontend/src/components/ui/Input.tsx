import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-[var(--charcoal)] tracking-tight"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[var(--charcoal-subtle)] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full h-10 px-3.5 bg-[var(--surface)] text-sm text-[var(--charcoal)] placeholder:text-[var(--charcoal-subtle)]",
              "border border-[var(--border)] rounded-[var(--radius-md)]",
              "transition-colors duration-150",
              "hover:border-[var(--border-strong)]",
              "focus-visible:outline-none focus-visible:border-[var(--cobalt)] focus-visible:ring-2 focus-visible:ring-[var(--cobalt)]/20",
              "disabled:opacity-50 disabled:bg-[var(--surface-subtle)] disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-[var(--danger)] focus-visible:ring-[var(--danger)]/20",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[var(--charcoal-subtle)] flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <span className="text-xs text-[var(--danger)] font-medium">{error}</span>
        )}
        {!error && hint && (
          <span className="text-xs text-[var(--charcoal-muted)]">{hint}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
