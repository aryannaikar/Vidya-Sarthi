import {
  LayoutDashboard,
  UserCircle2,
  Briefcase,
  Trophy,
  Compass,
  Bookmark,
  FileCheck2,
  ShieldAlert,
} from "lucide-react";
import { NavItemConfig } from "@/types/navigation";

export const navigationItems: NavItemConfig[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "My Profile",
    href: "/profile",
    icon: UserCircle2,
  },
  {
    label: "Jobs & Internships",
    href: "/opportunities",
    icon: Briefcase,
    badge: 5,
  },
  {
    label: "Hackathons & Competitions",
    href: "/hackathons",
    icon: Trophy,
    badge: "3 Live",
  },
  {
    label: "AI Career Assistant",
    href: "/career-assistant",
    icon: Compass,
  },
  {
    label: "Saved Opportunities",
    href: "/saved",
    icon: Bookmark,
    badge: 2,
  },
  {
    label: "Applications",
    href: "/applications",
    icon: FileCheck2,
  },
  {
    label: "Admin Console",
    href: "/admin",
    icon: ShieldAlert,
    adminOnly: true,
  },
];
