"use client";

import { useMemo } from "react";
import { PageContainer, Select } from "@/components/ui";
import { FormField } from "@/components/forms";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { INDIAN_STATES } from "@/modules/users/constants";
import { pendingUsersTableColumns } from "@/modules/users/tables/pending-users-table-columns";
import { usePendingUsersList } from "@/modules/users/hooks/usePendingUsersList";
import { mapUsersForDisplay } from "@/modules/users/hooks/useUserRowActions";
import { Button } from "@/components/ui";

export function PendingUsersView() {
  const list = usePendingUsersList();
  const displayUsers = useMemo(
    () => mapUsersForDisplay(list.users),
    [list.users]
  );

  return (
    <PageContainer
      title="Pending Users"
      description="Users awaiting registration approval."
    >
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormField label="Search" htmlFor="pending-search">
          <input
            id="pending-search"
            className="h-9 w-full rounded-md border border-surface-border px-3 text-sm"
            placeholder="Search by name, mobile, or PAN…"
            value={list.searchInput}
            onChange={(e) => list.setSearchInput(e.target.value)}
          />
        </FormField>
        <FormField label="State" htmlFor="pending-state">
          <Select
            id="pending-state"
            placeholder="All states"
            options={INDIAN_STATES}
            value={list.state}
            onChange={(e) => list.setState(e.target.value)}
          />
        </FormField>
        <div className="flex items-end">
          <Button size="sm" variant="ghost" onClick={list.clearFilters}>
            Clear filters
          </Button>
        </div>
      </div>

      {list.loading && displayUsers.length === 0 ? (
        <LoadingState label="Loading pending users…" />
      ) : (
        <DataTable
          columns={pendingUsersTableColumns}
          data={displayUsers}
          pagination={{
            page: list.page,
            pageSize: list.pageSize,
            total: list.total,
          }}
          onPageChange={list.setPage}
          emptyTitle="No pending users"
          emptyDescription="No users match your search criteria."
        />
      )}
    </PageContainer>
  );
}
