"use client";

import type { TableColumn } from "@/types";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { formatDate } from "@/lib/date-format";
import {
  formatScheduleCallStatus,
  truncateMessage,
} from "@/modules/schedule-calls/constants";
import type { ScheduleCall } from "@/modules/schedule-calls/types";
import { formatStateDisplay } from "@/modules/users/utils";

export function createScheduleCallsTableColumns(options: {
  onViewMessage: (message: string) => void;
  onStatusChange: (scheduleCall: ScheduleCall) => void;
  onDelete: (scheduleCall: ScheduleCall) => void;
}): TableColumn<ScheduleCall>[] {
  const { onViewMessage, onStatusChange, onDelete } = options;

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
      header: "Scheduled Date",
      cell: (row) => formatDate(row.PreferredDate),
    },
    {
      id: "message",
      header: "Message",
      cell: (row) => {
        const message = row.message ?? "";
        if (!message) return "—";
        return (
          <button
            type="button"
            onClick={() => onViewMessage(message)}
            className="text-left text-sm text-brand-700 hover:text-brand-900"
          >
            {truncateMessage(message)}
          </button>
        );
      },
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: "status",
      header: "Status",
      mobileFooter: true,
      cell: (row) => (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onStatusChange(row)}
        >
          {formatScheduleCallStatus(row.status)}
        </Button>
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
          onClick={() => onDelete(row)}
          title="Delete scheduled call"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}
