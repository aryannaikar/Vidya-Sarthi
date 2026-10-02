"use client";

import React from "react";
import { Opportunity } from "@/types/opportunity";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  CheckCircle,
  Copy,
  Building,
  MapPin,
  AlertCircle,
} from "lucide-react";

interface DuplicateComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateOpp?: Opportunity;
  originalOpp?: Opportunity;
  onResolve: (action: "resolve_duplicate_keep" | "resolve_duplicate_merge" | "approve") => void;
  isProcessing?: boolean;
}

export const DuplicateComparisonModal: React.FC<DuplicateComparisonModalProps> = ({
  isOpen,
  onClose,
  candidateOpp,
  originalOpp,
  onResolve,
  isProcessing = false,
}) => {
  if (!candidateOpp) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Duplicate Opportunity Resolution"
      description="Compare incoming aggregator record with canonical existing posting"
      maxWidth="xl"
      className="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Match Rationale Banner */}
        <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--danger-subtle)] border border-[var(--border)] flex items-start gap-3">
          <Copy className="w-4 h-4 text-[var(--danger)] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[var(--charcoal)]">
                Deduplication Detector Flag:
              </span>
              <Badge variant="danger" monospace>
                {Math.round((candidateOpp.similarityScore || 0.85) * 100)}% Content Overlap
              </Badge>
            </div>
            <p className="text-[var(--charcoal-muted)] leading-relaxed">
              Matching company name and high title semantic overlap detected. The engine prevents publishing duplicate job/internship listings to students.
            </p>
          </div>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Canonical Original */}
          <div className="p-4 rounded-[var(--radius-lg)] border-2 border-[var(--success)] bg-[var(--surface-card)] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--success)]">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Existing Canonical Record</span>
              </div>
              <Badge variant="success">Published</Badge>
            </div>

            {originalOpp ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-[var(--charcoal-subtle)] block">Title</span>
                  <div className="font-semibold text-sm text-[var(--charcoal)]">
                    {originalOpp.title}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[var(--charcoal-muted)]">
                  <Building className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
                  <span className="font-medium text-[var(--charcoal)]">{originalOpp.company}</span>
                  <span>•</span>
                  <Badge variant="default">{originalOpp.type.toUpperCase()}</Badge>
                </div>

                <div className="flex items-center gap-2 text-[var(--charcoal-muted)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
                  <span>{originalOpp.location} ({originalOpp.workMode})</span>
                </div>

                <div>
                  <span className="text-[10px] text-[var(--charcoal-subtle)] block">Source Provider</span>
                  <span className="font-mono text-[var(--charcoal)]">{originalOpp.officialSource}</span>
                </div>

                <div>
                  <span className="text-[10px] text-[var(--charcoal-subtle)] block">Skills</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {originalOpp.requiredSkills?.map((s) => (
                      <span key={s} className="px-1.5 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border-subtle)] font-mono text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[var(--charcoal-subtle)] block">Application URL</span>
                  <a
                    href={originalOpp.originalPostingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--cobalt)] hover:underline truncate block font-mono text-[11px] mt-0.5"
                  >
                    {originalOpp.originalPostingUrl}
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-[var(--charcoal-muted)]">
                Original record identifier: {candidateOpp.duplicateOfId || "Referenced Record"}
              </div>
            )}
          </div>

          {/* Incoming Candidate Duplicate */}
          <div className="p-4 rounded-[var(--radius-lg)] border-2 border-[var(--warning)] bg-[var(--surface-card)] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--warning)]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Incoming Candidate Record</span>
              </div>
              <Badge variant="warning">Flagged Duplicate</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-[var(--charcoal-subtle)] block">Title</span>
                <div className="font-semibold text-sm text-[var(--charcoal)]">
                  {candidateOpp.title}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[var(--charcoal-muted)]">
                <Building className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
                <span className="font-medium text-[var(--charcoal)]">{candidateOpp.company}</span>
                <span>•</span>
                <Badge variant="default">{candidateOpp.type.toUpperCase()}</Badge>
              </div>

              <div className="flex items-center gap-2 text-[var(--charcoal-muted)]">
                <MapPin className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
                <span>{candidateOpp.location} ({candidateOpp.workMode})</span>
              </div>

              <div>
                <span className="text-[10px] text-[var(--charcoal-subtle)] block">Source Provider</span>
                <span className="font-mono text-[var(--charcoal)]">{candidateOpp.officialSource}</span>
              </div>

              <div>
                <span className="text-[10px] text-[var(--charcoal-subtle)] block">Skills</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {candidateOpp.requiredSkills?.map((s) => (
                    <span key={s} className="px-1.5 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border-subtle)] font-mono text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[var(--charcoal-subtle)] block">Application URL</span>
                <a
                  href={candidateOpp.originalApplicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--cobalt)] hover:underline truncate block font-mono text-[11px] mt-0.5"
                >
                  {candidateOpp.originalApplicationUrl}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Resolution Decision Actions */}
        <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[var(--charcoal-muted)]">
            <span>Select the appropriate deduplication decision:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onResolve("approve")}
              disabled={isProcessing}
            >
              Both Are Distinct Roles
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => onResolve("resolve_duplicate_keep")}
              isLoading={isProcessing}
              leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
            >
              Keep Original & Archive Duplicate
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
