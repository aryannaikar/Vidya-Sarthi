"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { mockOpportunities } from "@/lib/api/mockData";
import { formatDeadlineRelative } from "@/lib/utils";
import {
  Bookmark,
  ArrowUpRight,
  BookmarkX,
} from "lucide-react";

export default function SavedPage() {
  const router = useRouter();
  const [savedOpportunities, setSavedOpportunities] = useState(
    mockOpportunities.filter((o) => o.isSaved)
  );

  const removeSaved = (id: string) => {
    setSavedOpportunities((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--charcoal)] tracking-tight">
              Saved Opportunities
            </h2>
            <p className="text-xs text-[var(--charcoal-muted)] mt-0.5">
              Bookmarked openings and deadlines you are currently following
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-[var(--charcoal-subtle)]">
            {savedOpportunities.length} Bookmarks
          </span>
        </div>

        {savedOpportunities.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="w-6 h-6" />}
            title="No saved opportunities yet"
            description="When you find an internship or full-time role worth tracking, click the bookmark icon on any listing to save it here."
            actionLabel="Discover Opportunities"
            onAction={() => router.push("/opportunities")}
          />
        ) : (
          <div className="space-y-3">
            {savedOpportunities.map((opp) => {
              const deadline = formatDeadlineRelative(opp.deadline);
              return (
                <div
                  key={opp.id}
                  className="p-5 bg-[var(--surface-card)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-card)] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--charcoal)] font-semibold text-sm shrink-0">
                      {opp.company.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[var(--charcoal)]">
                          {opp.title}
                        </h3>
                        <Badge
                          variant={opp.type === "internship" ? "cobalt" : "default"}
                        >
                          {opp.type === "internship" ? "Internship" : "Job"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[var(--charcoal-muted)] mt-1">
                        <span className="font-medium text-[var(--charcoal)]">
                          {opp.company}
                        </span>
                        <span>•</span>
                        <span>{opp.location}</span>
                        <span>•</span>
                        <span className="font-mono">{opp.stipendOrSalary}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                    <button
                      onClick={() => removeSaved(opp.id)}
                      className="p-2 rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--charcoal-subtle)] hover:text-[var(--danger)] hover:bg-[var(--danger-subtle)] transition-colors cursor-pointer"
                      title="Remove from saved"
                    >
                      <BookmarkX className="w-4 h-4" />
                    </button>

                    <div className="text-left md:text-right pr-2">
                      <span className="text-[10px] text-[var(--charcoal-subtle)] block">
                        Deadline
                      </span>
                      <span className="text-xs font-mono font-medium text-[var(--charcoal)]">
                        {deadline.text}
                      </span>
                    </div>

                    <a
                      href={opp.originalPostingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        variant="primary"
                        rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                      >
                        View Posting
                      </Button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
