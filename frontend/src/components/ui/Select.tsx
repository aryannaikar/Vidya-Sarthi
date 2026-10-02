import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-[var(--charcoal)] tracking-tight"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full h-10 pl-3.5 pr-10 bg-[var(--surface)] text-sm text-[var(--charcoal)] appearance-none",
              "border border-[var(--border)] rounded-[var(--radius-md)]",
              "transition-colors duration-150 cursor-pointer",
              "hover:border-[var(--border-strong)]",
              "focus-visible:outline-none focus-visible:border-[var(--cobalt)] focus-visible:ring-2 focus-visible:ring-[var(--cobalt)]/20",
              error && "border-[var(--danger)]",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 w-4 h-4 text-[var(--charcoal-subtle)] pointer-events-none"
            aria-hidden="true"
          />
        </div>
        {error && (
          <span className="text-xs text-[var(--danger)] font-medium">{error}</span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
