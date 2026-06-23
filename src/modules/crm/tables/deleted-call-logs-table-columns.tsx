"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";
import { formatDate } from "@/lib/date-format";
import type { CrmCallLog } from "@/modules/crm/types";
import { formatCallDuration, getCallStatusLabel } from "@/modules/crm/utils";
import type { TableColumn } from "@/types";

export function createDeletedCallLogsTableColumns(options: {
  onRestore: (callLog: CrmCallLog) => void;
}): TableColumn<CrmCallLog>[] {
  const { onRestore } = options;

  return [
    {
      id: "staff",
      header: "Staff",
      cell: (row) =>
        [row.staff?.firstName, row.staff?.lastName].filter(Boolean).join(" ") ||
        "—",
    },
    {
      id: "client",
      header: "Client",
      cell: (row) =>
        [row.potentialClient?.firstName, row.potentialClient?.lastName]
          .filter(Boolean)
          .join(" ") || "—",
    },
    {
      id: "callStatus",
      header: "Call Status",
      cell: (row) => getCallStatusLabel(row.callStatus),
    },
    {
      id: "duration",
      header: "Duration",
      cell: (row) => formatCallDuration(row.durationInSeconds),
    },
    {
      id: "remarks",
      header: "Remarks",
      cell: (row) => (
        <span className="block max-w-xs truncate" title={row.remarks ?? ""}>
          {row.remarks || "—"}
        </span>
      ),
    },
    {
      id: "nextFollowUpAt",
      header: "Next Follow Up",
      cell: (row) => formatDate(row.nextFollowUpAt),
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
    {
      id: "restore",
      header: "Restore",
      mobileFooter: true,
      cell: (row) => (
        <Button
          type="button"
          size="icon"
          className="h-8 w-8 bg-emerald-700 hover:bg-emerald-800"
          onClick={() => onRestore(row)}
          title="Restore call log"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}
