"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  timeAgo: string;
  type: "deadline" | "hackathon" | "system";
  unread: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Deadline Approaching",
    detail: "Postman Product Design Intern closes in 3 days.",
    timeAgo: "2h ago",
    type: "deadline",
    unread: true,
  },
  {
    id: "notif-2",
    title: "Hackathon Registration",
    detail: "Smart India Hackathon 2026 regional teams finalizing.",
    timeAgo: "5h ago",
    type: "hackathon",
    unread: true,
  },
  {
    id: "notif-3",
    title: "New Opportunity Match",
    detail: "Zerodha Systems Engineer matches your Go & Systems skills.",
    timeAgo: "1d ago",
    type: "system",
    unread: false,
  },
];

export const NotificationTrigger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-[var(--radius-md)] text-[var(--charcoal-muted)]",
          "hover:text-[var(--charcoal)] hover:bg-[var(--surface-subtle)] border border-[var(--border)] bg-[var(--surface)]",
          "transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cobalt)]",
          isOpen && "border-[var(--cobalt)] bg-[var(--surface-subtle)] text-[var(--cobalt)]"
        )}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--cobalt)] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center border-2 border-[var(--surface)]">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-dropdown)] p-3 z-50"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-semibold text-[var(--charcoal)]">
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] text-[var(--cobalt)] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  Mark all as read
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-2.5 rounded-[var(--radius-md)] text-left transition-colors border",
                    item.unread
                      ? "bg-[var(--cobalt-light)]/40 border-[var(--primary-border)]/50"
                      : "bg-[var(--surface)] border-transparent hover:bg-[var(--surface-subtle)]"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-[var(--charcoal)] leading-tight">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-[var(--charcoal-subtle)] shrink-0 font-mono">
                      {item.timeAgo}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--charcoal-muted)] mt-1 leading-snug">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
