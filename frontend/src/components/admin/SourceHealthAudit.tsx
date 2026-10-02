"use client";

import React from "react";
import { IngestionSourceSummary } from "@/types/opportunity";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldCheck,
  Zap,
  Clock,
} from "lucide-react";

interface SourceHealthAuditProps {
  sources: IngestionSourceSummary[];
}

export const SourceHealthAudit: React.FC<SourceHealthAuditProps> = ({ sources }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[var(--charcoal)]">
            Active Opportunity Ingestion Sources
          </h3>
          <p className="text-xs text-[var(--charcoal-muted)] mt-0.5">
            Verified, permission-aware API syndicates and partner feeds
          </p>
        </div>
        <Badge variant="success" dot monospace>
          {sources.length} CONNECTED
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sources.map((src) => {
          return (
            <Card key={src.sourceId} className="p-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="success" dot monospace>
                    {src.status.toUpperCase()}
                  </Badge>
                  <span className="text-[10px] font-mono text-[var(--charcoal-subtle)]">
                    {src.type.toUpperCase()}
                  </span>
                </div>

                <div>
                  <CardTitle className="text-sm font-semibold text-[var(--charcoal)]">
                    {src.name}
                  </CardTitle>
                  <span className="text-xs text-[var(--charcoal-muted)] block mt-0.5">
                    Provider: {src.provider}
                  </span>
                </div>

                {/* Real Ingest Counts */}
                <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--charcoal-subtle)] block">
                      Fetched
                    </span>
                    <strong className="font-mono text-[var(--charcoal)]">
                      {src.recordsFetched} records
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--charcoal-subtle)] block">
                      Published
                    </span>
                    <strong className="font-mono text-[var(--success)]">
                      {src.recordsPublished} live
                    </strong>
                  </div>
                </div>

                {/* Compliance & Terms Notice */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-[var(--charcoal)] font-medium text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--cobalt)] shrink-0" />
                    <span>Compliance & Access Terms:</span>
                  </div>
                  <p className="text-[11px] text-[var(--charcoal-muted)] leading-relaxed pl-5">
                    {src.complianceNotes}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--charcoal-subtle)]">
                <div className="flex items-center gap-1 font-mono">
                  <Zap className="w-3 h-3 text-[var(--warning)]" />
                  <span>{src.rateLimitInfo.slice(0, 24)}...</span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(src.lastSync).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
