"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepInfo {
  number: number;
  title: string;
  shortDesc: string;
}

interface OnboardingStepperProps {
  steps: StepInfo[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
  maxAccessibleStep: number;
}

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  maxAccessibleStep,
}) => {
  return (
    <nav aria-label="Onboarding Progress" className="w-full select-none">
      {/* Desktop Stepper */}
      <ol className="hidden md:flex items-center justify-between gap-2 border-b border-[var(--border)] pb-6">
        {steps.map((step, idx) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isClickable = step.number <= maxAccessibleStep && onStepClick;

          return (
            <li
              key={step.number}
              className={cn(
                "flex-1 flex items-center gap-3",
                idx !== steps.length - 1 && "relative"
              )}
            >
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.number)}
                className={cn(
                  "group flex items-center gap-3 text-left transition-all",
                  isClickable ? "cursor-pointer" : "cursor-default"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {/* Step Circle */}
                <span
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors border",
                    isCompleted &&
                      "bg-[var(--cobalt)] border-[var(--cobalt)] text-white",
                    isCurrent &&
                      "bg-[var(--cobalt-light)] border-[var(--cobalt)] text-[var(--cobalt)] ring-2 ring-[var(--cobalt)]/20",
                    !isCompleted &&
                      !isCurrent &&
                      "bg-[var(--surface-subtle)] border-[var(--border)] text-[var(--charcoal-subtle)]"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.number}
                </span>

                {/* Step Labels */}
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-xs font-semibold tracking-tight transition-colors",
                      isCurrent && "text-[var(--cobalt)]",
                      isCompleted && "text-[var(--charcoal)]",
                      !isCurrent && !isCompleted && "text-[var(--charcoal-subtle)]"
                    )}
                  >
                    {step.title}
                  </span>
                  <span className="text-[10px] text-[var(--charcoal-subtle)] line-clamp-1">
                    {step.shortDesc}
                  </span>
                </div>
              </button>

              {/* Connecting Bar */}
              {idx !== steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-2 transition-colors",
                    isCompleted ? "bg-[var(--cobalt)]" : "bg-[var(--border)]"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile Stepper (Compact Header) */}
      <div className="md:hidden flex items-center justify-between pb-4 border-b border-[var(--border)]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cobalt)] font-semibold">
            Step {currentStep} of {steps.length}
          </span>
          <h2 className="text-sm font-semibold text-[var(--charcoal)]">
            {steps[currentStep - 1]?.title}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          {steps.map((step) => (
            <div
              key={step.number}
              className={cn(
                "h-1.5 rounded-full transition-all",
                step.number === currentStep
                  ? "w-6 bg-[var(--cobalt)]"
                  : step.number < currentStep
                  ? "w-3 bg-[var(--cobalt)]/60"
                  : "w-3 bg-[var(--border)]"
              )}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};
