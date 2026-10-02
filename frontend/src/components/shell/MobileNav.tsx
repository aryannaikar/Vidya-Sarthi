"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { NavItem } from "./NavItem";
import { navigationItems } from "@/lib/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { drawerVariants, modalBackdropVariants } from "@/lib/motion";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const visibleNavItems = navigationItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-[#15181E]/40 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Drawer content */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 bottom-0 left-0 w-[280px] bg-[var(--surface)] border-r border-[var(--border)] shadow-[var(--shadow-dropdown)] flex flex-col z-50"
            role="dialog"
            aria-label="Mobile Navigation"
          >
            {/* Header */}
            <div className="h-[72px] px-5 flex items-center justify-between border-b border-[var(--border-subtle)] shrink-0">
              <BrandLogo showTagline={false} />
              <button
                onClick={onClose}
                className="p-1.5 rounded-[var(--radius-sm)] text-[var(--charcoal-subtle)] hover:text-[var(--charcoal)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
              <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[var(--charcoal-subtle)] font-semibold">
                Menu
              </div>
              {visibleNavItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  onNavigate={onClose}
                />
              ))}
            </div>

            {/* Tagline footer */}
            <div className="p-4 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--charcoal-subtle)]">
              Vidya Sarthi • Discover Opportunities
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
