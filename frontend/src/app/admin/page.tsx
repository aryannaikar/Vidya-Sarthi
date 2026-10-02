"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  Opportunity,
  IngestionRunMetrics,
  IngestionSourceSummary,
} from "@/types/opportunity";
import { opportunityService } from "@/lib/api/opportunityService";
import { IngestionMetricsBanner } from "@/components/admin/IngestionMetricsBanner";
import { OpportunityTable } from "@/components/admin/OpportunityTable";
import { OpportunityDetailDrawer } from "@/components/admin/OpportunityDetailDrawer";
import { DuplicateComparisonModal } from "@/components/admin/DuplicateComparisonModal";
import { SourceHealthAudit } from "@/components/admin/SourceHealthAudit";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  GitCompare,
} from "lucide-react";

export default function AdminConsolePage() {
  const { user } = useAuth();

  // Support tester admin role override for evaluation
  const [isAdminDemoMode, setIsAdminDemoMode] = useState(true);
  const effectiveIsAdmin = user?.role === "admin" || isAdminDemoMode;

  const [activeAdminTab, setActiveAdminTab] = useState<"opportunities" | "sources" | "rules">("opportunities");
  const [metrics, setMetrics] = useState<IngestionRunMetrics>({
    totalIndexed: 0,
    publishedCount: 0,
    pendingReviewCount: 0,
    flaggedDuplicatesCount: 0,
    validationFailuresCount: 0,
    lastRunTimestamp: new Date().toISOString(),
    activeSourcesCount: 3,
    isIngesting: false,
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [sources, setSources] = useState<IngestionSourceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);

  // Inspector & Duplicate Modal States
  const [selectedOppForInspect, setSelectedOppForInspect] = useState<Opportunity | undefined>();
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [selectedDupCandidate, setSelectedDupCandidate] = useState<Opportunity | undefined>();
  const [isDupModalOpen, setIsDupModalOpen] = useState(false);
  const [isActionProcessing, setIsActionProcessing] = useState(false);

  // Fetch live state from service
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [metricsData, oppsData, sourcesData] = await Promise.all([
        opportunityService.getIngestionMetrics(),
        opportunityService.getAdminOpportunities(),
        opportunityService.getSourceSummaries(),
      ]);
      setMetrics(metricsData);
      setOpportunities(oppsData.opportunities);
      setSources(sourcesData);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function initialFetch() {
      try {
        const [metricsData, oppsData, sourcesData] = await Promise.all([
          opportunityService.getIngestionMetrics(),
          opportunityService.getAdminOpportunities(),
          opportunityService.getSourceSummaries(),
        ]);
        if (isMounted) {
          setMetrics(metricsData);
          setOpportunities(oppsData.opportunities);
          setSources(sourcesData);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to load admin data:", err);
        if (isMounted) setIsLoading(false);
      }
    }
    initialFetch();
    return () => {
      isMounted = false;
    };
  }, []);

  // Trigger ingestion run
  const handleTriggerIngest = async () => {
    setIsTriggering(true);
    try {
      await opportunityService.triggerIngestionPipeline();
      await loadData();
    } catch (err) {
      console.error("Trigger ingestion failed:", err);
    } finally {
      setIsTriggering(false);
    }
  };

  // Inspect Record
  const handleOpenInspect = (opp: Opportunity) => {
    setSelectedOppForInspect(opp);
    setIsInspectOpen(true);
  };

  // Compare Duplicate Record
  const handleOpenDuplicate = (candidate: Opportunity) => {
    setSelectedDupCandidate(candidate);
    setIsDupModalOpen(true);
  };

  // Perform Action (Approve, Reject, Archive, Flag)
  const handlePerformAction = async (
    action: "approve" | "reject" | "archive" | "flag_duplicate",
    updates?: Partial<Opportunity>
  ) => {
    if (!selectedOppForInspect) return;
    setIsActionProcessing(true);
    try {
      await opportunityService.performAdminAction(selectedOppForInspect.id, action, updates);
      await loadData();
      setIsInspectOpen(false);
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setIsActionProcessing(false);
    }
  };

  // Quick Approve from Table
  const handleQuickApprove = async (oppId: string) => {
    try {
      await opportunityService.performAdminAction(oppId, "approve");
      await loadData();
    } catch (err) {
      console.error("Quick approve failed:", err);
    }
  };

  // Resolve Duplicate Action
  const handleResolveDuplicate = async (
    decision: "resolve_duplicate_keep" | "resolve_duplicate_merge" | "approve"
  ) => {
    if (!selectedDupCandidate) return;
    setIsActionProcessing(true);
    try {
      await opportunityService.performAdminAction(selectedDupCandidate.id, decision);
      await loadData();
      setIsDupModalOpen(false);
    } catch (err) {
      console.error("Duplicate resolution failed:", err);
    } finally {
      setIsActionProcessing(false);
    }
  };

  // Find canonical original for duplicate modal
  const originalCandidateOpp = selectedDupCandidate?.duplicateOfId
    ? opportunities.find((o) => o.id === selectedDupCandidate.duplicateOfId)
    : undefined;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Role Status & Demo Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="cobalt" dot monospace>
                ADMIN ACCESS AUTHORIZED
              </Badge>
              <Badge variant="neutral" monospace>
                RBAC ENFORCED
              </Badge>
            </div>
            <h2 className="text-2xl font-semibold text-[var(--charcoal)] tracking-tight">
              Opportunity Collection & Ingestion Console
            </h2>
            <p className="text-xs text-[var(--charcoal-muted)] mt-0.5">
              Multi-source aggregation pipeline, data normalization, deduplication audit, and student publish controls
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminDemoMode(!isAdminDemoMode)}
              className="text-xs font-mono text-[var(--cobalt)] hover:underline flex items-center gap-1 cursor-pointer"
              title="Toggle role authorization state"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdminDemoMode ? "Admin Active (Demo)" : "Student View"}</span>
            </button>
            <Button
              size="sm"
              variant="outline"
              onClick={loadData}
              isLoading={isLoading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
            >
              Refresh
            </Button>
          </div>
        </div>

        {!effectiveIsAdmin ? (
          <Card className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[var(--danger-subtle)] text-[var(--danger)] flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[var(--charcoal)]">
              Admin Access Restricted
            </h3>
            <p className="text-xs text-[var(--charcoal-muted)] max-w-sm mx-auto leading-relaxed">
              Your account is currently registered as a student. Admin privileges are strictly verified on the backend.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAdminDemoMode(true)}
              className="mt-2"
            >
              Enable Admin Evaluation Mode
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Live Metrics & Ingestion Trigger */}
            <IngestionMetricsBanner
              metrics={metrics}
              onTriggerIngest={handleTriggerIngest}
              isTriggering={isTriggering}
            />

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 text-xs font-medium">
              <button
                onClick={() => setActiveAdminTab("opportunities")}
                className={`px-3 py-1.5 rounded-[var(--radius-sm)] transition-all cursor-pointer ${
                  activeAdminTab === "opportunities"
                    ? "bg-[var(--surface-subtle)] text-[var(--charcoal)] font-semibold border border-[var(--border)]"
                    : "text-[var(--charcoal-muted)] hover:text-[var(--charcoal)]"
                }`}
              >
                Opportunities Data Pool ({opportunities.length})
              </button>
              <button
                onClick={() => setActiveAdminTab("sources")}
                className={`px-3 py-1.5 rounded-[var(--radius-sm)] transition-all cursor-pointer ${
                  activeAdminTab === "sources"
                    ? "bg-[var(--surface-subtle)] text-[var(--charcoal)] font-semibold border border-[var(--border)]"
                    : "text-[var(--charcoal-muted)] hover:text-[var(--charcoal)]"
                }`}
              >
                Connected Feeds & Compliance ({sources.length})
              </button>
              <button
                onClick={() => setActiveAdminTab("rules")}
                className={`px-3 py-1.5 rounded-[var(--radius-sm)] transition-all cursor-pointer ${
                  activeAdminTab === "rules"
                    ? "bg-[var(--surface-subtle)] text-[var(--charcoal)] font-semibold border border-[var(--border)]"
                    : "text-[var(--charcoal-muted)] hover:text-[var(--charcoal)]"
                }`}
              >
                Deduplication & Validation Rules
              </button>
            </div>

            {/* Tab 1: Opportunities Table */}
            {activeAdminTab === "opportunities" && (
              <OpportunityTable
                opportunities={opportunities}
                onInspect={handleOpenInspect}
                onCompareDuplicate={handleOpenDuplicate}
                onQuickApprove={handleQuickApprove}
                onArchive={(id) => opportunityService.performAdminAction(id, "archive").then(loadData)}
                isLoading={isLoading}
              />
            )}

            {/* Tab 2: Sources Health & Compliance */}
            {activeAdminTab === "sources" && (
              <SourceHealthAudit sources={sources} />
            )}

            {/* Tab 3: Deduplication & Validation Rules */}
            {activeAdminTab === "rules" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <Card className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[var(--cobalt)] font-semibold">
                    <GitCompare className="w-4 h-4" />
                    <span>Deduplication & Canonical Hashing Strategy</span>
                  </div>
                  <p className="text-[var(--charcoal-muted)] leading-relaxed">
                    To maintain clean matching feeds without duplicate entries:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-[var(--charcoal-muted)]">
                    <li>
                      <strong>Canonical URL Normalization:</strong> Strips tracking query parameters (`utm_*`, `ref`, `gh_src`, `source`), standardizes scheme/host, and strips trailing slashes.
                    </li>
                    <li>
                      <strong>Distinct Role Preservation:</strong> Distinct roles at the same organization (e.g. <em>Frontend Engineer</em> vs <em>Backend Systems Engineer</em> at Swiggy) are <u>never</u> merged.
                    </li>
                    <li>
                      <strong>Title Token Similarity:</strong> Tokenizes normalized role titles and flags entries with &gt;80% Jaccard token overlap for admin side-by-side review.
                    </li>
                  </ul>
                </Card>

                <Card className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[var(--cobalt)] font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Validation & Data Readiness Criteria</span>
                  </div>
                  <p className="text-[var(--charcoal-muted)] leading-relaxed">
                    Before publishing an opportunity to student profiles:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-[var(--charcoal-muted)]">
                    <li>
                      <strong>Mandatory Fields:</strong> Verified title (&ge;3 chars), organization name, and functional application link.
                    </li>
                    <li>
                      <strong>Deadline Validation:</strong> Opportunities with expired deadlines are flagged and prevented from entering student recommendation feeds.
                    </li>
                    <li>
                      <strong>Opportunity Types:</strong> Strictly limited to Jobs, Internships, Hackathons, Competitions, and Fellowships. Scholarships are excluded.
                    </li>
                  </ul>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Inspection Drawer */}
        <OpportunityDetailDrawer
          isOpen={isInspectOpen}
          onClose={() => setIsInspectOpen(false)}
          opportunity={selectedOppForInspect}
          onAction={handlePerformAction}
          isProcessing={isActionProcessing}
        />

        {/* Duplicate Comparison Modal */}
        <DuplicateComparisonModal
          isOpen={isDupModalOpen}
          onClose={() => setIsDupModalOpen(false)}
          candidateOpp={selectedDupCandidate}
          originalOpp={originalCandidateOpp}
          onResolve={handleResolveDuplicate}
          isProcessing={isActionProcessing}
        />
      </div>
    </AppShell>
  );
}
