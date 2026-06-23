"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PERMISSIONS } from "@/auth/permissions";
import { useAccess } from "@/auth/use-access";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { SellersPageToolbar } from "@/modules/sellers/components/SellersPageToolbar";
import { useSellerActions } from "@/modules/sellers/hooks/useSellerActions";
import { useSellersList } from "@/modules/sellers/hooks/useSellersList";
import { createSellersTableColumns } from "@/modules/sellers/tables/sellers-table-columns";
import { APP_ROLES } from "@/auth/roles";
import { useAuth } from "@/auth/use-auth";
import { extractGraphqlError } from "@/lib/graphql-errors";

export function SellersListView() {
  const { user } = useAuth();
  const { can } = useAccess();
  const isAdmin = user?.role?.toLowerCase() === APP_ROLES.ADMIN;
  const canManage = can(PERMISSIONS.SELLERS_MANAGE);

  const list = useSellersList();
  const actions = useSellerActions();

  const columns = useMemo(
    () =>
      createSellersTableColumns({
        canManage,
        isAdmin,
        acrLoading: actions.acrLoading,
        onDownloadAcr: (seller) => actions.downloadAcr(seller.id, seller.name),
      }),
    [actions.acrLoading, actions.downloadAcr, canManage, isAdmin]
  );

  const showInitialLoading = list.loading && list.allSellers.length === 0;

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title="Sellers"
        description="Manage seller companies, contacts, and ACR exports."
        actions={
          canManage ? (
            <div className="hidden flex-wrap gap-2 lg:flex">
              <Link
                href={ROUTES.sellersAdd}
                className={buttonVariants({ size: "sm" })}
              >
                <Plus className="h-4 w-4 shrink-0" />
                Add Seller
              </Link>
            </div>
          ) : undefined
        }
      >
        <SellersPageToolbar canManage={canManage} isAdmin={isAdmin} />

        {showInitialLoading ? (
          <LoadingState label="Loading sellers…" />
        ) : list.error ? (
          <EmptyState
            title="Failed to load sellers"
            description={extractGraphqlError(list.error).message}
            action={
              <button
                type="button"
                className={buttonVariants({ size: "sm" })}
                onClick={() => list.refetch()}
              >
                Retry
              </button>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={list.sellers}
            tableMinWidth={1200}
            variant="users"
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search sellers…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No sellers found"
            emptyDescription="Try adjusting your search."
          />
        )}
      </PageContainer>
    </div>
  );
}
