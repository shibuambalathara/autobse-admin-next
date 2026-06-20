"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { useCrmActions } from "@/modules/crm/hooks/useCrmActions";
import { useDeletedCrmList } from "@/modules/crm/hooks/useDeletedCrmList";
import { createDeletedCrmTableColumns } from "@/modules/crm/tables/deleted-crm-table-columns";

export function DeletedCrmListView() {
  const list = useDeletedCrmList();
  const actions = useCrmActions(() => list.refetch());

  const columns = useMemo(
    () =>
      createDeletedCrmTableColumns({
        stateNameById: list.filterOptions.stateNameById,
        staffNameById: list.filterOptions.staffNameById,
        onRestore: actions.restoreDeletedClient,
      }),
    [
      actions.restoreDeletedClient,
      list.filterOptions.staffNameById,
      list.filterOptions.stateNameById,
    ]
  );

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title="Deleted Potential Buyers"
        description="Restore soft-deleted potential buyers."
        actions={
          <Link
            href={ROUTES.crm}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to CRM
          </Link>
        }
      >
        {list.loading && list.clients.length === 0 ? (
          <LoadingState label="Loading deleted potential buyers…" />
        ) : (
          <DataTable
            columns={columns}
            data={list.clients}
            variant="users"
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search by name or mobile…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No deleted potential buyers"
            emptyDescription="Try adjusting your search."
          />
        )}
      </PageContainer>
    </div>
  );
}
