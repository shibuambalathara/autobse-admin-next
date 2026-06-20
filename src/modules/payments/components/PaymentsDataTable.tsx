"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { User } from "lucide-react";
import Swal from "sweetalert2";
import { formatDate } from "@/lib/date-format";
import { Can } from "@/auth/can";
import { PERMISSIONS } from "@/auth/permissions";
import { DataTable } from "@/components/table";
import { ROUTES } from "@/constants/routes";
import { ChangePaymentStatusModal } from "@/modules/payments/components/ChangePaymentStatusModal";
import type { PaymentListItem } from "@/modules/payments/types";
import type { TableColumn } from "@/types";

const actionBtn =
  "inline-flex h-8 items-center justify-center rounded-md px-2 text-xs font-medium text-white";

interface PaymentsDataTableProps {
  payments: PaymentListItem[];
  isLoading?: boolean;
  onRefetch: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: { id: string; label: string; value: string; options: { label: string; value: string }[] }[];
  onFilterChange?: (filterId: string, value: string) => void;
  pagination?: { page: number; pageSize: number; total: number };
  onPageChange?: (page: number) => void;
  toolbarActions?: React.ReactNode;
}

export function PaymentsDataTable({
  payments,
  isLoading,
  onRefetch,
  searchValue,
  onSearchChange,
  filters,
  onFilterChange,
  pagination,
  onPageChange,
  toolbarActions,
}: PaymentsDataTableProps) {
  const router = useRouter();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentListItem | null>(null);

  const openStatusModal = (payment: PaymentListItem) => {
    setSelectedPayment(payment);
    setStatusModalOpen(true);
  };

  const handleMessage = (payment: PaymentListItem) => {
    const createdAt = payment.createdAt
      ? formatDate(payment.createdAt)
      : "";
    const firstName = payment.user?.firstName ?? "";
    const lastName = payment.user?.lastName ?? "";

    void Swal.fire({
      html: `<div>
        <h1>Message From Team AutoBse</h1>
        <p>Dear: ${firstName} ${lastName},</p>
        <p>Thank You for the payment of Rs.${payment.amount ?? ""}. Created at ${createdAt} for ${payment.paymentFor ?? ""}.</p>
        <p>For more details please contact our team.</p>
        <p>Thank you.</p>
      </div>`,
    });
  };

  const columns = useMemo(
    (): TableColumn<PaymentListItem>[] => [
      { id: "refNo", header: "Ref No", accessor: "refNo" },
      { id: "amount", header: "Amount", accessor: "amount" },
      { id: "paymentFor", header: "Payment For", accessor: "paymentFor" },
      { id: "status", header: "Status", accessor: "status" },
      {
        id: "firstName",
        header: "First Name",
        cell: (row) => row.user?.firstName ?? "—",
      },
      {
        id: "mobile",
        header: "Mobile",
        cell: (row) => row.user?.mobile ?? "—",
      },
      {
        id: "createdAt",
        header: "Created At",
        cell: (row) => (row.createdAt ? formatDate(row.createdAt) : "—"),
      },
      {
        id: "updatedAt",
        header: "Updated At",
        cell: (row) => (row.updatedAt ? formatDate(row.updatedAt) : "—"),
      },
      {
        id: "registrationExpire",
        header: "Registration Expire",
        cell: (row) =>
          row.registrationExpire ? formatDate(row.registrationExpire) : "—",
      },
      {
        id: "changeStatus",
        header: "Change Status",
        cell: (row) =>
          row.status === "pending" ? (
            <button
              type="button"
              className={`${actionBtn} bg-emerald-600 hover:bg-emerald-700`}
              onClick={() => openStatusModal(row)}
            >
              Change Status
            </button>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        id: "history",
        header: "Payment History",
        cell: (row) => (
          <Link
            href={ROUTES.paymentHistory(row.id)}
            className={`${actionBtn} bg-blue-600 hover:bg-blue-700`}
          >
            View
          </Link>
        ),
      },
      {
        id: "createdBy",
        header: "Created By",
        cell: (row) =>
          row.createdById ? (
            <Link
              href={ROUTES.userDetail(row.createdById)}
              className={`${actionBtn} bg-blue-600 hover:bg-blue-700`}
              title="View creator"
            >
              <User className="h-4 w-4" />
            </Link>
          ) : (
            "—"
          ),
      },
      {
        id: "updatePayment",
        header: "Update Payment",
        cell: (row) => (
          <Can permission={PERMISSIONS.PAYMENTS_MANAGE}>
            <button
              type="button"
              className={`${actionBtn} bg-emerald-600 hover:bg-emerald-700`}
              onClick={() =>
                router.push(
                  ROUTES.updatePayment(row.id, row.userId ?? undefined)
                )
              }
            >
              Update Payment
            </button>
          </Can>
        ),
      },
      {
        id: "emdDetails",
        header: "Emd Details",
        cell: (row) => {
          const hasEmd =
            row.emdUpdate &&
            row.emdUpdate.length > 0 &&
            row.paymentFor === "emd" &&
            row.status === "approved";

          if (!hasEmd) {
            return <span className="text-muted-foreground text-xs">—</span>;
          }

          return (
            <Can permission={PERMISSIONS.PAYMENTS_ADMIN}>
              <Link
                href={ROUTES.emdDetails(row.id)}
                className={`${actionBtn} bg-zinc-600 hover:bg-zinc-700`}
              >
                View
              </Link>
            </Can>
          );
        },
      },
      {
        id: "buyingLimit",
        header: "Update Buying Limit",
        cell: (row) => {
          if (row.paymentFor === "emd" && row.status === "approved") {
            return (
              <Can permission={PERMISSIONS.PAYMENTS_MANAGE}>
                <button
                  type="button"
                  className={`${actionBtn} bg-red-600 hover:bg-red-700`}
                  onClick={() => router.push(ROUTES.addEmd(row.id))}
                >
                  Update
                </button>
              </Can>
            );
          }
          if (row.paymentFor === "registrations") {
            return <span className="text-xs">Registration</span>;
          }
          return <span className="text-muted-foreground">—</span>;
        },
      },
      {
        id: "message",
        header: "Payment Message",
        cell: (row) =>
          row.status === "approved" ? (
            <button
              type="button"
              className={`${actionBtn} bg-teal-600 hover:bg-teal-700`}
              onClick={() => handleMessage(row)}
            >
              Message
            </button>
          ) : (
            <span className="text-xs">{row.status ?? "—"}</span>
          ),
      },
      {
        id: "download",
        header: "Download",
        cell: (row) =>
          row.status === "approved" ? (
            <button
              type="button"
              className={`${actionBtn} bg-blue-600 hover:bg-blue-700`}
              onClick={() =>
                void Swal.fire({
                  icon: "info",
                  title: "PDF export",
                  text: "Payment PDF download is not yet migrated to the new admin panel.",
                })
              }
            >
              PDF
            </button>
          ) : (
            <span className="text-xs">{row.status ?? "—"}</span>
          ),
      },
    ],
    [router]
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={payments}
        isLoading={isLoading}
        variant="users"
        tableMinWidth={1800}
        emptyTitle="No payments found"
        emptyDescription="Payments matching your filters will appear here."
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search by name or mobile…"
        filters={filters}
        onFilterChange={onFilterChange}
        pagination={
          pagination
            ? {
                page: pagination.page,
                pageSize: pagination.pageSize,
                total: pagination.total,
              }
            : undefined
        }
        onPageChange={onPageChange}
        toolbarActions={toolbarActions}
      />

      <ChangePaymentStatusModal
        open={statusModalOpen}
        paymentId={selectedPayment?.id ?? null}
        paymentFor={selectedPayment?.paymentFor}
        currentStatus={selectedPayment?.status}
        onClose={() => {
          setStatusModalOpen(false);
          setSelectedPayment(null);
        }}
        onSuccess={onRefetch}
      />
    </>
  );
}
