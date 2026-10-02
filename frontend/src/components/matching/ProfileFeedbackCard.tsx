"use client";

import React from "react";
import { StudentMatchingContext } from "@/types/matching";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  Settings,
} from "lucide-react";

interface ProfileFeedbackCardProps {
  context: StudentMatchingContext;
  topMissingSkills: string[];
}

export const ProfileFeedbackCard: React.FC<ProfileFeedbackCardProps> = ({
  context,
  topMissingSkills,
}) => {
  return (
    <Card className="p-5 border-[var(--border)] bg-[var(--surface-card)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cobalt" dot monospace>
              PROFILE INTELLIGENCE
            </Badge>
          </div>
          <CardTitle className="text-base font-semibold text-[var(--charcoal)]">
            Matching Signals & Alignment
          </CardTitle>
          <span className="text-xs text-[var(--charcoal-muted)] block mt-0.5">
            Configured for {context.fullName} ({context.degree || "B.Tech CSE"})
          </span>
        </div>

        <Link href="/profile">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Settings className="w-3.5 h-3.5" />}
          >
            Update Preferences
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Confirmed Skills in Profile */}
        <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] space-y-2">
          <span className="font-semibold text-[var(--charcoal)] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" />
            <span>Validated Profile Competencies ({context.skills.length})</span>
          </span>
          <p className="text-[var(--charcoal-muted)] leading-relaxed">
            These skills drive your high-relevance recommendations across backend and full-stack positions:
          </p>
          <div className="flex flex-wrap gap-1 pt-1">
            {context.skills.slice(0, 6).map((skill) => (
              <Badge key={skill} variant="neutral" monospace>
                {skill}
              </Badge>
            ))}
            {context.skills.length > 6 && (
              <span className="text-[11px] font-mono text-[var(--charcoal-subtle)] self-center">
                +{context.skills.length - 6} more
              </span>
            )}
          </div>
        </div>

        {/* Growth Opportunities */}
        <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] space-y-2">
          <span className="font-semibold text-[var(--charcoal)] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-[var(--warning)]" />
            <span>High-Demand Market Skills to Acquire</span>
          </span>
          <p className="text-[var(--charcoal-muted)] leading-relaxed">
            Frequently requested across your target roles ({context.targetRoles[0]}):
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {topMissingSkills.length > 0 ? (
              topMissingSkills.map((skill) => (
                <Badge key={skill} variant="default" monospace>
                  +{skill}
                </Badge>
              ))
            ) : (
              <Badge variant="success">All Top Requisitions Covered</Badge>
            )}
          </div>
          <span className="text-[10px] text-[var(--charcoal-subtle)] block pt-1">
            Note: If you have already used these in coursework, you can confirm them in your profile.
          </span>
        </div>
      </div>
    </Card>
  );
};
