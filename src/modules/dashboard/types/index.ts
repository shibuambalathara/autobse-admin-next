import type { LucideIcon } from "lucide-react";
import type { StatusPreset } from "@/components/ui";

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  href?: string;
}

export interface DashboardQuickAction {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface DashboardActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  status: StatusPreset;
}

export interface DashboardOverviewRow {
  id: string;
  name: string;
  type: string;
  status: StatusPreset;
  updatedAt: string;
}
