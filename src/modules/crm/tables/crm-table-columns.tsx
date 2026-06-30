"use client";

import Link from "next/link";
import {
  ArrowRightLeft,
  Eye,
  Phone,
  Trash2,
  UserPen,
} from "lucide-react";
import { Button } from "@/components/ui";
import { formatDate } from "@/lib/date-format";
import { ROUTES } from "@/constants/routes";
import type { CrmClient } from "@/modules/crm/types";
import {
  getBuyerPreferenceLabel,
  getPotentialClientStatusLabel,
} from "@/modules/crm/utils";
import { formatStateDisplay } from "@/modules/users/utils";
import type { TableColumn } from "@/types";

function actionLinkClass(tone: string) {
  return `inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium text-white ${tone}`;
}

export function createCrmTableColumns(options: {
  stateNameById: Record<string, string>;
  onDelete: (client: CrmClient) => void;
  onMoveToUser: (client: CrmClient) => void;
  showAssignedStaff?: boolean;
  isAdmin?: boolean;
}): TableColumn<CrmClient>[] {
  const {
    stateNameById,
    onDelete,
    onMoveToUser,
    showAssignedStaff = true,
    isAdmin = false,
  } = options;

  const columns: TableColumn<CrmClient>[] = [
    { id: "idNo", header: "SL No", accessor: "idNo" },
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
      id: "vehicleCategory",
      header: "Vehicle Category",
      cell: (row) => row.vehicleCategory?.name ?? "—",
    },
    {
      id: "location",
      header: "Location",
      cell: (row) => row.location?.name ?? "—",
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
  ];

  if (showAssignedStaff) {
    columns.push({
      id: "assignedStaff",
      header: "Assigned Staff",
      cell: (row) => {
        const staff = row.assignedStaff;
        if (!staff?.id) return "—";
        const staffName =
          [staff.firstName, staff.lastName].filter(Boolean).join(" ") ||
          staff.id;
        return (
          <Link
            href={ROUTES.userDetail(staff.id)}
            className="text-brand-600 hover:underline"
          >
            {staffName}
          </Link>
        );
      },
    });
  }

  columns.push(
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
      id: "edit",
      header: "Buyer Details",
      mobileFooter: true,
      cell: (row) => (
        <Link
          href={ROUTES.crmEdit(row.id)}
          title="Edit buyer lead"
          className={actionLinkClass("bg-cyan-500 hover:bg-cyan-600")}
        >
          <UserPen className="h-4 w-4" />
        </Link>
      ),
    },
    {
      id: "callLogs",
      header: "Call Logs",
      mobileFooter: true,
      cell: (row) => (
        <Link
          href={ROUTES.crmCallLogs(row.id)}
          title="View call logs"
          className={actionLinkClass("bg-emerald-600 hover:bg-emerald-700")}
        >
          <Phone className="h-4 w-4" />
        </Link>
      ),
    },
    {
      id: "createdBy",
      header: "Created By",
      mobileFooter: true,
      cell: (row) =>
        row.createdById ? (
          <Link
            href={ROUTES.userDetail(row.createdById)}
            className={actionLinkClass("bg-blue-600 hover:bg-blue-700")}
          >
            <Eye className="h-4 w-4" />
          </Link>
        ) : (
          "—"
        ),
    },
    {
      id: "moveToUser",
      header: "Move to Users",
      mobileFooter: true,
      cell: (row) =>
        row.registeredUserId ? (
          "—"
        ) : (
          <Button
            type="button"
            size="icon"
            className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => onMoveToUser(row)}
            title="Move to users"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        ),
    }
  );

  if (isAdmin) {
    columns.push({
      id: "delete",
      header: "Delete",
      mobileFooter: true,
      cell: (row) => (
        <Button
          type="button"
          size="icon"
          variant="danger"
          className="h-8 w-8"
          onClick={() => onDelete(row)}
          title="Delete buyer lead"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    });
  }

  return columns;
}
