"use client";

import React from "react";
import { BrandLogo } from "./BrandLogo";
import { NavItem } from "./NavItem";
import { navigationItems } from "@/lib/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onNavigate }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const visibleNavItems = navigationItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <aside
      className={cn(
        "w-[260px] h-screen bg-[var(--surface)] border-r border-[var(--border)] flex flex-col shrink-0 select-none",
        className
      )}
      aria-label="Main Navigation Sidebar"
    >
      {/* Brand Header */}
      <div className="h-[72px] px-5 flex items-center border-b border-[var(--border-subtle)] shrink-0">
        <BrandLogo />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[var(--charcoal-subtle)] font-semibold">
          Platform
        </div>
        {visibleNavItems.map((item) => (
          <NavItem key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      {/* Assistant Quick Callout */}
      <div className="p-3 mx-3 mb-3 rounded-[var(--radius-lg)] bg-[var(--surface-subtle)] border border-[var(--border)]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--charcoal)] mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[var(--cobalt)]" />
          <span>Internal Matching</span>
        </div>
        <p className="text-[11px] text-[var(--charcoal-muted)] leading-relaxed">
          Opportunities tailored directly to your verified coursework and resume.
        </p>
      </div>

      {/* Student Profile Quick Dock */}
      <div className="p-3 border-t border-[var(--border-subtle)] shrink-0">
        {user ? (
          <div className="flex items-center justify-between p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--surface-subtle)] transition-colors group">
            <Link
              href="/profile"
              onClick={onNavigate}
              className="flex items-center gap-2.5 min-w-0 flex-1"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--cobalt)] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                {user.fullName?.charAt(0) || "S"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[var(--charcoal)] truncate group-hover:text-[var(--cobalt)] transition-colors">
                  {user.fullName}
                </span>
                <span className="text-[10px] text-[var(--charcoal-subtle)] truncate">
                  {user.college || "Profile Active"}
                </span>
              </div>
            </Link>
          </div>
        ) : (
          <Link
            href="/login"
            onClick={onNavigate}
            className="flex items-center gap-2.5 p-2 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] hover:bg-[#EAE4D7] border border-[var(--border)] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[var(--cobalt)] text-white text-xs font-semibold flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[var(--charcoal)]">
                Sign In to Portal
              </span>
              <span className="text-[10px] text-[var(--charcoal-subtle)]">
                Unlock matching
              </span>
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
};
