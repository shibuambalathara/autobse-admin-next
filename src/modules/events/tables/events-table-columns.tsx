"use client";

import Link from "next/link";
import {
  Archive,
  CalendarDays,
  Car,
  FileArchive,
  FileDown,
  FilePenLine,
  FileUp,
  Image as ImageIcon,
  Link2,
  Loader2,
  MessageCircle,
  Pencil,
  Presentation,
} from "lucide-react";
import { Button, StatusBadge } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { EVENT_LEGACY_ROUTES, EVENT_ROUTES } from "@/modules/events/constants/related-routes";
import { formatDate } from "@/lib/date-format";
import type { EventListItem } from "@/modules/events/types";
import type { TableColumn } from "@/types";

const LOCATION_PREVIEW_LENGTH = 20;

function isEventActive(endDate?: string | null) {
  if (!endDate) return false;
  return new Date(endDate) > new Date();
}

function legacyActionClass(tone: string) {
  return `inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium ${tone}`;
}

export interface EventsTableColumnOptions {
  onArchive: (event: EventListItem) => void;
  onDownloadAcr: (event: EventListItem) => void;
  onWhatsApp: (event: EventListItem) => void;
  onOpenPptDownload: (eventId: string) => void;
  onOpenPptLink: (eventId: string) => void;
  onViewLocation: (location: string) => void;
  acrLoadingEventId?: string | null;
  whatsappLoading?: boolean;
}

export function createEventsTableColumns(
  options: EventsTableColumnOptions
): TableColumn<EventListItem>[] {
  const {
    onArchive,
    onDownloadAcr,
    onWhatsApp,
    onOpenPptDownload,
    onOpenPptLink,
    onViewLocation,
    acrLoadingEventId,
    whatsappLoading,
  } = options;

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
            <Link
              href={ROUTES.eventVehicles(row.id, row.eventCategory)}
              className={legacyActionClass("bg-red-500 text-white hover:bg-red-600")}
            >
              {row.eventNo}
            </Link>
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
      cell: (row) => {
        const locationName = row.location?.name ?? "—";
        if (locationName === "—" || locationName.length <= LOCATION_PREVIEW_LENGTH) {
          return locationName;
        }

        return (
          <span>
            {locationName.slice(0, LOCATION_PREVIEW_LENGTH)}…{" "}
            <button
              type="button"
              onClick={() => onViewLocation(locationName)}
              className="text-sm text-brand-600 underline hover:text-brand-900"
            >
              View More
            </button>
          </span>
        );
      },
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
          <Link
            href={EVENT_ROUTES.addVehicle(row.id)}
            className={legacyActionClass("bg-emerald-50 text-emerald-700 hover:bg-emerald-100")}
            title="Add vehicle"
          >
            <Car className="h-4 w-4" />
          </Link>
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
          <Link
            href={ROUTES.eventVehicles(row.id, row.eventCategory)}
            className={legacyActionClass("bg-emerald-50 text-emerald-700 hover:bg-emerald-100")}
          >
            {count}
          </Link>
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
          <Link
            href={EVENT_ROUTES.deletedVehicles(row.id)}
            className={legacyActionClass("bg-red-50 text-red-700 hover:bg-red-100")}
          >
            {count}
          </Link>
        );
      },
    },
    {
      id: "uploadVehicles",
      header: "Upload Vehicles",
      mobileFooter: true,
      cell: (row) => (
        <Link
          href={EVENT_ROUTES.uploadVehicles(row.id, row.eventCategory ?? undefined)}
          className={legacyActionClass("bg-emerald-50 text-emerald-700 hover:bg-emerald-100")}
          title="Upload vehicles excel"
        >
          <FileUp className="h-4 w-4" />
        </Link>
      ),
    },
    {
      id: "editVehicles",
      header: "Edit Vehicles",
      mobileFooter: true,
      cell: (row) => (
        <Link
          href={EVENT_ROUTES.updateVehicles(row.id)}
          className={legacyActionClass("bg-emerald-100 text-emerald-800 hover:bg-emerald-200")}
          title="Update vehicles excel"
        >
          <FilePenLine className="h-4 w-4" />
        </Link>
      ),
    },
    {
      id: "uploadImages",
      header: "Upload Image",
      mobileFooter: true,
      cell: (row) => (
        <Link
          href={EVENT_ROUTES.uploadImages(row.id)}
          className={legacyActionClass("bg-blue-50 text-blue-700 hover:bg-blue-100")}
          title="Upload vehicle images"
        >
          <ImageIcon className="h-4 w-4" aria-hidden />
        </Link>
      ),
    },
    {
      id: "uploadZip",
      header: "Upload RAR/ZIP",
      mobileFooter: true,
      cell: (row) => (
        <Link
          href={EVENT_ROUTES.uploadZip(row.id)}
          className={legacyActionClass("bg-emerald-200 text-emerald-900 hover:bg-emerald-300")}
          title="Upload RAR/ZIP"
        >
          <FileArchive className="h-4 w-4" />
        </Link>
      ),
    },
    {
      id: "editEvent",
      header: "View/Edit Event",
      mobileFooter: true,
      cell: (row) => (
        <Link
          href={ROUTES.eventEdit(row.id)}
          className={legacyActionClass("bg-sky-50 text-sky-700 hover:bg-sky-100")}
          title="View or edit event"
        >
          <CalendarDays className="h-4 w-4" />
        </Link>
      ),
    },
    {
      id: "acrExcel",
      header: "ACR (Excel)",
      mobileFooter: true,
      cell: (row) => (
        <button
          type="button"
          onClick={() => onDownloadAcr(row)}
          disabled={acrLoadingEventId === row.id}
          className={legacyActionClass("bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-60")}
          title="Download ACR Excel"
        >
          {acrLoadingEventId === row.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
        </button>
      ),
    },
    {
      id: "downloadPpt",
      header: "Download PPT",
      mobileFooter: true,
      cell: (row) => (
        <button
          type="button"
          onClick={() => onOpenPptDownload(row.id)}
          className={legacyActionClass("bg-orange-50 text-orange-700 hover:bg-orange-100")}
          title="Download PPT"
        >
          <Presentation className="h-4 w-4" />
        </button>
      ),
    },
    {
      id: "pptLink",
      header: "PPT Link",
      mobileFooter: true,
      cell: (row) => (
        <button
          type="button"
          onClick={() => onOpenPptLink(row.id)}
          className={legacyActionClass("bg-orange-50 text-orange-700 hover:bg-orange-100")}
          title="Copy PPT link"
        >
          <Link2 className="h-4 w-4" />
        </button>
      ),
    },
    {
      id: "createdBy",
      header: "Created By",
      mobileFooter: true,
      cell: (row) =>
        row.createdById ? (
          <Link
            href={EVENT_ROUTES.createdByUser(row.createdById)}
            className={legacyActionClass("bg-brand-50 text-brand-700 hover:bg-brand-100")}
            title="View creator"
          >
            <Pencil className="h-4 w-4" />
          </Link>
        ) : (
          "—"
        ),
    },
    {
      id: "whatsapp",
      header: "WhatsApp",
      mobileFooter: true,
      cell: (row) => (
        <button
          type="button"
          onClick={() => onWhatsApp(row)}
          disabled={whatsappLoading}
          className={legacyActionClass("bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-60")}
          title="Send WhatsApp notification"
        >
          {whatsappLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MessageCircle className="h-4 w-4" />
          )}
        </button>
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
