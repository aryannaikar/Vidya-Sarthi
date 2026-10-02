"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NavItemConfig } from "@/types/navigation";

interface NavItemProps {
  item: NavItemConfig;
  onNavigate?: () => void;
  collapsed?: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({
  item,
  onNavigate,
  collapsed = false,
}) => {
  const pathname = usePathname();
  const isActive = item.exact
    ? pathname === item.href
    : pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cobalt)]",
        isActive
          ? "text-[var(--cobalt)] font-semibold"
          : "text-[var(--charcoal-muted)] hover:text-[var(--charcoal)] hover:bg-[#F3EFE7]",
        collapsed && "justify-center px-2"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Active Indicator Background pill */}
      {isActive && (
        <motion.div
          layoutId="sidebarActiveBackground"
          className="absolute inset-0 bg-[var(--cobalt-light)] border border-[var(--primary-border)] rounded-[var(--radius-md)] shadow-[0_1px_2px_rgba(30,78,216,0.04)]"
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 32,
          }}
        />
      )}

      {/* Icon */}
      <span className="relative z-10 shrink-0">
        <Icon
          className={cn(
            "w-4 h-4 transition-colors",
            isActive
              ? "text-[var(--cobalt)]"
              : "text-[var(--charcoal-subtle)] group-hover:text-[var(--charcoal)]"
          )}
          aria-hidden="true"
        />
      </span>

      {/* Label */}
      {!collapsed && (
        <span className="relative z-10 truncate tracking-tight">{item.label}</span>
      )}

      {/* Badge / Count */}
      {!collapsed && item.badge !== undefined && (
        <span
          className={cn(
            "relative z-10 ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-full font-semibold",
            isActive
              ? "bg-[var(--cobalt)] text-white"
              : "bg-[#E8E2D4] text-[var(--charcoal-muted)]"
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
};
