"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AnimatedTabs } from "@/components/ui/AnimatedTabs";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { MatchedOpportunity, StudentMatchingContext } from "@/types/matching";
import { Opportunity } from "@/types/opportunity";
import { matchingService, defaultStudentMatchingContext } from "@/lib/api/matchingService";
import { opportunityService } from "@/lib/api/opportunityService";
import { MatchRationaleDrawer } from "@/components/matching/MatchRationaleDrawer";
import { formatDeadlineRelative } from "@/lib/utils";
import {
  ArrowUpRight,
  Compass,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Trophy,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [filterTab, setFilterTab] = useState("all");
  const [matches, setMatches] = useState<MatchedOpportunity[]>([]);
  const [hackathons, setHackathons] = useState<Opportunity[]>([]);
  const [studentContext] = useState<StudentMatchingContext>(defaultStudentMatchingContext);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedMatchForDrawer, setSelectedMatchForDrawer] = useState<MatchedOpportunity | undefined>();
  const [isRationaleOpen, setIsRationaleOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [matchRes, hackRes] = await Promise.all([
          matchingService.getRecommendations(),
          opportunityService.getStudentOpportunities({ type: "hackathon" }),
        ]);
        if (isMounted) {
          setMatches(matchRes.matches);
          setHackathons(hackRes);
        }
      } catch (err) {
        console.error("Dashboard matching load failed:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const tabs = [
    { id: "all", label: "Top Matches", count: matches.length },
    {
      id: "internships",
      label: "Internships",
      count: matches.filter((m) => m.opportunity.type === "internship").length,
    },
    {
      id: "jobs",
      label: "Graduate Roles",
      count: matches.filter((m) => m.opportunity.type === "job").length,
    },
  ];

  const filteredMatches = matches.filter((m) => {
    if (filterTab === "internships") return m.opportunity.type === "internship";
    if (filterTab === "jobs") return m.opportunity.type === "job";
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Top Hero Section: Intentional Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Welcome & Direct Match Summary (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between p-6 sm:p-8 rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)]">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="cobalt" dot monospace>
                  RECOMMENDATION ENGINE ACTIVE
                </Badge>
                <span className="text-xs text-[var(--charcoal-subtle)] font-mono">
                  AY 2026–27
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--charcoal)] tracking-tight leading-snug">
                Welcome back, {studentContext.fullName.split(" ")[0]}.
              </h2>
              <p className="text-sm text-[var(--charcoal-muted)] max-w-xl leading-relaxed">
                Vidya Sarthi has discovered <strong className="text-[var(--charcoal)]">{matches.length} high-relevance roles</strong> and <strong className="text-[var(--charcoal)]">{hackathons.length} verified hackathons</strong> matched to your coursework in {studentContext.targetRoles[0]}.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-xs text-[var(--charcoal-subtle)] block">
                    Target Preferences
                  </span>
                  <span className="text-sm font-semibold text-[var(--charcoal)]">
                    {studentContext.preferredLocations[0]} / Remote ({studentContext.preferredWorkModes.join(", ")})
                  </span>
                </div>
                <div className="h-8 w-px bg-[var(--border-subtle)]" />
                <div>
                  <span className="text-xs text-[var(--charcoal-subtle)] block">
                    Verified Profile
                  </span>
                  <span className="text-sm font-semibold text-[var(--success)] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {studentContext.college}
                  </span>
                </div>
              </div>

              <Link href="/opportunities">
                <Button size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                  Explore All Matches
                </Button>
              </Link>
            </div>
          </div>

          {/* AI Career Guide Spotlight Callout (4 cols) - 21st.dev inspired */}
          <SpotlightCard className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--cobalt-light)] text-[var(--cobalt)] flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[var(--charcoal)] mb-1">
                AI Career Assistant
              </h3>
              <p className="text-xs text-[var(--charcoal-muted)] leading-relaxed">
                Evaluate your resume against live requirements or practice customized technical interview scenarios.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[var(--border-subtle)]">
              <Link href="/career-assistant">
                <Button variant="secondary" size="sm" className="w-full">
                  Open Assistant
                </Button>
              </Link>
            </div>
          </SpotlightCard>
        </div>

        {/* Section 2: Opportunity Shortlist */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-[var(--charcoal)] tracking-tight">
                Recommended Opportunities
              </h3>
              <p className="text-xs text-[var(--charcoal-muted)]">
                Ranked by multi-signal skill overlap, role semantics and cohort eligibility
              </p>
            </div>

            <AnimatedTabs
              tabs={tabs}
              activeTab={filterTab}
              onChange={setFilterTab}
            />
          </div>

          {/* Opportunity List Rows */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-28 rounded-[var(--radius-lg)] bg-[var(--surface-subtle)] animate-pulse border border-[var(--border)]"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMatches.slice(0, 4).map((match) => {
                const { opportunity, relevanceScore, matchedSkills, eligibilityStatus } = match;
                const deadline = formatDeadlineRelative(opportunity.deadline);

                return (
                  <div
                    key={opportunity.id}
                    className="group p-5 bg-[var(--surface-card)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-card)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-elevated)] transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--charcoal)] font-semibold text-sm shrink-0">
                        {opportunity.company.charAt(0)}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-[var(--charcoal)] group-hover:text-[var(--cobalt)] transition-colors">
                            {opportunity.title}
                          </h4>
                          <Badge variant="cobalt" monospace dot>
                            {relevanceScore}% Relevance Estimate
                          </Badge>
                          <Badge
                            variant={eligibilityStatus === "confirmed_eligible" ? "success" : "warning"}
                            monospace
                          >
                            {eligibilityStatus === "confirmed_eligible" ? "Eligible" : "Likely Eligible"}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--charcoal-muted)]">
                          <span className="flex items-center gap-1 font-medium text-[var(--charcoal)]">
                            <Building2 className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
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

                        <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                          <span className="text-[11px] text-[var(--charcoal-subtle)] font-medium">
                            Matched Skills:
                          </span>
                          {matchedSkills.map((skill) => (
                            <span
                              key={skill}
                              className="px-1.5 py-0.2 rounded bg-[var(--success-subtle)] text-[var(--success)] font-mono text-[10px] font-medium"
                            >
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)]">
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

                      <button
                        onClick={() => {
                          setSelectedMatchForDrawer(match);
                          setIsRationaleOpen(true);
                        }}
                        className="p-1.5 rounded-[var(--radius-sm)] text-xs text-[var(--charcoal-subtle)] hover:text-[var(--charcoal)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
                        title="View relevance explanation"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>

                      <a
                        href={opportunity.originalPostingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          variant="primary"
                          rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                        >
                          Apply
                        </Button>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 3: Hackathons & Competitions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--charcoal)] tracking-tight">
                Recommended Coding Competitions & Hackathons
              </h3>
              <p className="text-xs text-[var(--charcoal-muted)]">
                Verified national challenges offering PPI opportunities and project verification
              </p>
            </div>
            <Link href="/hackathons">
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hackathons.slice(0, 3).map((hack) => (
              <Card key={hack.id} className="p-5 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <StatusIndicator
                      status={hack.workMode === "remote" ? "live" : "active"}
                      label={hack.workMode === "remote" ? "Virtual" : "Hybrid"}
                      pulse={hack.workMode === "remote"}
                    />
                    <Badge variant="warning" monospace>
                      <Trophy className="w-3 h-3 inline mr-1 text-[var(--warning)]" />
                      {hack.stipendOrSalary}
                    </Badge>
                  </div>

                  <div>
                    <CardTitle className="text-sm font-semibold line-clamp-2">
                      {hack.title}
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Organized by {hack.company}
                    </CardDescription>
                  </div>

                  <div className="text-xs text-[var(--charcoal-muted)] flex items-center gap-1.5 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
                    <span>Deadline: {new Date(hack.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-[var(--charcoal-subtle)] font-mono">
                    <ShieldCheck className="w-3 h-3 text-[var(--cobalt)]" />
                    <span>{hack.officialSource}</span>
                  </div>

                  <a
                    href={hack.originalPostingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline">
                      Register
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Explainability Rationale Modal */}
        <MatchRationaleDrawer
          isOpen={isRationaleOpen}
          onClose={() => setIsRationaleOpen(false)}
          match={selectedMatchForDrawer}
        />
      </div>
    </AppShell>
  );
}
