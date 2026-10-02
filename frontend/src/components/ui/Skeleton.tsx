import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "text";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  ...props
}) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-[#EFECE3] border border-[var(--border-subtle)]",
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4 rounded-[var(--radius-xs)]",
        variant === "rectangular" && "rounded-[var(--radius-md)]",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
};
