import { LucideIcon } from "lucide-react";

export interface NavItemConfig {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  exact?: boolean;
  adminOnly?: boolean;
}

export type ActiveNavKey =
  | "dashboard"
  | "profile"
  | "opportunities"
  | "hackathons"
  | "career-assistant"
  | "saved"
  | "applications"
  | "admin";
