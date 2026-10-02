"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, Command } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { NotificationTrigger } from "./NotificationTrigger";
import { BrandLogo } from "./BrandLogo";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onOpenMobileNav: () => void;
  onOpenSearch?: () => void;
  className?: string;
}

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": {
    title: "Student Overview",
    subtitle: "Your active shortlist and upcoming deadlines",
  },
  "/opportunities": {
    title: "Jobs & Internships",
    subtitle: "Curated openings aligned with your skill profile",
  },
  "/hackathons": {
    title: "Hackathons & Challenges",
    subtitle: "Nearby and national developer competitions",
  },
  "/career-assistant": {
    title: "AI Career Assistant",
    subtitle: "Intelligent career path navigation and skill matching",
  },
  "/saved": {
    title: "Saved Opportunities",
    subtitle: "Bookmarks and listings you are tracking",
  },
  "/applications": {
    title: "Tracked Outbound Links",
    subtitle: "History of external portals you visited",
  },
  "/profile": {
    title: "Student Profile",
    subtitle: "Resume details, academic record and skills",
  },
};

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileNav,
  onOpenSearch,
  className,
}) => {
  const pathname = usePathname();
  const current = pageTitles[pathname] || {
    title: "Vidya Sarthi",
    subtitle: "Discover Opportunities. Unlock Potential.",
  };

  return (
    <header
      className={cn(
        "h-[72px] bg-[var(--surface)] border-b border-[var(--border)] px-4 md:px-8",
        "flex items-center justify-between gap-4 sticky top-0 z-30",
        className
      )}
    >
      {/* Left: Mobile trigger & Page context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--charcoal)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden">
          <BrandLogo showTagline={false} />
        </div>

        {/* Desktop Page Title & Editorial Breadcrumb */}
        <div className="hidden lg:flex flex-col">
          <h1 className="text-base font-semibold text-[var(--charcoal)] tracking-tight leading-tight">
            {current.title}
          </h1>
          {current.subtitle && (
            <p className="text-xs text-[var(--charcoal-subtle)] leading-none mt-0.5">
              {current.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Search, Notifications, User menu */}
      <div className="flex items-center gap-2.5">
        {/* Quick Search Button */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-subtle)] hover:bg-[#EFECE3] hover:border-[var(--border-strong)] text-[var(--charcoal-muted)] text-xs transition-colors cursor-pointer"
          aria-label="Quick search opportunities"
        >
          <Search className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
          <span className="text-[var(--charcoal-subtle)]">Search opportunities...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 font-mono text-[10px] bg-[var(--surface)] text-[var(--charcoal-subtle)] px-1.5 py-0.5 rounded-[var(--radius-xs)] border border-[var(--border)]">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Notification entry */}
        <NotificationTrigger />

        {/* User profile menu */}
        <UserMenu />
      </div>
    </header>
  );
};
