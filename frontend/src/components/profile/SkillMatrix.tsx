"use client";

import React, { useState } from "react";
import {
  SkillEvidence,
  SkillCategory,
  SkillSource,
} from "@/types/intelligence";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { GithubIcon } from "@/components/ui/BrandIcons";
import {
  Check,
  X,
  Plus,
  FileText,
  User,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillMatrixProps {
  skills: SkillEvidence[];
  onConfirmSkill: (id: string) => void;
  onRejectSkill: (id: string) => void;
  onAddSkill: (name: string, category: SkillCategory) => void;
}

const categoryLabels: Record<SkillCategory, string> = {
  languages: "Programming Languages",
  frameworks: "Frameworks & Libraries",
  systems_cloud: "Systems, DevOps & Cloud",
  databases: "Databases & Storage",
  soft_skills: "Engineering Practices & Soft Skills",
};

const sourceIcons: Record<SkillSource, React.ReactNode> = {
  resume: <FileText className="w-3 h-3 text-[var(--charcoal-subtle)]" />,
  portfolio_github: <GithubIcon className="w-3 h-3 text-[var(--charcoal)]" />,
  manual: <User className="w-3 h-3 text-[var(--cobalt)]" />,
  project_description: <Sparkles className="w-3 h-3 text-[var(--warning)]" />,
};

const sourceLabels: Record<SkillSource, string> = {
  resume: "Resume Extracted",
  portfolio_github: "Verified on GitHub",
  manual: "Student Declared",
  project_description: "Project Description",
};

export const SkillMatrix: React.FC<SkillMatrixProps> = ({
  skills,
  onConfirmSkill,
  onRejectSkill,
  onAddSkill,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] =
    useState<SkillCategory>("languages");

  const categories: SkillCategory[] = [
    "languages",
    "frameworks",
    "systems_cloud",
    "databases",
    "soft_skills",
  ];

  const filteredSkills = skills.filter((s) => {
    if (selectedFilter === "confirmed") return s.status === "confirmed";
    if (selectedFilter === "suggested") return s.status === "suggested";
    return s.status !== "rejected";
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    onAddSkill(newSkillName.trim(), newSkillCategory);
    setNewSkillName("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--charcoal)] tracking-tight">
            Skill Intelligence & Source Attribution
          </h3>
          <p className="text-xs text-[var(--charcoal-muted)] mt-0.5">
            Normalized competencies tagged with multi-source evidence (Resume, GitHub, Coursework)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center p-1 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-[var(--radius-md)] text-xs">
            <button
              onClick={() => setSelectedFilter("all")}
              className={cn(
                "px-2.5 py-1 rounded-[var(--radius-sm)] font-medium transition-colors cursor-pointer",
                selectedFilter === "all"
                  ? "bg-white text-[var(--charcoal)] shadow-xs"
                  : "text-[var(--charcoal-muted)] hover:text-[var(--charcoal)]"
              )}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter("confirmed")}
              className={cn(
                "px-2.5 py-1 rounded-[var(--radius-sm)] font-medium transition-colors cursor-pointer",
                selectedFilter === "confirmed"
                  ? "bg-white text-[var(--cobalt)] shadow-xs"
                  : "text-[var(--charcoal-muted)] hover:text-[var(--charcoal)]"
              )}
            >
              Confirmed
            </button>
            <button
              onClick={() => setSelectedFilter("suggested")}
              className={cn(
                "px-2.5 py-1 rounded-[var(--radius-sm)] font-medium transition-colors cursor-pointer",
                selectedFilter === "suggested"
                  ? "bg-white text-[var(--warning)] shadow-xs"
                  : "text-[var(--charcoal-muted)] hover:text-[var(--charcoal)]"
              )}
            >
              AI Suggested
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Skill
          </Button>
        </div>
      </div>

      {/* Categorized Skill Groups */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const groupSkills = filteredSkills.filter((s) => s.category === cat);
          if (groupSkills.length === 0) return null;

          return (
            <div key={cat} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--charcoal-muted)] uppercase tracking-wider font-mono">
                  {categoryLabels[cat]} ({groupSkills.length})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {groupSkills.map((skill) => {
                  const isSuggested = skill.status === "suggested";

                  return (
                    <div
                      key={skill.id}
                      className={cn(
                        "p-3.5 rounded-[var(--radius-md)] border bg-[var(--surface-card)] transition-all",
                        isSuggested
                          ? "border-[var(--warning)]/40 bg-[var(--warning-subtle)]/30"
                          : "border-[var(--border)] hover:border-[var(--border-strong)]"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[var(--charcoal)]">
                              {skill.name}
                            </span>
                            <Badge
                              variant={isSuggested ? "warning" : "cobalt"}
                              dot={isSuggested}
                            >
                              {isSuggested ? "AI Suggested" : "Confirmed"}
                            </Badge>
                          </div>

                          {skill.contextSnippet && (
                            <p className="text-xs text-[var(--charcoal-muted)] line-clamp-2 leading-relaxed">
                              {skill.contextSnippet}
                            </p>
                          )}
                        </div>

                        {/* Interactive confirmation / rejection buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          {isSuggested ? (
                            <>
                              <button
                                onClick={() => onConfirmSkill(skill.id)}
                                className="p-1.5 rounded-[var(--radius-sm)] bg-[var(--success-subtle)] text-[var(--success)] hover:bg-[#D1FAE5] transition-colors cursor-pointer"
                                title="Confirm skill"
                                aria-label={`Confirm ${skill.name}`}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onRejectSkill(skill.id)}
                                className="p-1.5 rounded-[var(--radius-sm)] bg-[var(--danger-subtle)] text-[var(--danger)] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                                title="Reject extracted suggestion"
                                aria-label={`Reject ${skill.name}`}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => onRejectSkill(skill.id)}
                              className="p-1 rounded-[var(--radius-sm)] text-[var(--charcoal-subtle)] hover:text-[var(--danger)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
                              title="Remove skill"
                              aria-label={`Remove ${skill.name}`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Source attribution badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2.5 mt-2.5 border-t border-[var(--border-subtle)]">
                        <span className="text-[10px] text-[var(--charcoal-subtle)] font-mono">
                          Evidence:
                        </span>
                        {skill.sources.map((src) => (
                          <span
                            key={src}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] text-[10px] text-[var(--charcoal)]"
                            title={sourceLabels[src]}
                          >
                            {sourceIcons[src]}
                            <span>{src === "portfolio_github" ? "GitHub" : src}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Skill Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Verified Competency"
        description="Manually record a skill grounded in your engineering experience or coursework"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Skill or Technology Name *"
            placeholder="e.g. Apache Kafka, Rust, GraphQL"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            required
            autoFocus
          />

          <Select
            label="Technical Category *"
            options={categories.map((c) => ({
              label: categoryLabels[c],
              value: c,
            }))}
            value={newSkillCategory}
            onChange={(e) =>
              setNewSkillCategory(e.target.value as SkillCategory)
            }
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Skill
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
