"use client";

import React, { useState } from "react";
import { Opportunity } from "@/types/opportunity";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Archive,
  Copy,
  Edit2,
  Save,
  Building,
  MapPin,
} from "lucide-react";

interface OpportunityDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity?: Opportunity;
  onAction: (
    action: "approve" | "reject" | "archive" | "flag_duplicate",
    updates?: Partial<Opportunity>
  ) => void;
  isProcessing?: boolean;
}

interface OpportunityEditFormProps {
  opportunity: Opportunity;
  onSave: (updates: Partial<Opportunity>) => void;
  onCancel: () => void;
  isProcessing: boolean;
}

const OpportunityEditForm: React.FC<OpportunityEditFormProps> = ({
  opportunity,
  onSave,
  onCancel,
  isProcessing,
}) => {
  const [editedTitle, setEditedTitle] = useState(opportunity.title);
  const [editedSalary, setEditedSalary] = useState(opportunity.stipendOrSalary);
  const [editedDeadline, setEditedDeadline] = useState(
    opportunity.deadline ? opportunity.deadline.slice(0, 10) : ""
  );
  const [editedSkills, setEditedSkills] = useState(
    (opportunity.requiredSkills || []).join(", ")
  );

  const handleSubmit = () => {
    const updatedSkills = editedSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      title: editedTitle,
      stipendOrSalary: editedSalary,
      deadline: editedDeadline ? `${editedDeadline}T23:59:59Z` : opportunity.deadline,
      requiredSkills: updatedSkills,
    });
  };

  return (
    <div className="space-y-4 p-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-card)]">
      <Input
        label="Opportunity Title"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Stipend or Salary"
          value={editedSalary}
          onChange={(e) => setEditedSalary(e.target.value)}
        />
        <Input
          label="Application Deadline (YYYY-MM-DD)"
          type="date"
          value={editedDeadline}
          onChange={(e) => setEditedDeadline(e.target.value)}
        />
      </div>
      <Input
        label="Required Skills (comma separated)"
        value={editedSkills}
        onChange={(e) => setEditedSkills(e.target.value)}
        hint="Normalized against standard Vidya Sarthi taxonomy"
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          variant="primary"
          onClick={handleSubmit}
          isLoading={isProcessing}
          leftIcon={<Save className="w-3.5 h-3.5" />}
        >
          Save & Publish Changes
        </Button>
      </div>
    </div>
  );
};

export const OpportunityDetailDrawer: React.FC<OpportunityDetailDrawerProps> = ({
  isOpen,
  onClose,
  opportunity,
  onAction,
  isProcessing = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!opportunity) return null;

  const handleSaveEdits = (updates: Partial<Opportunity>) => {
    onAction("approve", updates);
    setIsEditing(false);
  };

  const statusVariant =
    opportunity.status === "published"
      ? "success"
      : opportunity.status === "flagged_duplicate"
      ? "danger"
      : opportunity.status === "pending_review"
      ? "warning"
      : "neutral";

  const formattedCollectedAt = opportunity.collectedAt
    ? new Date(opportunity.collectedAt).toLocaleString()
    : "Recently Ingested";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Opportunity Record" : "Opportunity Ingestion Inspector"}
      description={`Record ID: ${opportunity.id} • Source: ${opportunity.officialSource}`}
      maxWidth="xl"
      className="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Validation Errors Alert if any */}
        {opportunity.validationErrors && opportunity.validationErrors.length > 0 && (
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--danger-subtle)] border border-[var(--border)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--danger)]">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Validation & Normalization Issues Detected</span>
            </div>
            <ul className="text-xs text-[var(--charcoal-muted)] list-disc pl-5 space-y-1">
              {opportunity.validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Header Information */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={statusVariant} monospace dot>
                {opportunity.status?.toUpperCase() || "PENDING"}
              </Badge>
              <Badge variant="cobalt">{opportunity.type.toUpperCase()}</Badge>
            </div>
            <h3 className="text-base font-semibold text-[var(--charcoal)] mt-1.5">
              {opportunity.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--charcoal-muted)] mt-1">
              <span className="flex items-center gap-1 font-medium text-[var(--charcoal)]">
                <Building className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
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
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            leftIcon={<Edit2 className="w-3.5 h-3.5" />}
          >
            {isEditing ? "Cancel Editing" : "Edit Fields"}
          </Button>
        </div>

        {/* View vs Edit Mode */}
        {isEditing ? (
          <OpportunityEditForm
            key={opportunity.id}
            opportunity={opportunity}
            onSave={handleSaveEdits}
            onCancel={() => setIsEditing(false)}
            isProcessing={isProcessing}
          />
        ) : (
          <div className="space-y-4">
            {/* Description Snippet */}
            <div>
              <span className="text-xs font-semibold text-[var(--charcoal)] block mb-1">
                Description & Responsibilities
              </span>
              <p className="text-xs text-[var(--charcoal-muted)] leading-relaxed p-3.5 rounded-[var(--radius-md)] bg-[var(--surface-card)] border border-[var(--border)]">
                {opportunity.description || opportunity.descriptionSnippet}
              </p>
            </div>

            {/* Extracted Skills Matrix */}
            <div>
              <span className="text-xs font-semibold text-[var(--charcoal)] block mb-1.5">
                Normalized Extracted Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.requiredSkills?.map((skill) => (
                  <Badge key={skill} variant="neutral" monospace>
                    {skill}
                  </Badge>
                ))}
                {opportunity.preferredSkills?.map((skill) => (
                  <Badge key={skill} variant="default" monospace>
                    {skill} (Preferred)
                  </Badge>
                ))}
              </div>
            </div>

            {/* Ingestion & Audit Details */}
            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] space-y-2.5 text-xs">
              <span className="font-semibold text-[var(--charcoal)] block mb-1">
                Ingestion Pipeline Metadata
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[var(--charcoal-muted)]">
                <div>
                  <span className="text-[10px] text-[var(--charcoal-subtle)] block">Official Provider</span>
                  <span className="font-mono text-[var(--charcoal)]">{opportunity.officialSource}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--charcoal-subtle)] block">Source Record ID</span>
                  <span className="font-mono text-[var(--charcoal)]">{opportunity.sourceRecordId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--charcoal-subtle)] block">Collected At</span>
                  <span className="font-mono text-[var(--charcoal)]">
                    {formattedCollectedAt}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--charcoal-subtle)] block">Eligibility Criteria</span>
                  <span className="text-[var(--charcoal)]">{opportunity.eligibility || "Standard University Criteria"}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-[10px] text-[var(--charcoal-subtle)] block">Original Application URL</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <a
                    href={opportunity.originalPostingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--cobalt)] hover:underline truncate text-xs font-mono"
                  >
                    {opportunity.originalPostingUrl}
                  </a>
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--cobalt)] shrink-0" />
                </div>
              </div>

              {opportunity.canonicalUrl && (
                <div>
                  <span className="text-[10px] text-[var(--charcoal-subtle)] block">Canonical Normalized URL</span>
                  <span className="font-mono text-[11px] text-[var(--charcoal-muted)] truncate block mt-0.5">
                    {opportunity.canonicalUrl}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Controls Bar */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAction("flag_duplicate")}
              disabled={isProcessing}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
            >
              Flag as Duplicate
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAction("archive")}
              disabled={isProcessing}
              leftIcon={<Archive className="w-3.5 h-3.5" />}
            >
              Archive
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="danger"
              onClick={() => onAction("reject")}
              disabled={isProcessing}
            >
              Reject
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => onAction("approve")}
              isLoading={isProcessing}
              leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
            >
              {opportunity.status === "published" ? "Re-Publish Record" : "Approve & Publish"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
