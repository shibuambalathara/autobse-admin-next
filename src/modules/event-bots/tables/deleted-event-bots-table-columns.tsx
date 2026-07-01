"use client";

import { RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { formatDate } from "@/lib/date-format";
import type { DeletedEventBotItem } from "@/modules/event-bots/types";
import type { TableColumn } from "@/types";

export type DeletedEventBotDisplayRow = DeletedEventBotItem & {
  sellerName: string;
};

export function createDeletedEventBotsTableColumns(options: {
  onRestore: (event: DeletedEventBotItem) => void;
  onPermanentDelete: (event: DeletedEventBotItem) => void;
  isAdmin?: boolean;
}): TableColumn<DeletedEventBotDisplayRow>[] {
  const { onRestore, onPermanentDelete, isAdmin = false } = options;

  return [
    {
      id: "metaEventId",
      header: "Meta Event ID",
      cell: (row) => row.metaEventId ?? "—",
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
      id: "status",
      header: "Status",
      accessor: "status",
    },
    {
      id: "successCount",
      header: "Success Count",
      cell: (row) => row.successCount ?? 0,
    },
    {
      id: "startDate",
      header: "Start Date",
      cell: (row) => formatDate(row.startDate),
    },
    {
      id: "restore",
      header: "Restore",
      mobileFooter: true,
      cell: (row) => (
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8 text-emerald-700"
          onClick={() => onRestore(row)}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      ),
    },
    ...(isAdmin
      ? [
          {
            id: "delete",
            header: "Action",
            mobileFooter: true,
            cell: (row: DeletedEventBotDisplayRow) => (
              <Button
                type="button"
                size="icon"
                variant="danger"
                className="h-8 w-8"
                onClick={() => onPermanentDelete(row)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ),
          } satisfies TableColumn<DeletedEventBotDisplayRow>,
        ]
      : []),
  ];
}
