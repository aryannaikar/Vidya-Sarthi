"use client";

import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FileText, UploadCloud, Info } from "lucide-react";

interface ResumeMetadata {
  fileName: string;
  fileSizeBytes: number;
  parsedAt: string;
  confidenceTier: "high" | "medium" | "provisional";
  confidenceExplanation: string;
  rawSnippet: string;
}

interface ResumeInspectorCardProps {
  metadata?: ResumeMetadata;
  onUploadResume: (file: File) => void;
  isUploading?: boolean;
}

export const ResumeInspectorCard: React.FC<ResumeInspectorCardProps> = ({
  metadata,
  onUploadResume,
  isUploading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showRawSnippet, setShowRawSnippet] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadResume(file);
    }
  };

  const confidenceBadgeVariants = {
    high: { variant: "success" as const, label: "High Confidence" },
    medium: { variant: "warning" as const, label: "Medium Confidence" },
    provisional: { variant: "neutral" as const, label: "Provisional" },
  };

  const tier = metadata?.confidenceTier || "high";
  const badgeInfo = confidenceBadgeVariants[tier];

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--charcoal)] tracking-tight">
          Document Processing & Resume Parser Status
        </h3>
        <p className="text-xs text-[var(--charcoal-muted)] mt-0.5">
          Verified source document details and entity extraction confidence explanations
        </p>
      </div>

      <Card className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--cobalt-light)] text-[var(--cobalt)] flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-semibold text-[var(--charcoal)]">
                  {metadata?.fileName || "Student_Resume_2026.pdf"}
                </h4>
                <Badge variant={badgeInfo.variant} dot>
                  {badgeInfo.label}
                </Badge>
              </div>

              <p className="text-xs text-[var(--charcoal-muted)]">
                {metadata
                  ? `${Math.round(metadata.fileSizeBytes / 1024)} KB • Extracted on ${new Date(
                      metadata.parsedAt
                    ).toLocaleDateString()}`
                  : "Verified PDF Document"}
              </p>
            </div>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              isLoading={isUploading}
              leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
              onClick={() => fileInputRef.current?.click()}
            >
              Replace Resume
            </Button>
          </div>
        </div>

        {/* Confidence Explanation Banner */}
        <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border)] flex items-start gap-3">
          <Info className="w-4 h-4 text-[var(--cobalt)] shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <span className="font-semibold text-[var(--charcoal)]">
              Model Extraction Criteria:
            </span>
            <p className="text-[var(--charcoal-muted)] leading-relaxed">
              {metadata?.confidenceExplanation ||
                "Parsed entities strictly grounded in document sections. Student corrections always take precedence over AI suggestions."}
            </p>
          </div>
        </div>

        {/* Toggleable Raw Extraction Preview */}
        <div className="pt-2 border-t border-[var(--border-subtle)]">
          <button
            onClick={() => setShowRawSnippet(!showRawSnippet)}
            className="text-xs font-semibold text-[var(--cobalt)] hover:underline cursor-pointer flex items-center gap-1"
          >
            {showRawSnippet ? "Hide Extracted Text Preview" : "View Raw Extracted Text Preview"}
          </button>

          {showRawSnippet && metadata?.rawSnippet && (
            <div className="mt-3 p-3 rounded-[var(--radius-md)] bg-[#15181E] text-white font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto">
              {metadata.rawSnippet}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
