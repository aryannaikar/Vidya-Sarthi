"use client";

import React, { useState, useMemo } from "react";
import { Opportunity } from "@/types/opportunity";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  Search,
  CheckCircle,
  AlertTriangle,
  Copy,
  Archive,
  Eye,
  Building,
} from "lucide-react";

interface OpportunityTableProps {
  opportunities: Opportunity[];
  onInspect: (opp: Opportunity) => void;
  onCompareDuplicate: (opp: Opportunity) => void;
  onQuickApprove: (oppId: string) => void;
  onArchive: (oppId: string) => void;
  isLoading?: boolean;
}

export const OpportunityTable: React.FC<OpportunityTableProps> = ({
  opportunities,
  onInspect,
  onCompareDuplicate,
  onQuickApprove,
  onArchive,
  isLoading = false,
}) => {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (selectedType !== "all" && opp.type !== selectedType) return false;
      if (selectedStatus !== "all" && opp.status !== selectedStatus) return false;
      if (selectedSource !== "all" && opp.officialSource !== selectedSource) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          opp.title.toLowerCase().includes(q) ||
          opp.company.toLowerCase().includes(q) ||
          opp.tags.some((t) => t.toLowerCase().includes(q)) ||
          opp.sourceRecordId?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [opportunities, search, selectedType, selectedStatus, selectedSource]);

  const statusTabCounts = useMemo(() => {
    return {
      all: opportunities.length,
      pending_review: opportunities.filter((o) => o.status === "pending_review").length,
      flagged_duplicate: opportunities.filter((o) => o.status === "flagged_duplicate").length,
      published: opportunities.filter((o) => o.status === "published").length,
      archived: opportunities.filter((o) => o.status === "archived").length,
    };
  }, [opportunities]);

  return (
    <div className="space-y-4">
      {/* Status Segmented Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
        {[
          { id: "all", label: "All Records", count: statusTabCounts.all },
          {
            id: "pending_review",
            label: "Needs Review",
            count: statusTabCounts.pending_review,
            variant: "warning",
          },
          {
            id: "flagged_duplicate",
            label: "Potential Duplicates",
            count: statusTabCounts.flagged_duplicate,
            variant: "danger",
          },
          {
            id: "published",
            label: "Published",
            count: statusTabCounts.published,
            variant: "success",
          },
          {
            id: "archived",
            label: "Archived",
            count: statusTabCounts.archived,
          },
        ].map((tab) => {
          const isActive = selectedStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-[var(--surface-card)] text-[var(--charcoal)] shadow-[var(--shadow-subtle)] border border-[var(--border)]"
                  : "text-[var(--charcoal-muted)] hover:text-[var(--charcoal)] hover:bg-[var(--surface-subtle)]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-[var(--cobalt-subtle)] text-[var(--cobalt)] font-semibold"
                    : "bg-[var(--border-subtle)] text-[var(--charcoal-subtle)]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2">
          <Input
            placeholder="Search by title, organization, skill, or source ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <Select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          options={[
            { value: "all", label: "All Opportunity Types" },
            { value: "job", label: "Full-Time Jobs" },
            { value: "internship", label: "Internships" },
            { value: "hackathon", label: "Hackathons" },
            { value: "competition", label: "Competitions" },
            { value: "mentorship_fellowship", label: "Fellowships & Mentorship" },
          ]}
        />

        <Select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          options={[
            { value: "all", label: "All Sources" },
            { value: "employer_direct", label: "Direct Employer Partners" },
            { value: "unstop_public", label: "National Competitions (Unstop)" },
            { value: "remotive_feed", label: "Remotive Remote API" },
          ]}
        />
      </div>

      {/* Table Container */}
      <div className={`rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-card)] overflow-hidden shadow-[var(--shadow-subtle)] transition-opacity ${isLoading ? "opacity-60 pointer-events-none" : ""}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--charcoal-muted)]">
                <th className="py-3 px-4 font-semibold">Title & Organization</th>
                <th className="py-3 px-3 font-semibold">Type</th>
                <th className="py-3 px-3 font-semibold">Source</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold">Required Skills</th>
                <th className="py-3 px-3 font-semibold">Deadline</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredOpportunities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--charcoal-muted)]">
                    No opportunities match the selected filters or search query.
                  </td>
                </tr>
              ) : (
                filteredOpportunities.map((opp) => {
                  const statusVariant =
                    opp.status === "published"
                      ? "success"
                      : opp.status === "flagged_duplicate"
                      ? "danger"
                      : opp.status === "pending_review"
                      ? "warning"
                      : "neutral";

                  const isDuplicate = opp.status === "flagged_duplicate";
                  const hasValidationErr = opp.validationErrors && opp.validationErrors.length > 0;

                  return (
                    <tr
                      key={opp.id}
                      className="hover:bg-[var(--surface-subtle)] transition-colors"
                    >
                      {/* Title & Organization */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-[var(--charcoal)] truncate">
                          {opp.title}
                        </div>
                        <div className="flex items-center gap-1.5 text-[var(--charcoal-muted)] mt-0.5">
                          <Building className="w-3 h-3 text-[var(--charcoal-subtle)]" />
                          <span>{opp.company}</span>
                          <span>•</span>
                          <span className="truncate">{opp.location}</span>
                        </div>
                        {hasValidationErr && (
                          <div className="flex items-center gap-1 text-[10px] text-[var(--danger)] font-medium mt-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span className="truncate">{opp.validationErrors?.[0]}</span>
                          </div>
                        )}
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <Badge
                          variant={
                            opp.type === "internship"
                              ? "cobalt"
                              : opp.type === "hackathon"
                              ? "warning"
                              : opp.type === "competition"
                              ? "default"
                              : "neutral"
                          }
                          monospace
                        >
                          {opp.type.toUpperCase().replace("_", " ")}
                        </Badge>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-mono text-[11px] text-[var(--charcoal-muted)]">
                          {opp.officialSource}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <Badge variant={statusVariant} dot monospace>
                          {opp.status?.toUpperCase() || "PENDING"}
                        </Badge>
                      </td>

                      {/* Required Skills */}
                      <td className="py-3.5 px-3 max-w-[200px]">
                        <div className="flex flex-wrap gap-1">
                          {opp.requiredSkills?.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-1.5 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--charcoal-muted)]"
                            >
                              {skill}
                            </span>
                          ))}
                          {(opp.requiredSkills?.length || 0) > 3 && (
                            <span className="text-[10px] font-mono text-[var(--charcoal-subtle)]">
                              +{(opp.requiredSkills?.length || 0) - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Deadline */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-mono text-[11px] text-[var(--charcoal)]">
                        {opp.deadline ? opp.deadline.slice(0, 10) : "N/A"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isDuplicate ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onCompareDuplicate(opp)}
                              className="text-[var(--danger)] border-[var(--danger)] hover:bg-[var(--danger-subtle)]"
                              leftIcon={<Copy className="w-3 h-3" />}
                            >
                              Compare
                            </Button>
                          ) : opp.status === "pending_review" ? (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => onQuickApprove(opp.id)}
                              leftIcon={<CheckCircle className="w-3 h-3" />}
                            >
                              Approve
                            </Button>
                          ) : null}

                          {opp.status !== "archived" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onArchive(opp.id)}
                              title="Archive record"
                              leftIcon={<Archive className="w-3 h-3 text-[var(--charcoal-subtle)]" />}
                            >
                              Archive
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onInspect(opp)}
                            leftIcon={<Eye className="w-3 h-3" />}
                          >
                            Inspect
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
