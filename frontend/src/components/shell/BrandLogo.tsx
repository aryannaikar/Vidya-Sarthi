import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  collapsed?: boolean;
  className?: string;
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  collapsed = false,
  className,
  showTagline = true,
}) => {
  return (
    <Link
      href="/dashboard"
      className={cn(
        "group flex items-center gap-3 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cobalt)] rounded-[var(--radius-sm)]",
        className
      )}
      aria-label="Vidya Sarthi Homepage"
    >
      {/* Brand Emblem - Geometric Guide / Compass Star */}
      <div className="relative w-9 h-9 rounded-[var(--radius-md)] bg-[#15181E] flex items-center justify-center text-white shrink-0 shadow-[var(--shadow-subtle)] border border-[#2B303B] transition-transform duration-200 group-hover:scale-102">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
        >
          {/* Compass / Star Guide icon */}
          <polygon
            points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9 12 2"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <circle cx="12" cy="12" r="2" fill="white" />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-semibold tracking-tight text-[var(--charcoal)] font-sans">
              Vidya Sarthi
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cobalt)] font-semibold bg-[var(--cobalt-light)] px-1 rounded-[var(--radius-xs)]">
              Beta
            </span>
          </div>
          {showTagline && (
            <span className="text-[11px] text-[var(--charcoal-subtle)] tracking-tight">
              Discover Opportunities. Unlock Potential.
            </span>
          )}
        </div>
      )}
    </Link>
  );
};
