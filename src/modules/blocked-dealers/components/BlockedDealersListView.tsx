"use client";

import { useMemo, useState } from "react";
import { PageContainer } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { useBlockedDealerActions } from "@/modules/blocked-dealers/hooks/useBlockedDealerActions";
import { useBlockedDealersList } from "@/modules/blocked-dealers/hooks/useBlockedDealersList";
import { createGlobalBlockedDealersTableColumns } from "@/modules/blocked-dealers/tables/blocked-dealers-table-columns";

export function BlockedDealersListView() {
  const list = useBlockedDealersList();
  const columns = useMemo(() => createGlobalBlockedDealersTableColumns(), []);

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title="Blocked Dealers"
        description="View all dealers blocked by sellers across the platform."
      >
        {list.loading && list.dealers.length === 0 ? (
          <LoadingState label="Loading blocked dealers…" />
        ) : list.error ? (
          <EmptyState
            title="Failed to load blocked dealers"
            description={extractGraphqlError(list.error).message}
            action={
              <button
                type="button"
                className="text-sm font-medium text-brand-600 hover:text-brand-900"
                onClick={() => list.refetch()}
              >
                Retry
              </button>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={list.dealers}
            isLoading={list.loading}
            variant="users"
            tableMinWidth={1000}
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search by PAN or seller name…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No blocked dealers"
            emptyDescription="Try adjusting your search."
          />
        )}
      </PageContainer>
    </div>
  );
}
