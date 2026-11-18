import {
  Activity, Archive, Boxes, FileText, Frame, GitBranch, LayoutDashboard,
  ScanText, Settings, Users, Waypoints,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    group: "Intelligence",
    items: [
      { label: "Overview", href: "/workspace", icon: LayoutDashboard },
      { label: "Evidence Vault", href: "/evidence", icon: Archive },
      { label: "Document Analyzer", href: "/analyzer", icon: ScanText },
    ],
  },
  {
    group: "Analysis",
    items: [
      { label: "Entity Intelligence", href: "/entities", icon: Users },
      { label: "Connection Graph", href: "/graph", icon: Waypoints },
      { label: "Timeline Reconstruction", href: "/timeline", icon: GitBranch },
      { label: "Pattern Observatory", href: "/patterns", icon: Boxes },
    ],
  },
  {
    group: "Workspace",
    items: [
      { label: "Investigation Canvas", href: "/canvas", icon: Frame },
      { label: "Report Generator", href: "/reports", icon: FileText },
    ],
  },
  {
    group: "System",
    items: [
      { label: "System Monitor", href: "/monitor", icon: Activity },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

/** Flat command list for the command palette. */
export const NAV_COMMANDS = NAV_GROUPS.flatMap((g) =>
  g.items.map((i) => ({ ...i, group: g.group })),
);
