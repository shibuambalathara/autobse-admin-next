"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { APP_ROLES, isRole } from "@/auth/roles";
import { AccessDenied } from "@/auth/access-denied";
import { useAccess } from "@/auth/use-access";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { useDeletedCareersList } from "@/modules/career/hooks/useDeletedCareersList";
import { createDeletedCareersTableColumns } from "@/modules/career/tables/deleted-careers-table-columns";

export function DeletedCareersView() {
  const { role } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const list = useDeletedCareersList();

  const columns = useMemo(
    () => createDeletedCareersTableColumns({ onRestore: list.restore }),
    [list.restore]
  );

  const showInitialLoading =
    !list.canFetch || (list.loading && list.careers.length === 0);

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Career access restricted"
        description="Only administrators can view deleted careers."
      />
    );
  }

  return (
    <PageContainer
      title="Deleted Careers"
      description="Restore soft-deleted career postings."
      actions={
        <Link
          href={ROUTES.career}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Careers
        </Link>
      }
    >
      {showInitialLoading ? (
        <LoadingState label="Loading deleted careers…" />
      ) : list.error ? (
        <EmptyState
          title="Failed to load deleted careers"
          description={extractGraphqlError(list.error).message}
        />
      ) : (
        <DataTable
          columns={columns}
          data={list.careers}
          variant="users"
          searchValue={list.searchInput}
          onSearchChange={list.setSearchInput}
          searchPlaceholder="Search deleted careers…"
          pagination={{
            page: list.page,
            pageSize: list.pageSize,
            total: list.total,
          }}
          onPageChange={list.setPage}
          emptyTitle="No deleted careers"
          emptyDescription="Deleted career postings will appear here."
        />
      )}
    </PageContainer>
  );
}
