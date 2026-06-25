"use client";

import type { TableColumn } from "@/types";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";
import { formatDate } from "@/lib/date-format";
import { formatScheduleCallStatus } from "@/modules/schedule-calls/constants";
import type { ScheduleCall } from "@/modules/schedule-calls/types";
import { formatStateDisplay } from "@/modules/users/utils";

export function createDeletedScheduleCallsTableColumns(options: {
  onRestore: (scheduleCall: ScheduleCall) => void;
}): TableColumn<ScheduleCall>[] {
  const { onRestore } = options;

  return [
    {
      id: "scheduleNo",
      header: "Schedule No",
      cell: (row) => row.ScheduleNo ?? "—",
    },
    {
      id: "fullName",
      header: "Full Name",
      cell: (row) => row.fullName ?? "—",
    },
    {
      id: "email",
      header: "Email",
      cell: (row) => row.email ?? "—",
    },
    {
      id: "mobile",
      header: "Mobile",
      cell: (row) => row.mobile ?? "—",
    },
    {
      id: "state",
      header: "State",
      cell: (row) =>
        row.state ? formatStateDisplay(String(row.state)) : "—",
    },
    {
      id: "preferredDate",
      header: "Preferred Date",
      cell: (row) => formatDate(row.PreferredDate),
    },
    {
      id: "message",
      header: "Message",
      cell: (row) => row.message ?? "—",
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => formatScheduleCallStatus(row.status),
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
          className="h-8 w-8"
          onClick={() => onRestore(row)}
          title="Restore scheduled call"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}
