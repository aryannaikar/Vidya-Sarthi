"use client";

import React from "react";
import { CompleteStudentProfile } from "@/types/student";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  User,
  Briefcase,
  Code,
  FileText,
  Globe,
  Edit2,
  CheckCircle2,
} from "lucide-react";

interface StepReviewConfirmProps {
  profile: CompleteStudentProfile;
  onEditStep: (stepNumber: number) => void;
}

export const StepReviewConfirm: React.FC<StepReviewConfirmProps> = ({
  profile,
  onEditStep,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--charcoal)] tracking-tight">
          Review & Finalize Student Profile
        </h3>
        <p className="text-xs text-[var(--charcoal-muted)] mt-1">
          Review your entered academic credentials, skills, and resume details before submitting
        </p>
      </div>

      <div className="space-y-4">
        {/* Step 1: Basic & Academic Summary */}
        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--charcoal)] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[var(--cobalt)]" />
              <span>Academic Credentials</span>
            </span>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-xs text-[var(--cobalt)] font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="text-xs text-[var(--charcoal-muted)] grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div>
              <span className="font-semibold text-[var(--charcoal)]">
                {profile.fullName}
              </span>{" "}
              ({profile.email})
            </div>
            <div>
              {profile.education.degree} in {profile.education.branch}
            </div>
            <div>{profile.education.college}</div>
            <div>
              Class of {profile.education.graduationYear} ({profile.education.academicYear})
            </div>
          </div>
        </Card>

        {/* Step 2: Preferences Summary */}
        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--charcoal)] flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[var(--cobalt)]" />
              <span>Career Preferences</span>
            </span>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs text-[var(--cobalt)] font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="text-xs text-[var(--charcoal-muted)] space-y-1 pt-1">
            <div className="flex flex-wrap gap-1">
              <span className="font-medium text-[var(--charcoal)]">Roles:</span>
              {profile.preferences.desiredRoles.map((r) => (
                <span key={r} className="px-1.5 py-0.2 bg-[var(--surface-subtle)] rounded text-[11px]">
                  {r}
                </span>
              ))}
            </div>
            <div>
              <span className="font-medium text-[var(--charcoal)]">Locations:</span>{" "}
              {profile.preferences.preferredLocations.join(", ") || "Any location"}
            </div>
            <div>
              <span className="font-medium text-[var(--charcoal)]">Mode:</span>{" "}
              {profile.preferences.workModePreference} •{" "}
              <span className="font-medium text-[var(--charcoal)]">Type:</span>{" "}
              {profile.preferences.opportunityTypePreference}
            </div>
          </div>
        </Card>

        {/* Step 3: Skills Summary */}
        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--charcoal)] flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-[var(--cobalt)]" />
              <span>Active Skills ({profile.technicalSkills.length})</span>
            </span>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-xs text-[var(--cobalt)] font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-1 pt-1">
            {profile.technicalSkills.map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-subtle)] text-[var(--charcoal)] border border-[var(--border-subtle)] text-xs font-mono"
              >
                {s}
              </span>
            ))}
          </div>
        </Card>

        {/* Step 4: Resume Summary */}
        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--charcoal)] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[var(--cobalt)]" />
              <span>Resume Document</span>
            </span>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-xs text-[var(--cobalt)] font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="text-xs text-[var(--charcoal-muted)] pt-1 flex items-center gap-2">
            <span className="font-semibold text-[var(--charcoal)]">
              {profile.resume?.fileName || "No document uploaded (manual entry)"}
            </span>
            {profile.resume && (
              <Badge variant="success" dot>
                Parsed & Ready
              </Badge>
            )}
          </div>
        </Card>

        {/* Step 5: Portfolio Summary */}
        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--charcoal)] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[var(--cobalt)]" />
              <span>Public Links</span>
            </span>
            <button
              type="button"
              onClick={() => onEditStep(5)}
              className="text-xs text-[var(--cobalt)] font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="text-xs text-[var(--charcoal-muted)] space-y-1 pt-1">
            {profile.portfolio.githubUrl && (
              <div>GitHub: {profile.portfolio.githubUrl}</div>
            )}
            {profile.portfolio.linkedinUrl && (
              <div>LinkedIn: {profile.portfolio.linkedinUrl}</div>
            )}
            {profile.portfolio.personalWebsite && (
              <div>Website: {profile.portfolio.personalWebsite}</div>
            )}
          </div>
        </Card>
      </div>

      <div className="p-4 rounded-[var(--radius-md)] bg-[var(--success-subtle)] border border-[#A7F3D0] flex items-center gap-2 text-xs text-[var(--success)]">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>
          Your profile is ready to be synchronized with the Vidya Sarthi opportunity matching engine.
        </span>
      </div>
    </div>
  );
};
