"use client";

import React from "react";
import { CareerPreferences, WorkMode, OpportunityType } from "@/types/student";
import {
  DESIRED_ROLES,
  PREFERRED_INDUSTRIES,
  PREFERRED_LOCATIONS,
} from "@/lib/taxonomy";
import { Select } from "@/components/ui/Select";
import { Briefcase, MapPin, Building, Target } from "lucide-react";

interface StepPreferencesProps {
  preferences: CareerPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<CareerPreferences>>;
}

export const StepPreferences: React.FC<StepPreferencesProps> = ({
  preferences,
  setPreferences,
}) => {
  const toggleRole = (role: string) => {
    setPreferences((prev) => {
      const exists = prev.desiredRoles.includes(role);
      return {
        ...prev,
        desiredRoles: exists
          ? prev.desiredRoles.filter((r) => r !== role)
          : [...prev.desiredRoles, role],
      };
    });
  };

  const toggleIndustry = (ind: string) => {
    setPreferences((prev) => {
      const exists = prev.preferredIndustries.includes(ind);
      return {
        ...prev,
        preferredIndustries: exists
          ? prev.preferredIndustries.filter((i) => i !== ind)
          : [...prev.preferredIndustries, ind],
      };
    });
  };

  const toggleLocation = (loc: string) => {
    setPreferences((prev) => {
      const exists = prev.preferredLocations.includes(loc);
      return {
        ...prev,
        preferredLocations: exists
          ? prev.preferredLocations.filter((l) => l !== loc)
          : [...prev.preferredLocations, loc],
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--charcoal)] tracking-tight">
          Career Targets & Work Preferences
        </h3>
        <p className="text-xs text-[var(--charcoal-muted)] mt-1">
          Specify your role ambitions, location flexibility, and preferred engineering sectors
        </p>
      </div>

      <div className="space-y-5">
        {/* Desired Roles */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--charcoal)] flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[var(--cobalt)]" />
            <span>Target Technical Roles (Select all that interest you)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {DESIRED_ROLES.map((role) => {
              const selected = preferences.desiredRoles.includes(role);
              return (
                <button
                  type="button"
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium border transition-colors cursor-pointer ${
                    selected
                      ? "bg-[var(--cobalt)] text-white border-[var(--cobalt)] shadow-xs"
                      : "bg-[var(--surface-subtle)] text-[var(--charcoal)] border-[var(--border)] hover:bg-[#EAE4D7]"
                  }`}
                >
                  {selected ? "✓ " : "+ "}
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        {/* Opportunity Type & Work Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Select
            label="Opportunity Type Preference"
            options={[
              { label: "Both Internships & Full-Time", value: "all" },
              { label: "Internships Only", value: "internship" },
              { label: "Graduate Full-Time Roles Only", value: "job" },
            ]}
            value={preferences.opportunityTypePreference}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                opportunityTypePreference: e.target.value as "all" | OpportunityType,
              }))
            }
          />

          <Select
            label="Workplace Flexibility"
            options={[
              { label: "Any (Remote, Hybrid, In-Office)", value: "any" },
              { label: "Hybrid", value: "hybrid" },
              { label: "Fully Remote", value: "remote" },
              { label: "In-Office Onsite", value: "in-office" },
            ]}
            value={preferences.workModePreference}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                workModePreference: e.target.value as "any" | WorkMode,
              }))
            }
          />
        </div>

        {/* Preferred Locations */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-[var(--charcoal)] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[var(--cobalt)]" />
            <span>Target Cities in India</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {PREFERRED_LOCATIONS.map((loc) => {
              const selected = preferences.preferredLocations.includes(loc);
              return (
                <button
                  type="button"
                  key={loc}
                  onClick={() => toggleLocation(loc)}
                  className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium border transition-colors cursor-pointer ${
                    selected
                      ? "bg-[var(--cobalt)] text-white border-[var(--cobalt)] shadow-xs"
                      : "bg-[var(--surface-subtle)] text-[var(--charcoal)] border-[var(--border)] hover:bg-[#EAE4D7]"
                  }`}
                >
                  {selected ? "✓ " : "+ "}
                  {loc}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Industries */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-[var(--charcoal)] flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[var(--cobalt)]" />
            <span>Industry Sectors of Interest</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {PREFERRED_INDUSTRIES.map((ind) => {
              const selected = preferences.preferredIndustries.includes(ind);
              return (
                <button
                  type="button"
                  key={ind}
                  onClick={() => toggleIndustry(ind)}
                  className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium border transition-colors cursor-pointer ${
                    selected
                      ? "bg-[var(--cobalt)] text-white border-[var(--cobalt)] shadow-xs"
                      : "bg-[var(--surface-subtle)] text-[var(--charcoal)] border-[var(--border)] hover:bg-[#EAE4D7]"
                  }`}
                >
                  {selected ? "✓ " : "+ "}
                  {ind}
                </button>
              );
            })}
          </div>
        </div>

        {/* Short-Term Goals */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-[var(--charcoal)] flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[var(--cobalt)]" />
            <span>Short-Term Career Goal (Next 6–12 Months)</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Secure a summer 2027 software engineering internship at a product-led company and contribute to distributed open-source tools."
            value={preferences.shortTermGoals}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                shortTermGoals: e.target.value,
              }))
            }
            className="w-full p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] text-xs text-[var(--charcoal)] placeholder:text-[var(--charcoal-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--cobalt)]/20 focus:border-[var(--cobalt)] resize-none"
          />
        </div>
      </div>
    </div>
  );
};
