"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

/**
 * 21st.dev inspired Animated Tabs
 * Smooth Framer Motion sliding pill indicator for clean filter bars
 */
export const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center p-1 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-[var(--radius-md)] gap-1",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-3.5 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] transition-colors select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cobalt)]",
              isActive
                ? "text-[var(--cobalt)]"
                : "text-[var(--charcoal-muted)] hover:text-[var(--charcoal)]"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-white rounded-[var(--radius-sm)] shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[var(--border-subtle)]"
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 32,
                }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.label}
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "text-[10px] font-mono px-1.5 py-0.2 rounded-full",
                    isActive
                      ? "bg-[var(--cobalt-light)] text-[var(--cobalt)]"
                      : "bg-[#EAE4D7] text-[var(--charcoal-muted)]"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
