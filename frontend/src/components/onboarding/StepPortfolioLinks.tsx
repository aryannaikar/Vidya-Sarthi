"use client";

import React from "react";
import { PortfolioLinks } from "@/types/student";
import { Input } from "@/components/ui/Input";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { Globe, Info } from "lucide-react";

interface StepPortfolioLinksProps {
  portfolio: PortfolioLinks;
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioLinks>>;
}

export const StepPortfolioLinks: React.FC<StepPortfolioLinksProps> = ({
  portfolio,
  setPortfolio,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--charcoal)] tracking-tight">
          Portfolio & Engineering Profiles
        </h3>
        <p className="text-xs text-[var(--charcoal-muted)] mt-1">
          Provide your public development profiles and project showcases for technical verification
        </p>
      </div>

      {/* Honest Integration Notice per Spec */}
      <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border)] flex items-start gap-3">
        <Info className="w-4 h-4 text-[var(--cobalt)] shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <span className="font-semibold text-[var(--charcoal)]">
            Transparent Verification Policy:
          </span>
          <p className="text-[var(--charcoal-muted)] leading-relaxed">
            Vidya Sarthi evaluates only public GitHub repositories and authorized portfolio links. Private codebases are never accessed.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          label="GitHub Profile URL"
          placeholder="https://github.com/your-username"
          value={portfolio.githubUrl || ""}
          onChange={(e) =>
            setPortfolio((prev) => ({ ...prev, githubUrl: e.target.value }))
          }
          leftIcon={<GithubIcon className="w-4 h-4" />}
          hint="Allows our engine to index commit activity and language competencies"
        />

        <Input
          label="LinkedIn Profile"
          placeholder="https://linkedin.com/in/your-profile"
          value={portfolio.linkedinUrl || ""}
          onChange={(e) =>
            setPortfolio((prev) => ({ ...prev, linkedinUrl: e.target.value }))
          }
          leftIcon={<LinkedinIcon className="w-4 h-4" />}
          hint="Used for professional credential validation"
        />

        <Input
          label="Personal Portfolio or Project Showcase Website"
          placeholder="https://yourname.dev"
          value={portfolio.personalWebsite || ""}
          onChange={(e) =>
            setPortfolio((prev) => ({
              ...prev,
              personalWebsite: e.target.value,
            }))
          }
          leftIcon={<Globe className="w-4 h-4" />}
        />
      </div>
    </div>
  );
};
