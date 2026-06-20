import { Car, CreditCard, Gavel, Users, type LucideIcon } from "lucide-react";

export interface DashboardStatSlot {
  id: string;
  label: string;
  icon: LucideIcon;
}

/** Stat card slots — wire to GraphQL queries during migration. */
export const DASHBOARD_STAT_SLOTS: DashboardStatSlot[] = [
  { id: "users", label: "Active Users", icon: Users },
  { id: "auctions", label: "Live Auctions", icon: Gavel },
  { id: "vehicles", label: "Vehicles Listed", icon: Car },
  { id: "payments", label: "Payments Today", icon: CreditCard },
];
