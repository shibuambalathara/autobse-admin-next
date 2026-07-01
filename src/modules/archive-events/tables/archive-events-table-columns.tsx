"use client";

import Link from "next/link";
import { Download, FilePenLine, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import type { ArchivedEvent, ArchivedVehicle } from "@/modules/archive-events/types";
import type { EventFilterOption } from "@/modules/events/types";
import type { TableColumn } from "@/types";

function lookupLabel(
  options: EventFilterOption[],
  id?: string | null
): string {
  if (!id) return "—";
  return options.find((option) => option.value === id)?.label ?? "—";
}

function actionLinkClass(tone: string) {
  return `inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium ${tone}`;
}

export interface ArchiveEventsTableColumnOptions {
  sellerOptions: EventFilterOption[];
  locationOptions: EventFilterOption[];
  vehicleCategoryOptions: EventFilterOption[];
  onDownloadAcr: (event: ArchivedEvent, sellerName: string, locationName: string) => void;
  acrLoadingEventId?: string | null;
}

export function createArchiveEventsTableColumns(
  options: ArchiveEventsTableColumnOptions
): TableColumn<ArchivedEvent>[] {
  const {
    sellerOptions,
    locationOptions,
    vehicleCategoryOptions,
    onDownloadAcr,
    acrLoadingEventId,
  } = options;

  return [
    {
      id: "eventNo",
      header: "Event No",
      accessor: "eventNo",
      sticky: true,
      mobilePrimary: true,
    },
    {
      id: "seller",
      header: "Seller",
      cell: (row) => lookupLabel(sellerOptions, row.sellerId),
    },
    {
      id: "eventCategory",
      header: "Event Category",
      accessor: "eventCategory",
    },
    {
      id: "location",
      header: "Location",
      cell: (row) => lookupLabel(locationOptions, row.locationId),
    },
    {
      id: "viewVehicles",
      header: "View Vehicles",
      cell: (row) => {
        const count = row.vehiclesCount ?? 0;
        const sellerName = lookupLabel(sellerOptions, row.sellerId);
        if (count === 0) {
          return (
            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-neutral-300 px-2 text-sm text-neutral-600">
              0
            </span>
          );
        }

        return (
          <Link
            href={ROUTES.archiveEventVehicles(row.id, {
              eventNo: row.eventNo,
              sellerName: sellerName !== "—" ? sellerName : undefined,
            })}
            className={actionLinkClass("bg-teal-600 text-white hover:bg-teal-700")}
          >
            {count}
          </Link>
        );
      },
    },
    {
      id: "terms",
      header: "T&C",
      cell: (row) => {
        const sellerName = lookupLabel(sellerOptions, row.sellerId);
        return (
          <Link
            href={ROUTES.archiveEventTerms(row.id, {
              eventNo: row.eventNo,
              sellerName: sellerName !== "—" ? sellerName : undefined,
            })}
            className={actionLinkClass("bg-blue-500 text-white hover:bg-blue-600")}
            title="View archived accepted Terms & Conditions"
          >
            Accepted Users
          </Link>
        );
      },
    },
    {
      id: "vehicleCategory",
      header: "Vehicle Category",
      cell: (row) => lookupLabel(vehicleCategoryOptions, row.vehicleCategoryId),
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
      id: "archivedAt",
      header: "Archived At",
      cell: (row) => formatDate(row.archivedAt),
    },
    {
      id: "acr",
      header: "ACR (Excel)",
      cell: (row) => {
        const sellerName = lookupLabel(sellerOptions, row.sellerId);
        const locationName = lookupLabel(locationOptions, row.locationId);
        const loading = acrLoadingEventId === row.id;

        return (
          <Button
            type="button"
            size="icon"
            className="h-8 w-8 bg-blue-500 hover:bg-blue-600"
            disabled={loading}
            title="Download archive ACR Excel"
            onClick={() =>
              onDownloadAcr(
                row,
                sellerName !== "—" ? sellerName : "Client",
                locationName !== "—" ? locationName : "Location"
              )
            }
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        );
      },
    },
    {
      id: "archivedBy",
      header: "Archived By",
      cell: (row) =>
        row.archivedBy?.id ? (
          <Link
            href={ROUTES.userDetail(row.archivedBy.id)}
            className={actionLinkClass("bg-blue-500 text-white hover:bg-blue-600")}
            title="View user"
          >
            <FilePenLine className="h-4 w-4" />
          </Link>
        ) : (
          "—"
        ),
    },
  ];
}

export function createArchiveVehiclesTableColumns(options?: {
  eventArchiveId?: string;
  eventNo?: string;
  sellerName?: string;
}): TableColumn<ArchivedVehicle>[] {
  const { eventArchiveId, eventNo, sellerName } = options ?? {};

  return [
    {
      id: "lotNumber",
      header: "Lot Number",
      accessor: "lotNumber",
      sticky: true,
      mobilePrimary: true,
    },
    {
      id: "loanAgreementNo",
      header: "Loan Ag.No.",
      accessor: "loanAgreementNo",
    },
    {
      id: "vehicleIndexNo",
      header: "Vehicle ID",
      accessor: "vehicleIndexNo",
    },
    {
      id: "registrationNumber",
      header: "Registration Number",
      cell: (row) =>
        row.registrationNumber ? (
          <Link
            href={ROUTES.archiveVehicleDetail(row.id, {
              eventArchiveId,
              eventNo,
              sellerName,
            })}
            className={actionLinkClass("bg-sky-500 text-white hover:bg-sky-600")}
          >
            {row.registrationNumber}
          </Link>
        ) : (
          "—"
        ),
    },
    {
      id: "model",
      header: "Model",
      accessor: "model",
    },
    {
      id: "bidStatus",
      header: "Bid Status",
      accessor: "bidStatus",
    },
    {
      id: "bidStartTime",
      header: "Bid Start Time",
      cell: (row) => formatDate(row.bidStartTime),
    },
    {
      id: "bidTimeExpire",
      header: "Bid End Time",
      cell: (row) => formatDate(row.bidTimeExpire),
    },
    {
      id: "totalBids",
      header: "Bid History",
      cell: (row) => row.totalBids ?? 0,
    },
    {
      id: "currentBidAmount",
      header: "Current Bid Amount",
      accessor: "currentBidAmount",
    },
    {
      id: "createdAt",
      header: "Archived On",
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: "topBidder",
      header: "Top Bidder",
      cell: (row) =>
        row.currentBidUser
          ? `${row.currentBidUser.firstName ?? ""} ${row.currentBidUser.lastName ?? ""}`.trim() ||
            "—"
          : "—",
    },
  ];
}

export function createArchiveTermsTableColumns(): TableColumn<
  import("@/modules/archive-events/types").ArchiveTermsRow
>[] {
  return [
    {
      id: "archivedAt",
      header: "Archived At",
      cell: (row) => formatDate(row.archivedAt),
      sticky: true,
      mobilePrimary: true,
    },
    {
      id: "user",
      header: "User",
      cell: (row) =>
        row.userId ? (
          <Link
            href={ROUTES.userDetail(row.userId)}
            className={actionLinkClass("bg-blue-500 text-white hover:bg-blue-600")}
            title="View user"
          >
            <FilePenLine className="h-4 w-4" />
          </Link>
        ) : (
          "—"
        ),
    },
    {
      id: "archivedBy",
      header: "Archived By",
      cell: (row) =>
        row.archivedById ? (
          <Link
            href={ROUTES.userDetail(row.archivedById)}
            className={actionLinkClass("bg-blue-700 text-white hover:bg-blue-800")}
            title="View user"
          >
            <FilePenLine className="h-4 w-4" />
          </Link>
        ) : (
          "—"
        ),
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: "updatedAt",
      header: "Updated At",
      cell: (row) => formatDate(row.updatedAt),
    },
  ];
}
