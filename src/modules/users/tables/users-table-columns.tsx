"use client";

import Link from "next/link";
import {
  CreditCard,
  Eye,
  Loader2,
  MessageCircle,
  MoveRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button, StatusBadge } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { USER_LEGACY_ROUTES } from "@/modules/users/constants/related-routes";
import { formatDate, formatDateOnly } from "@/lib/date-format";
import type { UserListItem } from "@/modules/users/types";
import type { TableColumn } from "@/types";

export interface UsersTableColumnOptions {
  onDelete: (user: UserListItem) => void;
  onMoveToCrm: (user: UserListItem) => void;
  onSendExpiryWhatsapp: (user: UserListItem) => void;
  loadingUserId: string | null;
  canDelete?: boolean;
  canMoveToCrm?: boolean;
}

export function createUsersTableColumns(
  options: UsersTableColumnOptions
): TableColumn<UserListItem>[] {
  const {
    onDelete,
    onMoveToCrm,
    onSendExpiryWhatsapp,
    loadingUserId,
    canDelete = true,
    canMoveToCrm = true,
  } = options;

  return [
    {
      id: "name",
      header: "Name",
      sticky: true,
      mobilePrimary: true,
      cell: (row) => {
        const name = [row.firstName, row.lastName].filter(Boolean).join(" ");
        return name || "—";
      },
    },
    {
      id: "idNo",
      header: "User No.",
      accessor: "idNo",
    },
    { id: "openToken", header: "Open Token", accessor: "openToken" },
    { id: "mobile", header: "Mobile", accessor: "mobile" },
    {
      id: "status",
      header: "Status",
      cell: (row) => {
        if (!row.status) return "—";
        const variant =
          row.status === "active"
            ? "success"
            : row.status === "pending"
              ? "warning"
              : row.status === "blocked"
                ? "danger"
                : "neutral";
        const label =
          row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase();
        return <StatusBadge variant={variant} label={label} />;
      },
    },
    { id: "role", header: "Role", accessor: "role" },
    { id: "state", header: "State", accessor: "state" },
    { id: "pancardNo", header: "Pancard", accessor: "pancardNo" },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: "registrationExpiryDate",
      header: "Registration Expiry",
      cell: (row) => formatDateOnly(row.registrationExpiryDate),
    },
    {
      id: "expiryWhatsapp",
      header: "Expiry WhatsApp",
      mobileFooter: true,
      cell: (row) => {
        const hasExpiry = Boolean(row.registrationExpiryDate);
        const isLoading = loadingUserId === row.id;
        return (
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-8 w-8 text-emerald-600"
            disabled={!hasExpiry || isLoading}
            title={
              hasExpiry
                ? "Send registration expiry WhatsApp"
                : "No registration expiry date"
            }
            onClick={() => onSendExpiryWhatsapp(row)}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MessageCircle className="h-4 w-4" />
            )}
          </Button>
        );
      },
    },
    {
      id: "activeBids",
      header: "Active Bids",
      mobileFooter: true,
      cell: (row) => {
        const count = row.activeBids?.length ?? 0;
        if (count === 0) {
          return (
            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-slate-100 px-2 text-sm text-slate-500">
              0
            </span>
          );
        }
        return (
          <a
            href={USER_LEGACY_ROUTES.bids(row.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-emerald-50 px-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
          >
            {count}
          </a>
        );
      },
    },
    {
      id: "buyingLimit",
      header: "Buying Limit",
      mobileFooter: true,
      cell: (row) => {
        const limit = row.vehicleBuyingLimit ?? 0;
        if (limit === 0) {
          return (
            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-slate-100 px-2 text-sm text-slate-500">
              0
            </span>
          );
        }
        return (
          <a
            href={USER_LEGACY_ROUTES.buyingLimit(row.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-emerald-50 px-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
          >
            {limit}
          </a>
        );
      },
    },
    {
      id: "payments",
      header: "Payments",
      mobileFooter: true,
      cell: (row) => {
        const count = row.paymentsCount ?? 0;
        if (count === 0) {
          return (
            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-slate-100 px-2 text-sm text-slate-500">
              0
            </span>
          );
        }
        return (
          <a
            href={USER_LEGACY_ROUTES.payments(row.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-rose-50 px-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
          >
            {count}
          </a>
        );
      },
    },
    {
      id: "createPayment",
      header: "Create Payment",
      mobileFooter: true,
      cell: (row) => (
        <a
          href={USER_LEGACY_ROUTES.createPayment(row.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600 hover:bg-red-100"
        >
          <CreditCard className="h-4 w-4" />
        </a>
      ),
    },
    {
      id: "details",
      header: "Details",
      mobileFooter: true,
      cell: (row) => (
        <Link
          href={ROUTES.userDetail(row.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-sky-50 text-sky-700 hover:bg-sky-100"
        >
          <Pencil className="h-4 w-4" />
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
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            <Eye className="h-4 w-4" />
          </Link>
        ) : (
          "—"
        ),
    },
    {
      id: "moveToCrm",
      header: "Move to CRM",
      mobileFooter: true,
      cell: (row) =>
        canMoveToCrm ? (
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-8 w-8 text-emerald-700"
            title="Move to Potential Buyers"
            onClick={() => onMoveToCrm(row)}
          >
            <MoveRight className="h-4 w-4" />
          </Button>
        ) : (
          "—"
        ),
    },
    {
      id: "actions",
      header: "Action",
      mobileFooter: true,
      cell: (row) =>
        canDelete ? (
          <Button
            type="button"
            size="icon"
            variant="danger"
            className="h-8 w-8"
            onClick={() => onDelete(row)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : (
          "—"
        ),
    },
  ];
}
