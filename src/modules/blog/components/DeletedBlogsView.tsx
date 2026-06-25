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
import { useDeletedBlogsList } from "@/modules/blog/hooks/useDeletedBlogsList";
import { createDeletedBlogsTableColumns } from "@/modules/blog/tables/deleted-blogs-table-columns";

export function DeletedBlogsView() {
  const { role } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const list = useDeletedBlogsList();

  const columns = useMemo(
    () => createDeletedBlogsTableColumns({ onRestore: list.restore }),
    [list.restore]
  );

  const showInitialLoading = !list.canFetch || (list.loading && list.blogs.length === 0);

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Blog access restricted"
        description="Only administrators can view deleted blogs."
      />
    );
  }

  return (
    <PageContainer
      title="Deleted Blogs"
      description="Restore soft-deleted blog posts."
      actions={
        <Link
          href={ROUTES.blog}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blogs
        </Link>
      }
    >
      {showInitialLoading ? (
        <LoadingState label="Loading deleted blogs…" />
      ) : list.error ? (
        <EmptyState
          title="Failed to load deleted blogs"
          description={extractGraphqlError(list.error).message}
        />
      ) : (
        <DataTable
          columns={columns}
          data={list.blogs}
          variant="users"
          searchValue={list.searchInput}
          onSearchChange={list.setSearchInput}
          searchPlaceholder="Search deleted blogs…"
          pagination={{
            page: list.page,
            pageSize: list.pageSize,
            total: list.total,
          }}
          onPageChange={list.setPage}
          emptyTitle="No deleted blogs"
          emptyDescription="Deleted blog posts will appear here."
        />
      )}
    </PageContainer>
  );
}
