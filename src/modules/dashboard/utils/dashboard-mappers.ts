import type { StatusPreset } from "@/components/ui";
import { formatAuditEntityType } from "@/modules/audit-logs/constants";
import type { AuditLog } from "@/modules/audit-logs/types";
import type {
  DashboardActivityItem,
  DashboardOverviewRow,
} from "@/modules/dashboard/types";
import type { EventListItem } from "@/modules/events/types";
import { formatDate } from "@/lib/date-format";

export function formatDashboardCount(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  return value.toLocaleString("en-IN");
}

function mapAuditActionToStatus(
  action?: string | null
): StatusPreset {
  switch (action?.toUpperCase()) {
    case "CREATE":
      return "approved";
    case "UPDATE":
      return "pending";
    case "DELETE":
      return "rejected";
    case "RESTORE":
      return "active";
    default:
      return "active";
  }
}

export function mapAuditLogToActivityItem(log: AuditLog): DashboardActivityItem {
  const entityLabel = formatAuditEntityType(log.entityType);
  const action = log.action ?? "Action";

  return {
    id: log.id,
    title: `${action} · ${entityLabel}`,
    description: log.entityId
      ? `Entity ${log.entityId}${log.changedByRole ? ` · ${log.changedByRole}` : ""}`
      : log.changedByRole
        ? `By ${log.changedByRole}`
        : "System activity",
    time: formatDate(log.createdAt),
    status: mapAuditActionToStatus(log.action),
  };
}

function mapEventStatusToPreset(status?: string | null): StatusPreset {
  if (!status) return "pending";
  const normalized = status.toLowerCase();
  if (normalized === "active") return "active";
  if (normalized === "inactive") return "pending";
  if (normalized === "live") return "live";
  if (normalized === "completed") return "completed";
  return "active";
}

export function mapEventToOverviewRow(event: EventListItem): DashboardOverviewRow {
  const sellerName = event.seller?.name ?? "Unknown seller";
  const locationName = event.location?.name;
  const name = locationName
    ? `Event #${event.eventNo ?? "—"} · ${sellerName} · ${locationName}`
    : `Event #${event.eventNo ?? "—"} · ${sellerName}`;

  return {
    id: event.id,
    name,
    type: "Event",
    status: mapEventStatusToPreset(event.status),
    updatedAt: formatDate(event.createdAt),
  };
}
