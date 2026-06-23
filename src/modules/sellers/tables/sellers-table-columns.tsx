"use client";

import Link from "next/link";
import { Building2, Download, ShieldBan } from "lucide-react";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { SELLER_ROUTES } from "@/modules/sellers/constants";
import type { Seller } from "@/modules/sellers/types";
import type { TableColumn } from "@/types";

function actionLinkClass(tone: string) {
  return `inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium text-white ${tone}`;
}

export function createSellersTableColumns(options: {
  canManage: boolean;
  isAdmin: boolean;
  onDownloadAcr: (seller: Seller) => void;
  acrLoading: boolean;
}): TableColumn<Seller>[] {
  const { canManage, isAdmin, onDownloadAcr, acrLoading } = options;

  const columns: TableColumn<Seller>[] = [
    {
      id: "name",
      header: "Name",
      accessor: "name",
      sticky: true,
      mobilePrimary: true,
    },
    {
      id: "contactPerson",
      header: "Contact Person",
      cell: (row) => row.contactPerson || "—",
    },
    {
      id: "nationalHead",
      header: "National Head",
      cell: (row) => row.nationalHead || "—",
    },
    {
      id: "mobile",
      header: "Mobile",
      cell: (row) => row.mobile || "—",
    },
    {
      id: "gst",
      header: "GST Number",
      cell: (row) => row.GSTNumber || "—",
    },
  ];

  if (canManage) {
    columns.push({
      id: "edit",
      header: "View / Edit",
      mobileFooter: true,
      cell: (row) => (
        <Link
          href={ROUTES.sellerEdit(row.id)}
          title="Edit seller"
          target="_blank"
          rel="noopener noreferrer"
          className={actionLinkClass("bg-red-500 hover:bg-red-600")}
        >
          <Building2 className="h-4 w-4" />
        </Link>
      ),
    });
  }

  if (isAdmin) {
    columns.push({
      id: "blockedDealers",
      header: "Blocked Dealers",
      mobileFooter: true,
      cell: (row) => (
        <Link
          href={SELLER_ROUTES.blockedDealers(row.id, row.name)}
          title={`Blocked dealers for ${row.name}`}
          className={actionLinkClass("bg-blue-600 hover:bg-blue-700")}
        >
          <ShieldBan className="h-4 w-4" />
        </Link>
      ),
    });
  }

  columns.push({
    id: "downloadAcr",
    header: "Download All ACR",
    mobileFooter: true,
    cell: (row) => (
      <Button
        type="button"
        size="icon"
        className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700"
        onClick={() => onDownloadAcr(row)}
        disabled={acrLoading}
        title="Download ACR"
      >
        <Download className="h-4 w-4" />
      </Button>
    ),
  });

  return columns;
}
