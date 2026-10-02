"use client";

import React, { useState } from "react";
import {
  PROGRAMMING_LANGUAGES,
  FRAMEWORKS_AND_TOOLS,
} from "@/lib/taxonomy";
import { WorkExperienceEntry, ProjectEntry } from "@/types/student";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, X, Briefcase, FolderGit2 } from "lucide-react";

interface StepSkillsExperienceProps {
  technicalSkills: string[];
  setTechnicalSkills: React.Dispatch<React.SetStateAction<string[]>>;
  softSkills: string[];
  setSoftSkills: React.Dispatch<React.SetStateAction<string[]>>;
  workExperience: WorkExperienceEntry[];
  setWorkExperience: React.Dispatch<React.SetStateAction<WorkExperienceEntry[]>>;
  projects: ProjectEntry[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectEntry[]>>;
}

export const StepSkillsExperience: React.FC<StepSkillsExperienceProps> = ({
  technicalSkills,
  setTechnicalSkills,
  softSkills,
  setSoftSkills,
  workExperience,
  setWorkExperience,
  projects,
  setProjects,
}) => {
  const [customSkill, setCustomSkill] = useState("");
  const [showAddExp, setShowAddExp] = useState(false);
  const [showAddProj, setShowAddProj] = useState(false);

  // New Exp state
  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expDesc, setExpDesc] = useState("");

  // New Proj state
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projTech, setProjTech] = useState("");

  const toggleTechSkill = (skill: string) => {
    setTechnicalSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleSoftSkill = (skill: string) => {
    setSoftSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !technicalSkills.includes(customSkill.trim())) {
      setTechnicalSkills((prev) => [...prev, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expRole || !expCompany) return;
    setWorkExperience((prev) => [
      ...prev,
      {
        id: `exp-${Date.now()}`,
        role: expRole,
        company: expCompany,
        startDate: "2026",
        isCurrent: false,
        description: expDesc,
        type: "internship",
      },
    ]);
    setExpRole("");
    setExpCompany("");
    setExpDesc("");
    setShowAddExp(false);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle) return;
    setProjects((prev) => [
      ...prev,
      {
        id: `proj-${Date.now()}`,
        title: projTitle,
        description: projDesc,
        technologies: projTech
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      },
    ]);
    setProjTitle("");
    setProjDesc("");
    setProjTech("");
    setShowAddProj(false);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--charcoal)] tracking-tight">
          Skills, Experience & Engineering Projects
        </h3>
        <p className="text-xs text-[var(--charcoal-muted)] mt-1">
          Select verified skills and add coursework projects or past internships
        </p>
      </div>

      <div className="space-y-6">
        {/* Selected Skills Chips */}
        <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--charcoal)]">
              Your Active Skills ({technicalSkills.length + softSkills.length})
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[32px]">
            {technicalSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-sm)] bg-white text-[var(--cobalt)] border border-[var(--primary-border)] text-xs font-medium"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => toggleTechSkill(skill)}
                  className="hover:text-[var(--danger)] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {softSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-sm)] bg-white text-[var(--charcoal)] border border-[var(--border)] text-xs font-medium"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => toggleSoftSkill(skill)}
                  className="hover:text-[var(--danger)] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Add Custom Skill Field */}
        <form onSubmit={handleAddCustomSkill} className="flex gap-2">
          <Input
            placeholder="Type custom skill (e.g. gRPC, Apache Spark)..."
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            size="sm"
            variant="outline"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add
          </Button>
        </form>

        {/* Taxonomy Suggestions: Languages */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[var(--charcoal-muted)] font-mono uppercase tracking-wider">
            Programming Languages
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PROGRAMMING_LANGUAGES.map((lang) => {
              const selected = technicalSkills.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleTechSkill(lang)}
                  className={`px-2.5 py-1 rounded-[var(--radius-sm)] text-xs font-mono transition-colors cursor-pointer border ${
                    selected
                      ? "bg-[var(--cobalt)] text-white border-[var(--cobalt)]"
                      : "bg-[var(--surface)] text-[var(--charcoal)] border-[var(--border)] hover:bg-[var(--surface-subtle)]"
                  }`}
                >
                  {selected ? "✓ " : "+ "}
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        {/* Taxonomy Suggestions: Frameworks & Tools */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[var(--charcoal-muted)] font-mono uppercase tracking-wider">
            Frameworks & Systems Tools
          </span>
          <div className="flex flex-wrap gap-1.5">
            {FRAMEWORKS_AND_TOOLS.map((tool) => {
              const selected = technicalSkills.includes(tool);
              return (
                <button
                  key={tool}
                  type="button"
                  onClick={() => toggleTechSkill(tool)}
                  className={`px-2.5 py-1 rounded-[var(--radius-sm)] text-xs font-mono transition-colors cursor-pointer border ${
                    selected
                      ? "bg-[var(--cobalt)] text-white border-[var(--cobalt)]"
                      : "bg-[var(--surface)] text-[var(--charcoal)] border-[var(--border)] hover:bg-[var(--surface-subtle)]"
                  }`}
                >
                  {selected ? "✓ " : "+ "}
                  {tool}
                </button>
              );
            })}
          </div>
        </div>

        {/* Experience Section */}
        <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--charcoal)] flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[var(--cobalt)]" />
              <span>Internship & Work Experience ({workExperience.length})</span>
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowAddExp(!showAddExp)}
            >
              {showAddExp ? "Cancel" : "+ Add Experience"}
            </Button>
          </div>

          {showAddExp && (
            <Card className="p-4 space-y-3 bg-[var(--surface-subtle)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Role Title"
                  placeholder="e.g. SDE Intern"
                  value={expRole}
                  onChange={(e) => setExpRole(e.target.value)}
                  required
                />
                <Input
                  label="Company / Lab"
                  placeholder="e.g. Razorpay"
                  value={expCompany}
                  onChange={(e) => setExpCompany(e.target.value)}
                  required
                />
              </div>
              <textarea
                placeholder="Brief summary of tasks and systems worked on..."
                rows={2}
                value={expDesc}
                onChange={(e) => setExpDesc(e.target.value)}
                className="w-full p-2.5 bg-white border border-[var(--border)] rounded-[var(--radius-md)] text-xs resize-none"
              />
              <Button type="button" size="sm" onClick={handleAddExperience}>
                Save Experience Entry
              </Button>
            </Card>
          )}

          {workExperience.map((exp) => (
            <div
              key={exp.id}
              className="p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] flex items-start justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-semibold text-[var(--charcoal)]">
                  {exp.role}
                </span>{" "}
                at <span className="font-medium">{exp.company}</span>
                <p className="text-[11px] text-[var(--charcoal-muted)] mt-0.5">
                  {exp.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setWorkExperience((prev) =>
                    prev.filter((item) => item.id !== exp.id)
                  )
                }
                className="text-[var(--charcoal-subtle)] hover:text-[var(--danger)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--charcoal)] flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-[var(--cobalt)]" />
              <span>Key Technical Projects ({projects.length})</span>
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowAddProj(!showAddProj)}
            >
              {showAddProj ? "Cancel" : "+ Add Project"}
            </Button>
          </div>

          {showAddProj && (
            <Card className="p-4 space-y-3 bg-[var(--surface-subtle)]">
              <Input
                label="Project Title"
                placeholder="e.g. Distributed Key-Value Store"
                value={projTitle}
                onChange={(e) => setProjTitle(e.target.value)}
                required
              />
              <Input
                label="Technologies (comma-separated)"
                placeholder="Go, Raft, Docker, gRPC"
                value={projTech}
                onChange={(e) => setProjTech(e.target.value)}
              />
              <textarea
                placeholder="Project architecture description..."
                rows={2}
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                className="w-full p-2.5 bg-white border border-[var(--border)] rounded-[var(--radius-md)] text-xs resize-none"
              />
              <Button type="button" size="sm" onClick={handleAddProject}>
                Save Project Entry
              </Button>
            </Card>
          )}

          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-3 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] flex items-start justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-semibold text-[var(--charcoal)]">
                  {proj.title}
                </span>
                <div className="flex flex-wrap gap-1 my-1">
                  {proj.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.2 bg-[var(--surface-subtle)] text-[10px] font-mono rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-[var(--charcoal-muted)]">
                  {proj.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setProjects((prev) =>
                    prev.filter((item) => item.id !== proj.id)
                  )
                }
                className="text-[var(--charcoal-subtle)] hover:text-[var(--danger)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
