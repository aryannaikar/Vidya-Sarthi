"use client";

import React, { useState } from "react";
import { PortfolioAnalysisResult } from "@/types/intelligence";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GithubIcon } from "@/components/ui/BrandIcons";
import {
  ExternalLink,
  Star,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Code2,
} from "lucide-react";

interface PortfolioAnalysisCardProps {
  portfolio?: PortfolioAnalysisResult;
  onReanalyze: (url: string) => void;
  isReanalyzing?: boolean;
}

export const PortfolioAnalysisCard: React.FC<PortfolioAnalysisCardProps> = ({
  portfolio,
  onReanalyze,
  isReanalyzing = false,
}) => {
  const [githubInput, setGithubInput] = useState(
    portfolio?.analyzedUrl || "https://github.com/aarav-sharma"
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--charcoal)] tracking-tight">
          Portfolio & Public Repository Intelligence
        </h3>
        <p className="text-xs text-[var(--charcoal-muted)] mt-0.5">
          Automated evaluation of public repository commit architecture, tech stacks, and engineering artifacts
        </p>
      </div>

      {/* URL Input & Re-analyze Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <Input
            label="Public GitHub or Portfolio Profile"
            placeholder="https://github.com/username"
            value={githubInput}
            onChange={(e) => setGithubInput(e.target.value)}
            leftIcon={<GithubIcon className="w-4 h-4" />}
          />
        </div>
        <div className="sm:self-end w-full sm:w-auto">
          <Button
            size="md"
            variant="outline"
            className="w-full sm:w-auto h-10"
            isLoading={isReanalyzing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => onReanalyze(githubInput)}
          >
            Re-evaluate Repos
          </Button>
        </div>
      </div>

      {/* Analysis Status */}
      {portfolio?.status === "offline_or_private" ? (
        <Card className="p-6 border-l-4 border-l-[var(--warning)] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--warning)]">
            <AlertTriangle className="w-4 h-4" />
            <span>Public Repository Access Notice</span>
          </div>
          <p className="text-xs text-[var(--charcoal-muted)] leading-relaxed">
            The provided repository URL could not be crawled or is currently set to private. Vidya Sarthi never bypasses authentication or access controls. Please ensure your repositories are public or provide individual project links.
          </p>
        </Card>
      ) : (
        <div className="space-y-5">
          {/* Inspected Repositories */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--charcoal-muted)] uppercase tracking-wider font-mono">
                Verified Repositories ({portfolio?.repositories.length || 0})
              </span>
              <span className="text-[11px] font-mono text-[var(--charcoal-subtle)]">
                Last checked: {portfolio ? new Date(portfolio.lastAnalyzedAt).toLocaleDateString() : "Today"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio?.repositories.map((repo) => (
                <Card key={repo.repoName} className="p-5 flex flex-col justify-between h-full">
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-[var(--cobalt)]" />
                        <CardTitle className="text-sm font-semibold text-[var(--charcoal)] truncate">
                          {repo.repoName}
                        </CardTitle>
                      </div>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--charcoal-subtle)] hover:text-[var(--charcoal)]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <p className="text-xs text-[var(--charcoal-muted)] line-clamp-2 leading-relaxed">
                      {repo.description}
                    </p>

                    {/* Detected Tech */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {repo.detectedTechnologies.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-subtle)] text-[var(--charcoal)] border border-[var(--border-subtle)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Quality observations */}
                    {repo.qualityObservations && repo.qualityObservations.length > 0 && (
                      <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1">
                        {repo.qualityObservations.map((obs, i) => (
                          <p
                            key={i}
                            className="text-[11px] text-[var(--charcoal-muted)] flex items-start gap-1.5"
                          >
                            <span className="text-[var(--cobalt)] font-bold">•</span>
                            <span>{obs}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--charcoal-subtle)] font-mono">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[var(--warning)]" />
                      {repo.starsCount || 0} stars
                    </span>
                    <span>Updated {repo.lastUpdated}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Overall Strengths & Actionable Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-[var(--surface-subtle)]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--success)] mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Strengths</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[var(--charcoal)]">
                {portfolio?.overallStrengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[var(--success)] font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-4 bg-[var(--surface-subtle)]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--charcoal)] mb-2">
                <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
                <span>Suggestions for Portfolio Impact</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[var(--charcoal-muted)]">
                {portfolio?.suggestedImprovements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[var(--warning)] font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
