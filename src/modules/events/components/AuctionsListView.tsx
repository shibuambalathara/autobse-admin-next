"use client";

import { useState } from "react";
import { Button, PageContainer, StatusBadge } from "@/components/ui";
import { DataTable } from "@/components/table";
import type { TableColumn } from "@/types";

interface AuctionRow {
  id: string;
  title: string;
  seller: string;
  vehicles: number;
  status: "live" | "pending" | "completed";
  startDate: string;
}

const demoData: AuctionRow[] = [
  {
    id: "1",
    title: "Mumbai Fleet Auction",
    seller: "HDFC Bank",
    vehicles: 48,
    status: "live",
    startDate: "2026-06-17",
  },
  {
    id: "2",
    title: "Delhi Repossessed Vehicles",
    seller: "ICICI Bank",
    vehicles: 32,
    status: "pending",
    startDate: "2026-06-20",
  },
  {
    id: "3",
    title: "Chennai Two-Wheeler Lot",
    seller: "Bajaj Finance",
    vehicles: 120,
    status: "completed",
    startDate: "2026-06-10",
  },
];

const columns: TableColumn<AuctionRow>[] = [
  { id: "title", header: "Auction", accessor: "title", sticky: true },
  { id: "seller", header: "Seller", accessor: "seller" },
  { id: "vehicles", header: "Vehicles", accessor: "vehicles" },
  {
    id: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} showDot />,
  },
  { id: "startDate", header: "Start Date", accessor: "startDate" },
];

export function AuctionsListView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = demoData.filter((row) => {
    const matchesSearch =
      !search ||
      row.title.toLowerCase().includes(search.toLowerCase()) ||
      row.seller.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PageContainer
      title="Auctions"
      description="Table foundation demo — search, filters, sticky header, pagination."
      actions={<Button variant="outline">Export</Button>}
    >
      <DataTable
        columns={columns}
        data={filtered}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search auctions…"
        filters={[
          {
            id: "status",
            label: "Status",
            value: statusFilter,
            options: [
              { label: "Live", value: "live" },
              { label: "Pending", value: "pending" },
              { label: "Completed", value: "completed" },
            ],
          },
        ]}
        onFilterChange={(_, value) => setStatusFilter(value)}
        pagination={{ page, pageSize, total: filtered.length }}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        emptyDescription="No auctions match your filters."
      />
    </PageContainer>
  );
}
