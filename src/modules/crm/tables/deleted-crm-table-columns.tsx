"use client";

import Link from "next/link";
import { Eye, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";
import { formatDate } from "@/lib/date-format";
import { ROUTES } from "@/constants/routes";
import type { CrmDeletedClient } from "@/modules/crm/types";
import {
  getBuyerPreferenceLabel,
  getPotentialClientStatusLabel,
} from "@/modules/crm/utils";
import { formatStateDisplay } from "@/modules/users/utils";
import type { TableColumn } from "@/types";

export function createDeletedCrmTableColumns(options: {
  stateNameById: Record<string, string>;
  staffNameById: Record<string, string>;
  onRestore: (client: CrmDeletedClient) => void;
}): TableColumn<CrmDeletedClient>[] {
  const { stateNameById, staffNameById, onRestore } = options;

  return [
    { id: "firstName", header: "First Name", accessor: "firstName" },
    { id: "lastName", header: "Last Name", accessor: "lastName" },
    { id: "email", header: "Email", accessor: "email" },
    { id: "mobile", header: "Mobile", accessor: "mobile" },
    {
      id: "state",
      header: "State",
      cell: (row) =>
        row.stateId
          ? formatStateDisplay(stateNameById[row.stateId])
          : "—",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => getPotentialClientStatusLabel(row.status),
    },
    {
      id: "buyerPreference",
      header: "Buyer Preference",
      cell: (row) => getBuyerPreferenceLabel(row.buyerPreference),
    },
    {
      id: "assignedStaff",
      header: "Assigned Staff",
      cell: (row) =>
        row.assignedStaffId
          ? staffNameById[row.assignedStaffId] ?? row.assignedStaffId
          : "—",
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
      id: "createdBy",
      header: "Created By",
      mobileFooter: true,
      cell: (row) =>
        row.createdById ? (
          <Link
            href={ROUTES.userDetail(row.createdById)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            <Eye className="h-4 w-4" />
          </Link>
        ) : (
          "—"
        ),
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
          title="Restore potential buyer"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}
