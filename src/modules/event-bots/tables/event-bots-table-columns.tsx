"use client";

import Link from "next/link";
import {
  CalendarDays,
  FileUp,
  Trash2,
  UserPen,
} from "lucide-react";
import { Button } from "@/components/ui";
import { formatDate } from "@/lib/date-format";
import { EVENT_BOT_ROUTES } from "@/modules/event-bots/constants";
import type { EventBotDisplayRow } from "@/modules/event-bots/hooks/useEventBotActions";
import type { TableColumn } from "@/types";

function actionButtonClass(tone: string, disabled = false) {
  return `inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium text-white ${tone} ${
    disabled ? "cursor-not-allowed opacity-50 pointer-events-none" : ""
  }`;
}

export function createEventBotsTableColumns(options: {
  onDelete: (id: string) => void;
}): TableColumn<EventBotDisplayRow>[] {
  const { onDelete } = options;

  return [
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
      id: "eventCategory",
      header: "Category",
      accessor: "eventCategory",
    },
    {
      id: "seller",
      header: "Seller",
      cell: (row) => row.sellerName,
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
      id: "successCount",
      header: "Success Count",
      cell: (row) => row.successCount ?? 0,
    },
    {
      id: "errorCount",
      header: "Error Count",
      cell: (row) => row.errorCount ?? 0,
    },
    {
      id: "status",
      header: "Status",
      accessor: "status",
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: "upload",
      header: "Upload Vehicles",
      mobileFooter: true,
      cell: (row) => {
        const isPending = row.status === "PENDING";
        if (!isPending) {
          return (
            <span
              title="Upload allowed only in Pending status"
              className={actionButtonClass("bg-gray-300", true)}
            >
              <FileUp className="h-4 w-4" />
            </span>
          );
        }

        return (
          <Link
            href={EVENT_BOT_ROUTES.upload(row.id)}
            title="Upload Vehicles"
            className={actionButtonClass("bg-emerald-500 hover:bg-emerald-600")}
          >
            <FileUp className="h-4 w-4" />
          </Link>
        );
      },
    },
    {
      id: "edit",
      header: "View / Edit EventBot",
      mobileFooter: true,
      cell: (row) => {
        const isPending = row.status === "PENDING";
        return (
          <Link
            href={EVENT_BOT_ROUTES.edit(row.id)}
            title={
              isPending
                ? "Edit EventBot"
                : "View EventBot (Editing disabled)"
            }
            className={actionButtonClass(
              isPending
                ? "bg-cyan-500 hover:bg-cyan-600"
                : "bg-gray-400 hover:bg-gray-500"
            )}
          >
            <CalendarDays className="h-4 w-4" />
          </Link>
        );
      },
    },
    {
      id: "createdBy",
      header: "Created By",
      mobileFooter: true,
      cell: (row) =>
        row.createdById ? (
          <Link
            href={EVENT_BOT_ROUTES.createdByUser(row.createdById)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            <UserPen className="h-4 w-4" />
          </Link>
        ) : (
          "—"
        ),
    },
    {
      id: "delete",
      header: "Action",
      mobileFooter: true,
      cell: (row) => (
        <Button
          type="button"
          size="icon"
          variant="danger"
          className="h-8 w-8"
          onClick={() => onDelete(row.id)}
          title="Delete EventBot"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}
