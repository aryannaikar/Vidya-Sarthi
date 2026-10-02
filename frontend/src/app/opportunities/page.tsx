"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { AnimatedTabs } from "@/components/ui/AnimatedTabs";
import { Opportunity } from "@/types/opportunity";
import { MatchedOpportunity, StudentMatchingContext } from "@/types/matching";
import { opportunityService } from "@/lib/api/opportunityService";
import { matchingService, defaultStudentMatchingContext } from "@/lib/api/matchingService";
import { RecommendationCard } from "@/components/matching/RecommendationCard";
import { MatchRationaleDrawer } from "@/components/matching/MatchRationaleDrawer";
import { ProfileFeedbackCard } from "@/components/matching/ProfileFeedbackCard";
import { formatDeadlineRelative } from "@/lib/utils";
import {
  Search,
  Filter,
  ArrowUpRight,
  Building2,
  MapPin,
  Bookmark,
  BookmarkCheck,
  ShieldCheck,
} from "lucide-react";

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState("curated");
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([
    "opp-emp-dir-part-101",
    "opp-nat-hack-01",
  ]);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [matches, setMatches] = useState<MatchedOpportunity[]>([]);
  const [studentContext] = useState<StudentMatchingContext>(defaultStudentMatchingContext);
  const [isLoading, setIsLoading] = useState(true);

  // Selected match for deep-dive rationale drawer
  const [selectedMatchForDrawer, setSelectedMatchForDrawer] = useState<MatchedOpportunity | undefined>();
  const [isRationaleOpen, setIsRationaleOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadAllOpportunities() {
      setIsLoading(true);
      try {
        const [oppsData, matchResponse] = await Promise.all([
          opportunityService.getStudentOpportunities(),
          matchingService.getRecommendations(),
        ]);
        if (isMounted) {
          setOpportunities(oppsData);
          setMatches(matchResponse.matches);
        }
      } catch (err) {
        console.error("Failed to load opportunities:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadAllOpportunities();
    return () => {
      isMounted = false;
    };
  }, []);

  const tabs = [
    { id: "curated", label: "Curated For You", count: matches.length },
    { id: "all", label: "All Opportunities", count: opportunities.length },
    {
      id: "internship",
      label: "Internships",
      count: opportunities.filter((o) => o.type === "internship").length,
    },
    {
      id: "job",
      label: "Full-Time Roles",
      count: opportunities.filter((o) => o.type === "job").length,
    },
    {
      id: "mentorship_fellowship",
      label: "Fellowships & Programs",
      count: opportunities.filter((o) => o.type === "mentorship_fellowship").length,
    },
  ];

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenExplainability = (match: MatchedOpportunity) => {
    setSelectedMatchForDrawer(match);
    setIsRationaleOpen(true);
  };

  // Filter regular opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    if (activeTab !== "all" && opp.type !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        opp.title.toLowerCase().includes(q) ||
        opp.company.toLowerCase().includes(q) ||
        opp.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filter curated matches
  const filteredMatches = matches.filter((m) => {
    if (search) {
      const q = search.toLowerCase();
      return (
        m.opportunity.title.toLowerCase().includes(q) ||
        m.opportunity.company.toLowerCase().includes(q) ||
        m.matchedSkills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const allMissingSkills = Array.from(new Set(matches.flatMap((m) => m.missingSkills))).slice(0, 3);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="cobalt" dot monospace>
                MULTI-SIGNAL MATCHING ACTIVE
              </Badge>
              <span className="text-xs text-[var(--charcoal-muted)]">
                Separated eligibility & relevance estimates
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-[var(--charcoal)] tracking-tight">
              Opportunities & Personalized Matches
            </h2>
            <p className="text-xs text-[var(--charcoal-muted)] mt-0.5">
              Ranked against verified profile evidence for {studentContext.fullName} ({studentContext.degree})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <AnimatedTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </div>

        {/* Profile Feedback & Market Gap Banner when in curated tab */}
        {activeTab === "curated" && (
          <ProfileFeedbackCard
            context={studentContext}
            topMissingSkills={allMissingSkills}
          />
        )}

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              leftIcon={<Search className="w-4 h-4" />}
              placeholder="Search by role title, company, or tech stack (e.g. Go, React, Python)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
            Filter
          </Button>
        </div>

        {/* Listing Rows */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-36 rounded-[var(--radius-lg)] bg-[var(--surface-subtle)] animate-pulse border border-[var(--border)]"
              />
            ))}
          </div>
        ) : activeTab === "curated" ? (
          /* Personalized AI Recommendations Feed */
          <div className="space-y-4">
            {filteredMatches.length === 0 ? (
              <div className="p-12 text-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-card)]">
                <p className="text-sm font-medium text-[var(--charcoal)]">
                  No matching recommendations found for &quot;{search}&quot;.
                </p>
                <p className="text-xs text-[var(--charcoal-muted)] mt-1">
                  Try clearing the search query or exploring the &quot;All Opportunities&quot; tab.
                </p>
              </div>
            ) : (
              filteredMatches.map((match) => (
                <RecommendationCard
                  key={match.opportunity.id}
                  match={match}
                  isSaved={savedIds.includes(match.opportunity.id)}
                  onToggleSave={toggleSave}
                  onOpenExplainability={handleOpenExplainability}
                />
              ))
            )}
          </div>
        ) : (
          /* Standard Directory View */
          <div className="space-y-3">
            {filteredOpportunities.length === 0 ? (
              <div className="p-12 text-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-card)]">
                <p className="text-sm font-medium text-[var(--charcoal)]">
                  No published opportunities match your criteria.
                </p>
              </div>
            ) : (
              filteredOpportunities.map((opp) => {
                const isSaved = savedIds.includes(opp.id);
                const deadline = formatDeadlineRelative(opp.deadline);
                const sourceLabel =
                  opp.officialSource === "employer_direct"
                    ? "Direct Employer"
                    : opp.officialSource === "remotive_feed"
                    ? "Remotive Feed"
                    : opp.officialSource === "unstop_public"
                    ? "National Syndicate"
                    : "Verified Feed";

                return (
                  <div
                    key={opp.id}
                    className="p-5 bg-[var(--surface-card)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-card)] hover:border-[var(--border-strong)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--charcoal)] font-semibold text-sm shrink-0">
                        {opp.company.charAt(0)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-[var(--charcoal)]">
                            {opp.title}
                          </h3>
                          <Badge
                            variant={
                              opp.type === "internship"
                                ? "cobalt"
                                : opp.type === "mentorship_fellowship"
                                ? "warning"
                                : "default"
                            }
                            monospace
                          >
                            {opp.type.toUpperCase().replace("_", " ")}
                          </Badge>
                          <Badge variant="neutral" monospace>
                            <ShieldCheck className="w-2.5 h-2.5 inline mr-1 text-[var(--cobalt)]" />
                            {sourceLabel}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--charcoal-muted)] mt-1">
                          <span className="flex items-center gap-1 font-medium text-[var(--charcoal)]">
                            <Building2 className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
                            {opp.company}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
                            {opp.location} ({opp.workMode})
                          </span>
                          <span>•</span>
                          <span className="font-mono text-[var(--charcoal)] font-medium">
                            {opp.stipendOrSalary}
                          </span>
                        </div>

                        <p className="text-xs text-[var(--charcoal-muted)] mt-2 max-w-2xl leading-relaxed">
                          {opp.descriptionSnippet || opp.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {opp.requiredSkills?.map((skill) => (
                            <span
                              key={skill}
                              className="text-[11px] font-mono px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-subtle)] text-[var(--charcoal-muted)] border border-[var(--border-subtle)]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)]">
                      <button
                        onClick={() => toggleSave(opp.id)}
                        className="p-2 rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--charcoal-muted)] hover:text-[var(--charcoal)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
                        aria-label={isSaved ? "Unsave" : "Save"}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-[var(--cobalt)]" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      <div className="text-left md:text-right pr-2">
                        <span className="text-[10px] text-[var(--charcoal-subtle)] block">
                          Deadline
                        </span>
                        <span
                          className={`text-xs font-mono font-medium ${
                            deadline.isUrgent
                              ? "text-[var(--warning)] font-semibold"
                              : "text-[var(--charcoal)]"
                          }`}
                        >
                          {deadline.text}
                        </span>
                      </div>

                      <a
                        href={opp.originalPostingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          variant="primary"
                          rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                        >
                          Apply Directly
                        </Button>
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Explainability Deep-Dive Drawer */}
        <MatchRationaleDrawer
          isOpen={isRationaleOpen}
          onClose={() => setIsRationaleOpen(false)}
          match={selectedMatchForDrawer}
        />
      </div>
    </AppShell>
  );
}
