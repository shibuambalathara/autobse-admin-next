"use client";

import Link from "next/link";
import { RotateCcw, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import type { WhatsappRecipient } from "@/modules/whatsapp/types";
import type { TableColumn } from "@/types";

export function createWhatsappRecipientsTableColumns(options: {
  onDelete: (recipient: WhatsappRecipient) => void;
}): TableColumn<WhatsappRecipient>[] {
  const { onDelete } = options;

  return [
    {
      id: "eventNo",
      header: "Event No",
      cell: (row) => row.event?.eventNo ?? "—",
      sticky: true,
      mobilePrimary: true,
    },
    {
      id: "seller",
      header: "Seller Name",
      cell: (row) => row.event?.seller?.name ?? "—",
    },
    {
      id: "firstName",
      header: "First Name",
      accessor: "firstName",
    },
    {
      id: "location",
      header: "Location",
      cell: (row) => row.event?.location?.name ?? "—",
    },
    {
      id: "phoneNumber",
      header: "Mobile",
      accessor: "phoneNumber",
    },
    {
      id: "status",
      header: "Status",
      accessor: "status",
    },
    {
      id: "templateName",
      header: "Template Name",
      accessor: "templateName",
    },
    {
      id: "updatedAt",
      header: "Updated At",
      cell: (row) => formatDate(row.updatedAt),
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: "createdBy",
      header: "Created By",
      cell: (row) =>
        row.createdBy?.id ? (
          <Link
            href={ROUTES.userDetail(row.createdBy.id)}
            target="_blank"
            className="inline-flex"
          >
            <Button type="button" size="icon" className="h-8 w-8">
              <User className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          "—"
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
          title="Delete record"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}

export function createDeletedWhatsappTableColumns(options: {
  onRestore: (recipient: WhatsappRecipient) => void;
}): TableColumn<WhatsappRecipient>[] {
  const { onRestore } = options;

  return [
    {
      id: "eventNo",
      header: "Event No",
      cell: (row) => row.event?.eventNo ?? "—",
      sticky: true,
      mobilePrimary: true,
    },
    {
      id: "seller",
      header: "Seller Name",
      cell: (row) => row.event?.seller?.name ?? "—",
    },
    {
      id: "firstName",
      header: "First Name",
      accessor: "firstName",
    },
    {
      id: "location",
      header: "Location",
      cell: (row) => row.event?.location?.name ?? "—",
    },
    {
      id: "phoneNumber",
      header: "Mobile",
      accessor: "phoneNumber",
    },
    {
      id: "status",
      header: "Status",
      accessor: "status",
    },
    {
      id: "templateName",
      header: "Template Name",
      accessor: "templateName",
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: "createdBy",
      header: "Created By",
      cell: (row) =>
        row.createdBy?.id ? (
          <Link
            href={ROUTES.userDetail(row.createdBy.id)}
            target="_blank"
            className="inline-flex"
          >
            <Button type="button" size="icon" className="h-8 w-8">
              <User className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          "—"
        ),
    },
    {
      id: "restore",
      header: "Action",
      mobileFooter: true,
      cell: (row) => (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="h-8 w-8"
          onClick={() => onRestore(row)}
          title="Restore record"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}
