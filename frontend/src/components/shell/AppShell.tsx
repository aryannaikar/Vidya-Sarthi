"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motion";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Search, ArrowRight, Briefcase, Trophy, Sparkles } from "lucide-react";
import Link from "next/link";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Shortcut ⌘K / Ctrl+K opens quick opportunity search
  useKeyboardShortcut("k", () => setSearchModalOpen(true), { metaOrCtrl: true });

  return (
    <div className="min-h-screen bg-[var(--ground)] flex text-[var(--charcoal)] antialiased">
      {/* Desktop Sidebar (Fixed left) */}
      <div className="hidden lg:block">
        <Sidebar className="fixed top-0 bottom-0 left-0" />
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px]">
        {/* Header */}
        <Header
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenSearch={() => setSearchModalOpen(true)}
        />

        {/* Scrollable Page Body */}
        <motion.main
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto"
        >
          {children}
        </motion.main>
      </div>

      {/* Quick Search Modal / Command Palette */}
      <Modal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        title="Search Opportunities"
        description="Search jobs, internships, hackathons or skill paths"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <Input
            autoFocus
            leftIcon={<Search className="w-4 h-4" />}
            placeholder="Search by role, company, skill (e.g. React, Bangalore, Razorpay)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--charcoal-subtle)] font-semibold">
              Quick Portals
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Link
                href="/opportunities"
                onClick={() => setSearchModalOpen(false)}
                className="p-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-subtle)] hover:bg-[#EAE4D7] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[var(--cobalt)]" />
                  <span className="text-xs font-semibold">Browse Jobs</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--charcoal-subtle)] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/hackathons"
                onClick={() => setSearchModalOpen(false)}
                className="p-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-subtle)] hover:bg-[#EAE4D7] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[var(--warning)]" />
                  <span className="text-xs font-semibold">Hackathons</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--charcoal-subtle)] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/career-assistant"
                onClick={() => setSearchModalOpen(false)}
                className="p-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-subtle)] hover:bg-[#EAE4D7] flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--cobalt)]" />
                  <span className="text-xs font-semibold">AI Assistant</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--charcoal-subtle)] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
