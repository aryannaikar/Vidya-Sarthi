"use client";

import React from "react";
import { MatchedOpportunity } from "@/types/matching";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
} from "lucide-react";

interface MatchRationaleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  match?: MatchedOpportunity;
}

export const MatchRationaleDrawer: React.FC<MatchRationaleDrawerProps> = ({
  isOpen,
  onClose,
  match,
}) => {
  if (!match) return null;
  const { opportunity, relevanceScore, eligibilityStatus, eligibilityNotes, matchedSkills, missingSkills } = match;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transparent Match Rationale & Signal Breakdown"
      description={`Calculated for ${opportunity.title} at ${opportunity.company}`}
      maxWidth="xl"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Documented Score Methodology Notice */}
        <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--charcoal)]">
              Documented Relevance Methodology:
            </span>
            <Badge variant="cobalt" monospace>
              {relevanceScore}% RELEVANCE ESTIMATE
            </Badge>
          </div>
          <p className="text-xs text-[var(--charcoal-muted)] leading-relaxed">
            Relevance is calculated using a multi-signal deterministic formula: <strong>40% Verified Skill Overlap</strong> + <strong>25% Semantic Role Alignment</strong> + <strong>15% Work Mode / Location Fit</strong> + <strong>20% Academic Cohort Criteria</strong>.
          </p>
          <div className="p-2.5 rounded bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[11px] text-[var(--charcoal-subtle)] flex items-start gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-[var(--charcoal)] shrink-0 mt-0.5" />
            <span>
              <strong>Ethical AI Disclosure:</strong> This score represents profile compatibility and evidence overlap with the employer&apos;s requisitions. It is <u>not</u> a guarantee of interview selection or hiring.
            </span>
          </div>
        </div>

        {/* Separated Eligibility Inspection */}
        <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--surface-card)] border border-[var(--border)] space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[var(--charcoal)]">
              Academic & Cohort Eligibility:
            </span>
            <Badge
              variant={eligibilityStatus === "confirmed_eligible" ? "success" : "warning"}
              monospace
            >
              {eligibilityStatus === "confirmed_eligible" ? "✓ CONFIRMED ELIGIBLE" : "VERIFICATION REQUIRED"}
            </Badge>
          </div>
          <p className="text-[var(--charcoal-muted)] leading-relaxed">
            {eligibilityNotes}
          </p>
        </div>

        {/* Skill Evidence Analysis */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-[var(--charcoal)] uppercase tracking-wider">
            Skill Compatibility & Evidence
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Matched */}
            <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--surface-card)] border border-[var(--success-subtle)] space-y-2">
              <span className="text-xs font-semibold text-[var(--success)] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified in Your Profile ({matchedSkills.length})</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchedSkills.map((skill) => (
                  <Badge key={skill} variant="neutral" monospace>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--surface-card)] border border-[var(--border-subtle)] space-y-2">
              <span className="text-xs font-semibold text-[var(--charcoal-muted)] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[var(--warning)]" />
                <span>Recommended to Develop ({missingSkills.length})</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.length > 0 ? (
                  missingSkills.map((skill) => (
                    <Badge key={skill} variant="default" monospace>
                      +{skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-[var(--success)] font-medium">
                    All primary required skills covered!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Application Advice */}
        <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--cobalt-subtle)] border border-[var(--border-subtle)] space-y-1 text-xs">
          <span className="font-semibold text-[var(--cobalt)]">
            Suggested Portfolio Strategy:
          </span>
          <p className="text-[var(--charcoal)] leading-relaxed">
            {match.suggestedAction}
          </p>
        </div>

        {/* Footer & Apply Action */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>

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
              Proceed to Application
            </Button>
          </a>
        </div>
      </div>
    </Modal>
  );
};
