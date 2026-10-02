"use client";

import React, { useState } from "react";
import { CareerGapAnalysis } from "@/types/intelligence";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Compass, CheckCircle2, AlertCircle, Lightbulb, ArrowRight } from "lucide-react";

interface CareerInsightsPanelProps {
  careerGaps: CareerGapAnalysis[];
  allStudentSkills: string[];
}

export const CareerInsightsPanel: React.FC<CareerInsightsPanelProps> = ({
  careerGaps,
}) => {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);

  const activeInsight = careerGaps[selectedRoleIndex] || careerGaps[0];

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="cobalt" dot>
            Explainable AI Gap Analysis
          </Badge>
          <span className="text-xs font-mono text-[var(--charcoal-subtle)]">
            Evidence-Based
          </span>
        </div>
        <h3 className="text-lg font-semibold text-[var(--charcoal)] tracking-tight">
          Role Alignment & Skill Gap Intelligence
        </h3>
        <p className="text-xs text-[var(--charcoal-muted)] mt-0.5">
          Objective gap analysis comparing verified competencies against real engineering market requisitions
        </p>
      </div>

      {/* Target Role Selector */}
      <div className="flex flex-wrap gap-2">
        {careerGaps.map((item, idx) => (
          <button
            key={item.targetRole}
            onClick={() => setSelectedRoleIndex(idx)}
            className={`px-3.5 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold border transition-all cursor-pointer ${
              selectedRoleIndex === idx
                ? "bg-[var(--cobalt)] border-[var(--cobalt)] text-white shadow-xs"
                : "bg-[var(--surface-card)] border-[var(--border)] text-[var(--charcoal)] hover:bg-[var(--surface-subtle)]"
            }`}
          >
            {item.targetRole}
          </button>
        ))}
      </div>

      {activeInsight && (
        <div className="space-y-4">
          {/* Rationale & Explainable Evidence */}
          <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface-card)] border border-[var(--border)] shadow-[var(--shadow-card)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--charcoal)]">
              <Compass className="w-4 h-4 text-[var(--cobalt)]" />
              <span>Matching Assessment for {activeInsight.targetRole}</span>
            </div>
            <p className="text-xs text-[var(--charcoal-muted)] leading-relaxed">
              {activeInsight.rationale}
            </p>
          </div>

          {/* Side-by-Side: Supported Skills vs Skill Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supported Competencies */}
            <Card className="p-5 border-l-4 border-l-[var(--success)]">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--charcoal)] font-mono">
                  Supported by Profile Evidence ({activeInsight.supportedSkills.length})
                </h4>
              </div>
              <p className="text-xs text-[var(--charcoal-muted)] mb-3">
                Technologies validated through your projects, resume or GitHub repositories
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeInsight.supportedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--success-subtle)] text-[var(--success)] border border-[#A7F3D0] text-xs font-mono font-medium"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </Card>

            {/* Recommended Skills to Acquire (Gaps) */}
            <Card className="p-5 border-l-4 border-l-[var(--warning)]">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-[var(--warning)]" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--charcoal)] font-mono">
                  Recommended to Acquire ({activeInsight.recommendedSkillsToAcquire.length})
                </h4>
              </div>
              <p className="text-xs text-[var(--charcoal-muted)] mb-3">
                Key requisitions commonly requested by top employers hiring for this role
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeInsight.recommendedSkillsToAcquire.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--warning-subtle)] text-[var(--warning)] border border-[#FDE68A] text-xs font-mono font-medium"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Actionable Project Ideas to Bridge the Gap */}
          <Card className="p-5">
            <CardHeader className="p-0 mb-3">
              <div className="flex items-center gap-2 text-[var(--charcoal)]">
                <Lightbulb className="w-4 h-4 text-[var(--cobalt)]" />
                <CardTitle className="text-sm">
                  Recommended Project Explorations to Bridge the Gap
                </CardTitle>
              </div>
              <p className="text-xs text-[var(--charcoal-muted)]">
                High-leverage engineering projects that will directly demonstrate proficiency in missing areas
              </p>
            </CardHeader>
            <CardContent className="p-0 space-y-2.5 pt-1">
              {activeInsight.suggestedProjectAreas.map((project, i) => (
                <div
                  key={i}
                  className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex items-start justify-between gap-3 text-xs text-[var(--charcoal)]"
                >
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-[var(--cobalt)] font-semibold">
                      0{i + 1}.
                    </span>
                    <span>{project}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--charcoal-subtle)] shrink-0 mt-0.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
