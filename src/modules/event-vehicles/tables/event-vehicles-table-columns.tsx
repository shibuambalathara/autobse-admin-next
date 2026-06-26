"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { formatDate } from "@/lib/date-format";
import { VEHICLE_ROUTES } from "@/modules/event-vehicles/constants";
import { vehicleHasHttpsImages } from "@/modules/vehicles/utils/vehicle-payload";
import type { EventVehicleListItem } from "@/modules/event-vehicles/types";
import type { BidTimeUpdateState } from "@/modules/event-vehicles/hooks/useEventVehicleRowActions";
import type { TableColumn } from "@/types";

function actionClass(tone: string) {
  return `inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium ${tone}`;
}

export interface EventVehiclesTableColumnOptions {
  eventCategory?: string;
  isAdmin: boolean;
  onDelete: (vehicle: EventVehicleListItem) => void;
  onAboutBid: (vehicle: EventVehicleListItem) => void;
  onChangeStatus: (vehicleId: string, bidStatus: string) => void;
  onBidTimeEdit: (update: BidTimeUpdateState) => void;
  onBidNow: (vehicle: EventVehicleListItem) => void;
}

export function createEventVehiclesTableColumns(
  options: EventVehiclesTableColumnOptions
): TableColumn<EventVehicleListItem>[] {
  const {
    eventCategory,
    isAdmin,
    onDelete,
    onAboutBid,
    onChangeStatus,
    onBidTimeEdit,
    onBidNow,
  } = options;

  const columns: TableColumn<EventVehicleListItem>[] = [
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
      cell: (row) => row.loanAgreementNo ?? "—",
    },
    {
      id: "vehicleIndexNo",
      header: "Vehicle ID",
      cell: (row) => row.vehicleIndexNo ?? "—",
    },
    {
      id: "registrationNumber",
      header: "Vehicle Details",
      cell: (row) => (
        <Link
          href={VEHICLE_ROUTES.editVehicle(row.id)}
          className={actionClass("bg-sky-500 text-white hover:bg-sky-600")}
        >
          {row.registrationNumber ?? "—"}
        </Link>
      ),
    },
    {
      id: "model",
      header: "Model",
      cell: (row) => row.model ?? "—",
    },
    {
      id: "bidStatus",
      header: "Bid Status",
      cell: (row) => row.bidStatus ?? "—",
    },
    {
      id: "changeStatus",
      header: "Change Status",
      cell: (row) => (
        <button
          type="button"
          onClick={() => onChangeStatus(row.id, row.bidStatus ?? "")}
          className={actionClass("bg-emerald-500 text-white hover:bg-emerald-600")}
        >
          Change Status
        </button>
      ),
    },
    {
      id: "statusHistory",
      header: "Vehicle Status History",
      cell: (row) => (
        <Link
          href={VEHICLE_ROUTES.vehicleStatusHistory(row.id)}
          className={actionClass("bg-blue-500 text-white hover:bg-blue-600")}
        >
          View
        </Link>
      ),
    },
    {
      id: "bidStartTime",
      header: "Bid Start Time",
      cell: (row) =>
        row.bidStartTime ? (
          <button
            type="button"
            onClick={() =>
              onBidTimeEdit({
                date: row.bidStartTime!,
                id: row.id,
                updateItem: "startTime",
              })
            }
            className={actionClass("bg-red-600 text-white hover:bg-red-700")}
          >
            {formatDate(row.bidStartTime)}
          </button>
        ) : (
          "—"
        ),
    },
    {
      id: "bidTimeExpire",
      header: "End Time",
      cell: (row) =>
        row.bidTimeExpire ? (
          <button
            type="button"
            onClick={() =>
              onBidTimeEdit({
                date: row.bidTimeExpire!,
                id: row.id,
                updateItem: "endtime",
              })
            }
            className={actionClass("bg-red-600 text-white hover:bg-red-700")}
          >
            {formatDate(row.bidTimeExpire)}
          </button>
        ) : (
          "—"
        ),
    },
    {
      id: "bidNow",
      header: "Bid Now",
      cell: (row) => (
        <button
          type="button"
          onClick={() => onBidNow(row)}
          className={actionClass("bg-blue-500 text-white hover:bg-blue-600")}
        >
          Bid Now
        </button>
      ),
    },
    {
      id: "bidHistory",
      header: "Bid History",
      cell: (row) => {
        const totalBids = row.totalBids ?? 0;
        if (totalBids === 0) return "0";
        return (
          <Link
            href={VEHICLE_ROUTES.bidDetails(row.id)}
            className={actionClass("bg-blue-500 text-white hover:bg-blue-600")}
          >
            {totalBids}
          </Link>
        );
      },
    },
    {
      id: "hasImage",
      header: "Have Image",
      cell: (row) => (vehicleHasHttpsImages(row.images) ? "Yes" : "No"),
    },
  ];

  if (isAdmin) {
    columns.push({
      id: "aboutBid",
      header: "About Bid",
      cell: (row) =>
        (row.totalBids ?? 0) !== 0 ? (
          <button
            type="button"
            onClick={() => onAboutBid(row)}
            className={actionClass("bg-teal-500 text-white hover:bg-teal-600")}
          >
            About Bid
          </button>
        ) : (
          "No Bids"
        ),
    });
  }

  columns.push({
    id: "delete",
    header: "Action",
    mobileFooter: true,
    cell: (row) => (
      <button
        type="button"
        onClick={() => onDelete(row)}
        className={actionClass("bg-red-600 text-white hover:bg-red-700")}
        title="Delete vehicle"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    ),
  });

  if (eventCategory === "open") {
    columns.splice(columns.length - 1, 0, {
      id: "bidForOpen",
      header: "Bid For Open",
      cell: (row) => (
        <Link
          href={VEHICLE_ROUTES.openAuctionBid(row.id)}
          className={actionClass("bg-emerald-600 text-white hover:bg-emerald-700")}
        >
          Bid For Open
        </Link>
      ),
    });
  }

  return columns;
}
