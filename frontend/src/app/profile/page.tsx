"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { AnimatedTabs } from "@/components/ui/AnimatedTabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SkillMatrix } from "@/components/profile/SkillMatrix";
import { CareerInsightsPanel } from "@/components/profile/CareerInsightsPanel";
import { PortfolioAnalysisCard } from "@/components/profile/PortfolioAnalysisCard";
import { CompletenessIndicator } from "@/components/profile/CompletenessIndicator";
import { ResumeInspectorCard } from "@/components/profile/ResumeInspectorCard";
import { ExperienceEducationTimeline } from "@/components/profile/ExperienceEducationTimeline";
import {
  getProfileIntelligence,
  updateSkillStatus,
  addCustomSkill,
  saveProfileIntelligence,
} from "@/lib/api/nlpClient";
import { ProfileIntelligenceData, SkillCategory } from "@/types/intelligence";
import { useAuth } from "@/lib/auth/AuthContext";
import { updateStudentProfile } from "@/lib/supabase/client";
import {
  GraduationCap,
  MapPin,
  Mail,
  RefreshCw,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [data, setData] = useState<ProfileIntelligenceData | null>(null);
  const [activeTab, setActiveTab] = useState("skills");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    getProfileIntelligence().then(setData);
  }, []);

  const handleConfirmSkill = async (id: string) => {
    const updated = await updateSkillStatus(id, "confirmed");
    setData(updated);
  };

  const handleRejectSkill = async (id: string) => {
    const updated = await updateSkillStatus(id, "rejected");
    setData(updated);
  };

  const handleAddSkill = async (name: string, category: SkillCategory) => {
    const updated = await addCustomSkill(name, category);
    setData(updated);
  };

  const handleReanalyzePortfolio = async (url: string) => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/nlp/analyze-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl: url }),
      });
      if (res.ok) {
        const portResult = await res.json();
        if (data) {
          const updated = { ...data, portfolio: portResult };
          await saveProfileIntelligence(updated);
          setData(updated);
        }
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUploadResume = async (file: File) => {
    setIsRefreshing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/nlp/analyze-resume", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const parsed = await res.json();
        if (data) {
          const updated = {
            ...data,
            resumeMetadata: {
              fileName: file.name,
              fileSizeBytes: file.size,
              parsedAt: new Date().toISOString(),
              confidenceTier: parsed.confidenceTier || "high",
              confidenceExplanation: parsed.confidenceExplanation || "",
              rawSnippet: parsed.rawSnippet || "",
            },
          };
          await saveProfileIntelligence(updated);
          setData(updated);
        }

        // Sync pgvector embedding directly to Supabase profiles table
        if (user?.id) {
          try {
            await updateStudentProfile(user.id, {
              resume_file_name: file.name,
              resume_raw_text: parsed.rawSnippet || "",
              resume_embedding: parsed.embedding || undefined,
            });
          } catch (syncErr) {
            console.warn("Could not sync resume pgvector embedding to Supabase:", syncErr);
          }
        }
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!data) return null;

  const tabs = [
    { id: "skills", label: "Skills & Evidence", count: data.skills.length },
    { id: "timeline", label: "Experience & Education" },
    { id: "insights", label: "Career Gaps & Insights" },
    { id: "portfolio", label: "Public Portfolio" },
    { id: "document", label: "Resume Status" },
  ];

  const allSkillsList = data.skills
    .filter((s) => s.status !== "rejected")
    .map((s) => s.name);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Student Overview Banner */}
        <div className="p-6 bg-[var(--surface-card)] rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-card)] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--cobalt)] text-white text-xl font-bold flex items-center justify-center shrink-0 shadow-xs">
                {data.fullName.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-[var(--charcoal)]">
                    {data.fullName}
                  </h2>
                  <Badge variant="success" dot>
                    Verified Profile
                  </Badge>
                  <span className="text-[10px] font-mono uppercase bg-[var(--cobalt-light)] text-[var(--cobalt)] px-2 py-0.5 rounded-[var(--radius-xs)] font-semibold">
                    NLP {data.analysisVersion}
                  </span>
                </div>
                <p className="text-xs text-[var(--charcoal-muted)]">
                  {data.headline}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--charcoal-subtle)] pt-1">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {data.college}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Bengaluru, Karnataka
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Mail className="w-3.5 h-3.5" />
                    {data.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
              <span className="text-[11px] font-mono text-[var(--charcoal-subtle)]">
                Last Intelligence Sync: {new Date(data.lastAnalyzedAt).toLocaleDateString()}
              </span>
              <Button
                variant="outline"
                size="sm"
                isLoading={isRefreshing}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                onClick={() => {
                  setIsRefreshing(true);
                  setTimeout(() => setIsRefreshing(false), 500);
                }}
              >
                Sync Profile State
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Completeness Checklist */}
        <CompletenessIndicator
          percentage={data.completenessPercentage}
          checklist={data.completenessChecklist}
        />

        {/* Navigation Tabs */}
        <div className="border-b border-[var(--border)] pb-2 overflow-x-auto">
          <AnimatedTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Tab Content Panels */}
        <div className="pt-2">
          {activeTab === "skills" && (
            <SkillMatrix
              skills={data.skills}
              onConfirmSkill={handleConfirmSkill}
              onRejectSkill={handleRejectSkill}
              onAddSkill={handleAddSkill}
            />
          )}

          {activeTab === "timeline" && (
            <ExperienceEducationTimeline
              education={data.education}
              experience={data.experience}
            />
          )}

          {activeTab === "insights" && (
            <CareerInsightsPanel
              careerGaps={data.careerGaps}
              allStudentSkills={allSkillsList}
            />
          )}

          {activeTab === "portfolio" && (
            <PortfolioAnalysisCard
              portfolio={data.portfolio}
              onReanalyze={handleReanalyzePortfolio}
              isReanalyzing={isRefreshing}
            />
          )}

          {activeTab === "document" && (
            <ResumeInspectorCard
              metadata={data.resumeMetadata}
              onUploadResume={handleUploadResume}
              isUploading={isRefreshing}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
