"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/utils";
import { User, LogOut, LogIn, ChevronDown, CheckCircle2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const UserMenu: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSignOut = async () => {
    setIsOpen(false);
    await logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--charcoal)] bg-[var(--surface-subtle)] hover:bg-[#EAE4D7] border border-[var(--border)] rounded-full transition-colors cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5 text-[var(--cobalt)]" />
          <span>Sign In</span>
        </Link>
        <Link
          href="/register"
          className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-[var(--cobalt)] hover:bg-[var(--cobalt-hover)] rounded-full transition-colors cursor-pointer shadow-xs"
        >
          Register
        </Link>
      </div>
    );
  }

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "VS";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-[var(--border)] bg-[var(--surface)]",
          "hover:border-[var(--border-strong)] hover:bg-[var(--surface-subtle)] transition-all cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cobalt)]",
          isOpen && "ring-2 ring-[var(--cobalt)]/20 border-[var(--cobalt)]"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Student Account Menu"
      >
        {/* Monogram Avatar */}
        <div className="w-7 h-7 rounded-full bg-[var(--cobalt)] text-white text-xs font-semibold flex items-center justify-center tracking-tight shadow-xs">
          {initials}
        </div>

        <div className="hidden md:flex flex-col text-left text-xs leading-none">
          <span className="font-semibold text-[var(--charcoal)] truncate max-w-[110px]">
            {user?.fullName || "Student"}
          </span>
          <span className="text-[10px] text-[var(--charcoal-subtle)] truncate max-w-[110px]">
            {user?.degree?.split(" ")[0] || "Profile Active"}
          </span>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-[var(--charcoal-subtle)] ml-0.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-dropdown)] p-2 z-50"
            role="menu"
          >
            {/* Header info */}
            <div className="p-3 border-b border-[var(--border-subtle)] mb-1">
              <p className="text-xs font-semibold text-[var(--charcoal)] truncate">
                {user?.fullName}
              </p>
              <p className="text-[11px] text-[var(--charcoal-muted)] truncate">
                {user?.email}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-[var(--success)] bg-[var(--success-subtle)] px-2 py-0.5 rounded-[var(--radius-xs)] w-fit">
                <CheckCircle2 className="w-3 h-3" />
                Resume Extracted & Ready
              </div>
            </div>

            {/* Menu Items */}
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--charcoal)] rounded-[var(--radius-sm)] hover:bg-[var(--surface-subtle)] transition-colors"
              role="menuitem"
            >
              <User className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
              Student Profile & Resume
            </Link>

            <Link
              href="/career-assistant"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--charcoal)] rounded-[var(--radius-sm)] hover:bg-[var(--surface-subtle)] transition-colors"
              role="menuitem"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--cobalt)]" />
              AI Career Guidance
            </Link>

            <div className="border-t border-[var(--border-subtle)] my-1" />

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--danger)] rounded-[var(--radius-sm)] hover:bg-[var(--danger-subtle)] transition-colors text-left cursor-pointer"
              role="menuitem"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
