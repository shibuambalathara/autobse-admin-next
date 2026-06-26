"use client";

import { formatDate } from "@/lib/date-format";
import type { PendingUserItem } from "@/modules/users/types";
import type { TableColumn } from "@/types";
export const pendingUsersTableColumns: TableColumn<PendingUserItem>[] = [
  {
    id: "idNo",
    header: "ID No",
    cell: (row) => row.idNo ?? "—",
  },
  {
    id: "firstName",
    header: "First Name",
    accessor: "firstName",
    sticky: true,
    mobilePrimary: true,
    className: "font-medium text-brand-900",
  },
  { id: "lastName", header: "Last Name", accessor: "lastName" },
  { id: "mobile", header: "Mobile", accessor: "mobile" },
  { id: "pancardNo", header: "PAN Card No", accessor: "pancardNo" },
  { id: "state", header: "State", accessor: "state" },
  {
    id: "createdAt",
    header: "Created At",
    cell: (row) => formatDate(row.createdAt),
  },
];
