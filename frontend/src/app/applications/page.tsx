"use client";

import React from "react";
import { AppShell } from "@/components/shell/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { ExternalLink, Calendar } from "lucide-react";

interface TrackedOutbound {
  id: string;
  roleTitle: string;
  company: string;
  visitedAt: string;
  url: string;
  type: "Job" | "Internship";
}

const outboundHistory: TrackedOutbound[] = [
  {
    id: "out-1",
    roleTitle: "Software Engineering Intern - Frontend",
    company: "Razorpay",
    visitedAt: "Yesterday at 4:15 PM",
    url: "https://razorpay.com/jobs",
    type: "Internship",
  },
  {
    id: "out-2",
    roleTitle: "Graduate Systems Engineer (2026 Batch)",
    company: "Zerodha",
    visitedAt: "Sep 30, 2026",
    url: "https://zerodha.com/careers",
    type: "Job",
  },
];

export default function ApplicationsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--charcoal)] tracking-tight">
            Tracked External Visits
          </h2>
          <p className="text-xs text-[var(--charcoal-muted)] mt-0.5">
            Log of external portal postings you navigated to from Vidya Sarthi
          </p>
        </div>

        <div className="space-y-3">
          {outboundHistory.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-[var(--surface-card)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-card)] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--charcoal)] font-semibold text-sm shrink-0">
                  {item.company.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--charcoal)]">
                      {item.roleTitle}
                    </h3>
                    <Badge variant={item.type === "Internship" ? "cobalt" : "default"}>
                      {item.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--charcoal-muted)] mt-1">
                    <span className="font-medium text-[var(--charcoal)]">
                      {item.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
                      Visited {item.visitedAt}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <StatusIndicator status="active" label="Outbound Link Followed" />
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  >
                    Revisit Posting
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
