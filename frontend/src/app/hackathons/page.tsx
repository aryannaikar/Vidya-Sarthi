"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { Opportunity } from "@/types/opportunity";
import { opportunityService } from "@/lib/api/opportunityService";
import { mockHackathons } from "@/lib/api/mockData";
import { Calendar, MapPin, ArrowUpRight, ShieldCheck, Trophy } from "lucide-react";

export default function HackathonsPage() {
  const [competitions, setCompetitions] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadContests() {
      setIsLoading(true);
      try {
        const [hackathons, comps] = await Promise.all([
          opportunityService.getStudentOpportunities({ type: "hackathon" }),
          opportunityService.getStudentOpportunities({ type: "competition" }),
        ]);
        if (isMounted) {
          setCompetitions([...hackathons, ...comps]);
        }
      } catch (err) {
        console.error("Failed to load hackathons:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadContests();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="warning" dot monospace>
              VERIFIED CONTEST FEED
            </Badge>
            <span className="text-xs text-[var(--charcoal-muted)]">
              National hackathons & engineering sprints
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-[var(--charcoal)] tracking-tight">
            Hackathons & Coding Competitions
          </h2>
          <p className="text-xs text-[var(--charcoal-muted)] mt-0.5">
            Verified national student coding challenges, PPI opportunity tracks, and cash prizes
          </p>
        </div>

        {/* Dynamic Contests Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-64 rounded-[var(--radius-lg)] bg-[var(--surface-subtle)] animate-pulse border border-[var(--border)]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {competitions.length > 0 ? (
              competitions.map((hack) => (
                <Card key={hack.id} className="flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <StatusIndicator
                      status={hack.workMode === "remote" ? "live" : "active"}
                      label={hack.workMode === "remote" ? "Virtual / Online" : "Hybrid / Onsite"}
                      pulse={hack.workMode === "remote"}
                    />
                    <Badge variant="warning" monospace>
                      <Trophy className="w-3 h-3 inline mr-1 text-[var(--warning)]" />
                      {hack.stipendOrSalary}
                    </Badge>
                  </div>

                  <div>
                    <CardTitle className="text-base line-clamp-2">
                      {hack.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Organized by {hack.company}
                    </CardDescription>
                  </div>

                  <p className="text-xs text-[var(--charcoal-muted)] line-clamp-2 leading-relaxed">
                    {hack.descriptionSnippet || hack.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-[var(--charcoal-muted)] pt-2 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
                      <span>
                        Deadline:{" "}
                        <strong className="font-mono text-[var(--charcoal)]">
                          {new Date(hack.deadline).toLocaleDateString()}
                        </strong>
                      </span>
                    </div>
                    {hack.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
                        <span className="truncate">{hack.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {hack.requiredSkills?.map((skill) => (
                      <Badge key={skill} variant="neutral" monospace>
                        {skill}
                      </Badge>
                    ))}
                    <Badge variant="cobalt" monospace>
                      {hack.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-[var(--charcoal-subtle)]">
                    <ShieldCheck className="w-3 h-3 text-[var(--cobalt)]" />
                    <span>{hack.officialSource}</span>
                  </div>

                  <a
                    href={hack.originalPostingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                    >
                      Register
                    </Button>
                  </a>
                </div>
              </Card>
            ))
          ) : (
            mockHackathons.map((hack) => (
              <Card key={hack.id} className="flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <StatusIndicator
                      status={hack.mode === "online" ? "live" : "active"}
                      label={hack.mode === "online" ? "Virtual" : "In-Person"}
                      pulse={hack.mode === "online"}
                    />
                    <Badge variant="warning" monospace>
                      {hack.prizePool}
                    </Badge>
                  </div>

                  <div>
                    <CardTitle className="text-base line-clamp-2">
                      {hack.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Organized by {hack.organizer}
                    </CardDescription>
                  </div>

                  <div className="space-y-1.5 text-xs text-[var(--charcoal-muted)] pt-2 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
                      <span>
                        {new Date(hack.startDate).toLocaleDateString()} –{" "}
                        {new Date(hack.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {hack.tags.map((t) => (
                      <Badge key={t} variant="neutral">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[var(--charcoal-subtle)] block">
                      Registration Deadline
                    </span>
                    <span className="text-xs font-mono font-medium text-[var(--charcoal)]">
                      {new Date(hack.registrationDeadline).toLocaleDateString()}
                    </span>
                  </div>

                  <a
                    href={hack.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                    >
                      Register
                    </Button>
                  </a>
                </div>
              </Card>
            ))
          )}
        </div>
        )}
      </div>
    </AppShell>
  );
}
