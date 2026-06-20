"use client";

import {
  Archive,
  CalendarDays,
  Car,
  FileUp,
  Pencil,
} from "lucide-react";
import { Button, StatusBadge } from "@/components/ui";
import { EVENT_LEGACY_ROUTES } from "@/modules/events/constants/related-routes";
import { formatDate } from "@/lib/date-format";
import type { EventListItem } from "@/modules/events/types";
import type { TableColumn } from "@/types";

function isEventActive(endDate?: string | null) {
  if (!endDate) return false;
  return new Date(endDate) > new Date();
}

function legacyActionClass(tone: string) {
  return `inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium ${tone}`;
}

export interface EventsTableColumnOptions {
  onArchive: (event: EventListItem) => void;
}

export function createEventsTableColumns(
  options: EventsTableColumnOptions
): TableColumn<EventListItem>[] {
  const { onArchive } = options;

  return [
    {
      id: "eventNo",
      header: "Auction No",
      sticky: true,
      mobilePrimary: true,
      cell: (row) => {
        const active = isEventActive(row.endDate);
        if (!active) return row.eventNo ?? "—";

        if (row.eventCategory === "open") {
          return (
            <a
              href={EVENT_LEGACY_ROUTES.viewVehicles(row.id, row.eventCategory)}
              target="_blank"
              rel="noopener noreferrer"
              className={legacyActionClass("bg-red-500 text-white hover:bg-red-600")}
            >
              {row.eventNo}
            </a>
          );
        }

        return (
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-30" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
            </span>
            {row.eventNo}
          </span>
        );
      },
    },
    {
      id: "metaEventId",
      header: "Meta Event ID",
      cell: (row) => row.metaEventId ?? "—",
    },
    {
      id: "metaEventType",
      header: "Meta Event Type",
      cell: (row) => row.metaEventType ?? "—",
    },
    {
      id: "seller",
      header: "Seller Name",
      cell: (row) => row.seller?.name ?? "—",
    },
    {
      id: "location",
      header: "Location",
      cell: (row) => row.location?.name ?? "—",
    },
    {
      id: "eventCategory",
      header: "Event Category",
      accessor: "eventCategory",
    },
    {
      id: "vehicleCategory",
      header: "Vehicle Category",
      cell: (row) => row.vehicleCategory?.name ?? "—",
    },
    {
      id: "startDate",
      header: "Start Date",
      cell: (row) => formatDate(row.startDate),
    },
    {
      id: "endDate",
      header: "End Date",
      cell: (row) => formatDate(row.endDate),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => {
        if (!row.status) return "—";
        const variant =
          row.status === "active"
            ? "success"
            : row.status === "inactive"
              ? "neutral"
              : "warning";
        const label =
          row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase();
        return <StatusBadge variant={variant} label={label} />;
      },
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: "addVehicle",
      header: "Add Vehicle",
      mobileFooter: true,
      cell: (row) =>
        isEventActive(row.endDate) ? (
          <a
            href={EVENT_LEGACY_ROUTES.addVehicle(row.id)}
            target="_blank"
            rel="noopener noreferrer"
            className={legacyActionClass("bg-emerald-50 text-emerald-700 hover:bg-emerald-100")}
            title="Add vehicle"
          >
            <Car className="h-4 w-4" />
          </a>
        ) : (
          "—"
        ),
    },
    {
      id: "viewVehicles",
      header: "View Vehicles",
      mobileFooter: true,
      cell: (row) => {
        const count = row.vehiclesCount ?? 0;
        if (count === 0) {
          return (
            <span className={legacyActionClass("bg-slate-100 text-slate-500")}>
              0
            </span>
          );
        }
        return (
          <a
            href={EVENT_LEGACY_ROUTES.viewVehicles(row.id, row.eventCategory)}
            target="_blank"
            rel="noopener noreferrer"
            className={legacyActionClass("bg-emerald-50 text-emerald-700 hover:bg-emerald-100")}
          >
            {count}
          </a>
        );
      },
    },
    {
      id: "deletedVehicles",
      header: "Deleted Vehicles",
      mobileFooter: true,
      cell: (row) => {
        const count = row.deletedVehiclesCount ?? 0;
        if (count === 0) {
          return (
            <span className={legacyActionClass("bg-slate-100 text-slate-500")}>
              0
            </span>
          );
        }
        return (
          <a
            href={EVENT_LEGACY_ROUTES.deletedVehicles(row.id)}
            target="_blank"
            rel="noopener noreferrer"
            className={legacyActionClass("bg-red-50 text-red-700 hover:bg-red-100")}
          >
            {count}
          </a>
        );
      },
    },
    {
      id: "uploadVehicles",
      header: "Upload Vehicles",
      mobileFooter: true,
      cell: (row) => (
        <a
          href={EVENT_LEGACY_ROUTES.uploadVehicles(row.id, row.eventCategory)}
          target="_blank"
          rel="noopener noreferrer"
          className={legacyActionClass("bg-emerald-50 text-emerald-700 hover:bg-emerald-100")}
          title="Upload vehicles excel"
        >
          <FileUp className="h-4 w-4" />
        </a>
      ),
    },
    {
      id: "editEvent",
      header: "View/Edit Event",
      mobileFooter: true,
      cell: (row) => (
        <a
          href={EVENT_LEGACY_ROUTES.editEvent(row.id)}
          target="_blank"
          rel="noopener noreferrer"
          className={legacyActionClass("bg-sky-50 text-sky-700 hover:bg-sky-100")}
          title="View or edit event"
        >
          <CalendarDays className="h-4 w-4" />
        </a>
      ),
    },
    {
      id: "createdBy",
      header: "Created By",
      mobileFooter: true,
      cell: (row) =>
        row.createdById ? (
          <a
            href={EVENT_LEGACY_ROUTES.createdByUser(row.createdById)}
            target="_blank"
            rel="noopener noreferrer"
            className={legacyActionClass("bg-brand-50 text-brand-700 hover:bg-brand-100")}
            title="View creator"
          >
            <Pencil className="h-4 w-4" />
          </a>
        ) : (
          "—"
        ),
    },
    {
      id: "terms",
      header: "T&C",
      mobileFooter: true,
      cell: (row) => (
        <a
          href={EVENT_LEGACY_ROUTES.eventTermsUsers(row.id)}
          target="_blank"
          rel="noopener noreferrer"
          className={legacyActionClass("bg-blue-50 text-blue-700 hover:bg-blue-100")}
        >
          Accepted Users
        </a>
      ),
    },
    {
      id: "archive",
      header: "Archive",
      mobileFooter: true,
      cell: (row) => (
        <Button
          type="button"
          size="icon"
          variant="danger"
          className="h-8 w-8"
          title="Archive event"
          onClick={() => onArchive(row)}
        >
          <Archive className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}
