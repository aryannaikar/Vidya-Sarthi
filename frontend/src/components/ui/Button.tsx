"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "subtle"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--cobalt)] text-white hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)] shadow-[var(--shadow-subtle)] border border-transparent",
  secondary:
    "bg-[var(--surface-subtle)] text-[var(--charcoal)] hover:bg-[#EAE4D7] border border-[var(--border)]",
  outline:
    "bg-[var(--surface)] text-[var(--charcoal)] border border-[var(--border)] hover:bg-[var(--surface-subtle)] hover:border-[var(--border-strong)]",
  subtle:
    "bg-[var(--cobalt-light)] text-[var(--cobalt)] hover:bg-[#E1EDFF] border border-[var(--primary-border)]",
  ghost:
    "bg-transparent text-[var(--charcoal-muted)] hover:text-[var(--charcoal)] hover:bg-[var(--surface-subtle)]",
  danger:
    "bg-[var(--danger-subtle)] text-[var(--danger)] hover:bg-[#FEE2E2] border border-[#FCA5A5]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 rounded-[var(--radius-sm)] gap-1.5 h-8 font-medium",
  md: "text-sm px-4 py-2 rounded-[var(--radius-md)] gap-2 h-10 font-medium",
  lg: "text-base px-5 py-2.5 rounded-[var(--radius-md)] gap-2.5 h-12 font-medium",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center transition-colors duration-150 select-none cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cobalt)] focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
