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
import type { DashboardQuickAction } from "@/modules/dashboard/types";

export const DASHBOARD_QUICK_ACTIONS: DashboardQuickAction[] = [
  {
    id: "add-user",
    label: "Add User",
    description: "Register a new dealer or admin",
    href: ROUTES.usersAdd,
    icon: UserPlus,
  },
  {
    id: "create-event",
    label: "Create Event",
    description: "Schedule a new auction event",
    href: ROUTES.eventsAdd,
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

export const DASHBOARD_STAT_CONFIG = [
  { id: "users", label: "Users", icon: Users, href: ROUTES.users },
  { id: "events", label: "Events", icon: Gavel, href: ROUTES.events },
  { id: "vehicles", label: "Vehicles", icon: Car, href: ROUTES.vehicles },
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
    href: ROUTES.payments,
  },
] as const;

export const DASHBOARD_RECENT_LIMIT = 5;
