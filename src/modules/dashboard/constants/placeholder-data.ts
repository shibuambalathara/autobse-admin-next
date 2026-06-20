import {
  Calendar,
  Car,
  CreditCard,
  Gavel,
  MapPin,
  UserPlus,
  Users,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import type {
  DashboardActivityItem,
  DashboardOverviewRow,
  DashboardQuickAction,
  DashboardStat,
} from "@/modules/dashboard/types";

/** Placeholder KPI values — replace with GraphQL queries during migration. */
export const DASHBOARD_PLACEHOLDER_STATS: DashboardStat[] = [
  {
    id: "users",
    label: "Active Users",
    value: "1,248",
    change: "+12% vs last week",
    trend: "up",
    icon: Users,
  },
  {
    id: "auctions",
    label: "Live Auctions",
    value: "18",
    change: "3 ending today",
    trend: "neutral",
    icon: Gavel,
  },
  {
    id: "vehicles",
    label: "Vehicles Listed",
    value: "4,392",
    change: "+86 this month",
    trend: "up",
    icon: Car,
  },
  {
    id: "payments",
    label: "Payments Today",
    value: "₹12.4L",
    change: "-4% vs yesterday",
    trend: "down",
    icon: CreditCard,
  },
];

/** Placeholder quick actions — wire to routes during migration. */
export const DASHBOARD_QUICK_ACTIONS: DashboardQuickAction[] = [
  {
    id: "add-user",
    label: "Add User",
    description: "Register a new dealer or admin",
    href: ROUTES.users,
    icon: UserPlus,
  },
  {
    id: "create-event",
    label: "Create Event",
    description: "Schedule a new auction event",
    href: ROUTES.events,
    icon: Calendar,
  },
  {
    id: "list-vehicle",
    label: "List Vehicle",
    description: "Add a vehicle to inventory",
    href: ROUTES.vehicles,
    icon: Car,
  },
  {
    id: "manage-location",
    label: "Manage Locations",
    description: "Update yards and branches",
    href: ROUTES.locations,
    icon: MapPin,
  },
];

/** Placeholder activity feed — replace with real-time events later. */
export const DASHBOARD_PLACEHOLDER_ACTIVITY: DashboardActivityItem[] = [
  {
    id: "activity-1",
    title: "User registration",
    description: "Rajesh Kumar submitted KYC documents",
    time: "2 min ago",
    status: "pending",
  },
  {
    id: "activity-2",
    title: "Auction started",
    description: "Mumbai Yard — Batch #2847 is now live",
    time: "18 min ago",
    status: "live",
  },
  {
    id: "activity-3",
    title: "Payment received",
    description: "₹45,000 from AutoTraders Pvt Ltd",
    time: "1 hr ago",
    status: "completed",
  },
  {
    id: "activity-4",
    title: "Vehicle approved",
    description: "MH12AB1234 listed by Premium Motors",
    time: "2 hrs ago",
    status: "approved",
  },
  {
    id: "activity-5",
    title: "Bid rejected",
    description: "Invalid bid on Lot #892 — below reserve",
    time: "3 hrs ago",
    status: "rejected",
  },
];

/** Placeholder overview table rows — replace with GraphQL query later. */
export const DASHBOARD_PLACEHOLDER_OVERVIEW: DashboardOverviewRow[] = [
  {
    id: "row-1",
    name: "Delhi North Auction",
    type: "Event",
    status: "live",
    updatedAt: "Jun 17, 2026 · 10:42 AM",
  },
  {
    id: "row-2",
    name: "Sharma Auto Dealers",
    type: "User",
    status: "pending",
    updatedAt: "Jun 17, 2026 · 09:15 AM",
  },
  {
    id: "row-3",
    name: "KA03CD5678",
    type: "Vehicle",
    status: "active",
    updatedAt: "Jun 16, 2026 · 06:30 PM",
  },
  {
    id: "row-4",
    name: "Settlement #88421",
    type: "Payment",
    status: "completed",
    updatedAt: "Jun 16, 2026 · 04:12 PM",
  },
  {
    id: "row-5",
    name: "Chennai Central Yard",
    type: "Location",
    status: "active",
    updatedAt: "Jun 16, 2026 · 11:00 AM",
  },
];
