"use client";

import React from "react";
import { IngestionRunMetrics } from "@/types/opportunity";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Database,
  CheckCircle,
  AlertTriangle,
  Copy,
  RefreshCw,
  Radio,
  Clock,
} from "lucide-react";

interface IngestionMetricsBannerProps {
  metrics: IngestionRunMetrics;
  onTriggerIngest: () => void;
  isTriggering?: boolean;
}

export const IngestionMetricsBanner: React.FC<IngestionMetricsBannerProps> = ({
  metrics,
  onTriggerIngest,
  isTriggering = false,
}) => {
  const formattedLastRun = new Date(metrics.lastRunTimestamp).toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit", second: "2-digit" }
  );

  return (
    <Card className="p-5 border-[var(--border)] bg-[var(--surface-card)]">
      {/* Top Bar: Pipeline State & Trigger Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--cobalt-subtle)] text-[var(--cobalt)] flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[var(--charcoal)]">
                Opportunity Ingestion Engine
              </span>
              <Badge variant="success" dot monospace>
                {metrics.isIngesting || isTriggering ? "RUNNING PIPELINE" : "STANDBY / ACTIVE"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--charcoal-muted)] mt-0.5">
              <Clock className="w-3.5 h-3.5 text-[var(--charcoal-subtle)]" />
              <span>Last Ingestion Cycle: <strong className="font-mono text-[var(--charcoal)]">{formattedLastRun}</strong></span>
              <span>•</span>
              <span>{metrics.activeSourcesCount} Verified Sources</span>
            </div>
          </div>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={onTriggerIngest}
          isLoading={isTriggering || metrics.isIngesting}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isTriggering ? "animate-spin" : ""}`} />}
        >
          {isTriggering || metrics.isIngesting ? "Collecting & Normalizing..." : "Trigger Ingestion Run"}
        </Button>
      </div>

      {/* Real Ingestion Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--charcoal-muted)]">
            <span>Total Collected</span>
            <Database className="w-3.5 h-3.5 text-[var(--cobalt)]" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--charcoal)] mt-1.5">
            {metrics.totalIndexed}
          </div>
          <span className="text-[11px] text-[var(--charcoal-subtle)] block mt-0.5">
            Across jobs, hackathons & sprints
          </span>
        </div>

        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--charcoal-muted)]">
            <span>Published to Students</span>
            <CheckCircle className="w-3.5 h-3.5 text-[var(--success)]" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--charcoal)] mt-1.5">
            {metrics.publishedCount}
          </div>
          <span className="text-[11px] text-[var(--charcoal-subtle)] block mt-0.5">
            Validated & live in feeds
          </span>
        </div>

        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--charcoal-muted)]">
            <span>Needs Review</span>
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--warning)]" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--charcoal)] mt-1.5">
            {metrics.pendingReviewCount}
          </div>
          <span className="text-[11px] text-[var(--charcoal-subtle)] block mt-0.5">
            Validation or deadline flags
          </span>
        </div>

        <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs text-[var(--charcoal-muted)]">
            <span>Potential Duplicates</span>
            <Copy className="w-3.5 h-3.5 text-[var(--danger)]" />
          </div>
          <div className="text-xl font-bold font-mono text-[var(--charcoal)] mt-1.5">
            {metrics.flaggedDuplicatesCount}
          </div>
          <span className="text-[11px] text-[var(--charcoal-subtle)] block mt-0.5">
            Awaiting human resolution
          </span>
        </div>
      </div>
    </Card>
  );
};
