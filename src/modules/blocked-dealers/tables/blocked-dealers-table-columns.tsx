"use client";

import Link from "next/link";
import { UserPen } from "lucide-react";
import { Button } from "@/components/ui";
import { formatDate } from "@/lib/date-format";
import { ROUTES } from "@/constants/routes";
import type { BlockedDealer } from "@/modules/blocked-dealers/types";
import type { TableColumn } from "@/types";

export function createBlockedDealersTableColumns(options: {
  showSellerName?: boolean;
  canManage?: boolean;
  onUnblock: (payload: { pan: string; sellerId?: string }) => void;
  unblocking?: boolean;
}): TableColumn<BlockedDealer>[] {
  const {
    showSellerName = false,
    canManage = false,
    onUnblock,
    unblocking = false,
  } = options;

  const columns: TableColumn<BlockedDealer>[] = [
    {
      id: "panCardNo",
      header: "PAN Card No",
      accessor: "panCardNo",
      sticky: true,
      mobilePrimary: true,
    },
  ];

  if (showSellerName) {
    columns.push({
      id: "sellerName",
      header: "Seller Name",
      cell: (row) => row.seller?.name || "—",
    });
  }

  columns.push(
    {
      id: "reason",
      header: "Reason",
      cell: (row) => row.reason || "—",
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => formatDate(row.createdAt),
    },
    ...(canManage
      ? [
          {
            id: "unblock",
            header: "Action",
            mobileFooter: true,
            cell: (row: BlockedDealer) => (
              <Button
                type="button"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={unblocking}
                onClick={() =>
                  onUnblock({
                    pan: row.panCardNo,
                    sellerId: row.seller?.id ?? undefined,
                  })
                }
              >
                Unblock
              </Button>
            ),
          } satisfies TableColumn<BlockedDealer>,
        ]
      : [])
  );

  return columns;
}

export function createGlobalBlockedDealersTableColumns(): TableColumn<BlockedDealer>[] {
  return [
    {
      id: "sellerName",
      header: "Seller Name",
      sticky: true,
      mobilePrimary: true,
      cell: (row) => row.seller?.name || "—",
    },
    {
      id: "panCardNo",
      header: "PAN Card No",
      accessor: "panCardNo",
    },
    {
      id: "reason",
      header: "Reason",
      cell: (row) => row.reason || "—",
    },
    {
      id: "createdAt",
      header: "Blocked At",
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: "createdBy",
      header: "Created By",
      mobileFooter: true,
      cell: (row) =>
        row.createdById ? (
          <Link
            href={ROUTES.userDetail(row.createdById)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-blue-600 px-2 text-white hover:bg-blue-700"
            title="View user"
          >
            <UserPen className="h-4 w-4" />
          </Link>
        ) : (
          "—"
        ),
    },
  ];
}
