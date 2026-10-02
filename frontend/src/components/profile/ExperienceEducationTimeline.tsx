"use client";

import React from "react";
import {
  EducationTimelineItem,
  ExperienceTimelineItem,
} from "@/types/intelligence";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { GraduationCap, Briefcase, Calendar, Building2 } from "lucide-react";

interface ExperienceEducationTimelineProps {
  education: EducationTimelineItem[];
  experience: ExperienceTimelineItem[];
}

export const ExperienceEducationTimeline: React.FC<
  ExperienceEducationTimelineProps
> = ({ education, experience }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--charcoal)] tracking-tight">
          Education & Work Experience Timeline
        </h3>
        <p className="text-xs text-[var(--charcoal-muted)] mt-0.5">
          Chronological record of verified degree programs, internships, and technical research projects
        </p>
      </div>

      {/* Education Milestones */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-[var(--charcoal-muted)] uppercase tracking-wider font-mono">
          Academic Standing
        </span>

        {education.map((edu) => (
          <Card key={edu.id} className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--charcoal)] shrink-0">
                <GraduationCap className="w-5 h-5 text-[var(--cobalt)]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-[var(--charcoal)]">
                    {edu.degree} in {edu.branch}
                  </h4>
                  {edu.isVerified && (
                    <Badge variant="success" dot>
                      Verified Enrolled
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[var(--charcoal-muted)]">
                  {edu.college}
                </p>
                <div className="text-[11px] font-mono text-[var(--charcoal-subtle)] pt-1">
                  Expected Graduation Class of {edu.graduationYear}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Experience & Projects */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-semibold text-[var(--charcoal-muted)] uppercase tracking-wider font-mono">
          Work & Lab Experience ({experience.length})
        </span>

        <div className="space-y-3">
          {experience.map((item) => (
            <Card key={item.id} className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--charcoal)] shrink-0">
                    <Briefcase className="w-5 h-5 text-[var(--charcoal-subtle)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-[var(--charcoal)]">
                        {item.role}
                      </h4>
                      <Badge
                        variant={item.type === "internship" ? "cobalt" : "default"}
                      >
                        {item.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--charcoal-muted)] mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
                      <span>{item.organization}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-[var(--charcoal-subtle)]" />
                        {item.startDate} – {item.endDate || "Present"}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-subtle)] text-[var(--charcoal-subtle)] border border-[var(--border-subtle)]">
                  Source: {item.source}
                </span>
              </div>

              <p className="text-xs text-[var(--charcoal-muted)] leading-relaxed pl-13">
                {item.description}
              </p>

              {item.extractedTechnologies && item.extractedTechnologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-13 pt-1">
                  {item.extractedTechnologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-subtle)] text-[var(--charcoal)] border border-[var(--border-subtle)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
