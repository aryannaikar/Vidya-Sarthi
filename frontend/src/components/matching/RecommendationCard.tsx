"use client";

import React, { useState } from "react";
import { MatchedOpportunity } from "@/types/matching";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDeadlineRelative } from "@/lib/utils";
import {
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Building2,
  MapPin,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";

interface RecommendationCardProps {
  match: MatchedOpportunity;
  isSaved?: boolean;
  onToggleSave: (oppId: string) => void;
  onOpenExplainability: (match: MatchedOpportunity) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  match,
  isSaved = false,
  onToggleSave,
  onOpenExplainability,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { opportunity, relevanceScore, relevanceTier, eligibilityStatus, eligibilityNotes, matchedSkills, missingSkills } = match;

  const deadline = formatDeadlineRelative(opportunity.deadline);

  const tierBadgeVariant =
    relevanceTier === "exceptional"
      ? "cobalt"
      : relevanceTier === "strong"
      ? "success"
      : "default";

  const eligibilityBadgeVariant =
    eligibilityStatus === "confirmed_eligible"
      ? "success"
      : eligibilityStatus === "likely_eligible"
      ? "warning"
      : "neutral";

  return (
    <div className="p-5 bg-[var(--surface-card)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-card)] hover:border-[var(--border-strong)] transition-all space-y-4">
      {/* Top Meta Line: Badges & Relevance Estimate */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex flex-wrap items-center gap-2">
          {/* Explicitly labeled relevance estimate per prompt instructions */}
          <Badge variant={tierBadgeVariant} monospace dot>
            {relevanceScore}% Relevance Estimate
          </Badge>

          {/* Separated Eligibility status badge */}
          <Badge variant={eligibilityBadgeVariant} monospace>
            {eligibilityStatus === "confirmed_eligible" ? "✓ Confirmed Eligible" : "Likely Eligible"}
          </Badge>

          <Badge variant="neutral" monospace>
            <ShieldCheck className="w-2.5 h-2.5 inline mr-1 text-[var(--cobalt)]" />
            {opportunity.officialSource || "Verified Feed"}
          </Badge>
        </div>

        <span className="text-[11px] font-mono text-[var(--charcoal-subtle)]">
          {eligibilityNotes}
        </span>
      </div>

      {/* Main Body */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--charcoal)] font-bold text-base shrink-0">
            {opportunity.company.charAt(0)}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-[var(--charcoal)] tracking-tight">
                {opportunity.title}
              </h3>
              <Badge variant="default" monospace>
                {opportunity.type.toUpperCase().replace("_", " ")}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--charcoal-muted)]">
              <span className="flex items-center gap-1 font-medium text-[var(--charcoal)]">
                <Building2 className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
                {opportunity.company}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
                {opportunity.location} ({opportunity.workMode})
              </span>
              <span>•</span>
              <span className="font-mono text-[var(--charcoal)] font-medium">
                {opportunity.stipendOrSalary}
              </span>
            </div>

            <p className="text-xs text-[var(--charcoal-muted)] max-w-2xl leading-relaxed pt-1">
              {opportunity.descriptionSnippet || opportunity.description}
            </p>

            {/* Matched Skills vs Missing Skills Chips */}
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-[var(--charcoal)] mr-1">
                Verified Skills:
              </span>
              {matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--success-subtle)] text-[var(--success)] border border-[var(--success-subtle)] font-mono text-[11px] font-medium"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {skill}
                </span>
              ))}

              {missingSkills.slice(0, 2).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-subtle)] text-[var(--charcoal-muted)] border border-[var(--border-subtle)] font-mono text-[11px]"
                  title="Skill not identified in your profile evidence"
                >
                  +{skill} to develop
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)]">
          <div className="text-left md:text-right">
            <span className="text-[10px] text-[var(--charcoal-subtle)] block">
              Deadline
            </span>
            <span
              className={`text-xs font-mono font-medium ${
                deadline.isUrgent
                  ? "text-[var(--warning)] font-semibold"
                  : "text-[var(--charcoal)]"
              }`}
            >
              {deadline.text}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => onToggleSave(opportunity.id)}
              className="p-2 rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--charcoal-muted)] hover:text-[var(--charcoal)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
              aria-label={isSaved ? "Unsave" : "Save"}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-[var(--cobalt)]" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            <a
              href={opportunity.originalPostingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                variant="primary"
                rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
              >
                Apply
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Explainable Rationale Accordion Trigger */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-[var(--cobalt)] hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Why this matches your profile</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => onOpenExplainability(match)}
          className="text-[11px] text-[var(--charcoal-subtle)] hover:text-[var(--charcoal)] flex items-center gap-1 cursor-pointer"
        >
          <HelpCircle className="w-3 h-3" />
          <span>Score Breakdown</span>
        </button>
      </div>

      {/* Expandable Match Rationale Content */}
      {isExpanded && (
        <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] text-xs space-y-2">
          <p className="text-[var(--charcoal)] leading-relaxed">
            {match.matchRationale}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--charcoal-muted)] pt-1 border-t border-[var(--border-subtle)]">
            <span><strong>Target Role:</strong> {match.interestAlignment}</span>
            <span>•</span>
            <span><strong>Work Mode:</strong> {match.workModeAlignment}</span>
          </div>
          <div className="p-2 rounded bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[11px] text-[var(--cobalt)]">
            <strong>Suggested Profile Highlight:</strong> {match.suggestedAction}
          </div>
        </div>
      )}
    </div>
  );
};
