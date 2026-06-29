"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, PageContainer } from "@/components/ui";
import { useAccess } from "@/auth/use-access";
import { PERMISSIONS } from "@/auth/permissions";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { SELLERS_QUERY } from "@/graphql/documents/sellers";
import { VIEW_USER_QUERY } from "@/graphql/documents/users";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import {
  BlockSellerModal,
  UnblockDealerModal,
} from "@/modules/blocked-dealers/components/modals/BlockedDealerModals";
import { useBlockedDealerActions } from "@/modules/blocked-dealers/hooks/useBlockedDealerActions";
import { useBlockedDealersList } from "@/modules/blocked-dealers/hooks/useBlockedDealersList";
import { createBlockedDealersTableColumns } from "@/modules/blocked-dealers/tables/blocked-dealers-table-columns";
import type { SellersFilterResult } from "@/modules/events/types";
import type { ViewUserQueryResult } from "@/modules/users/types";

interface BlockedSellersByUserViewProps {
  userId: string;
}

export function BlockedSellersByUserView({ userId }: BlockedSellersByUserViewProps) {
  const router = useRouter();
  const { can } = useAccess();
  const canManageSellers = can(PERMISSIONS.SELLERS_MANAGE);

  const { data: userData, loading: userLoading } = useQuery<ViewUserQueryResult>(
    VIEW_USER_QUERY,
    {
      variables: { where: { id: userId } },
      skip: !userId,
      fetchPolicy: "network-only",
    }
  );

  const user = userData?.user;
  const pancardNo = user?.pancardNo ?? "";

  const list = useBlockedDealersList({
    pancardNo,
    enabled: Boolean(pancardNo),
  });
  const actions = useBlockedDealerActions(() => list.refetch());

  const { data: sellersData } = useQuery<SellersFilterResult>(SELLERS_QUERY);
  const sellerOptions = useMemo(
    () =>
      (sellersData?.sellers ?? []).map((seller) => ({
        value: seller.id,
        label: seller.name,
      })),
    [sellersData?.sellers]
  );

  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [unblockModalOpen, setUnblockModalOpen] = useState(false);
  const [unblockPan, setUnblockPan] = useState("");
  const [unblockSellerId, setUnblockSellerId] = useState<string | undefined>();

  useEffect(() => {
    if (!userLoading && user && !pancardNo) {
      Swal.fire({
        icon: "warning",
        title: "Missing PAN",
        text: "This user does not have a PAN on file.",
      }).then(() => router.push(ROUTES.users));
    }
  }, [userLoading, user, pancardNo, router]);

  const columns = useMemo(
    () =>
      createBlockedDealersTableColumns({
        showSellerName: true,
        canManage: canManageSellers,
        onUnblock: ({ pan, sellerId }) => {
          setUnblockPan(pan);
          setUnblockSellerId(sellerId);
          setUnblockModalOpen(true);
        },
        unblocking: actions.unblocking,
      }),
    [actions.unblocking, canManageSellers]
  );

  const userLabel = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.id
    : "User";

  if (userLoading) {
    return <LoadingState label="Loading user…" fullPage />;
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title={`Blocked Sellers — ${userLabel}`}
        description={`Sellers blocked for PAN ${pancardNo || "—"}.`}
        actions={
          canManageSellers ? (
            <div className="hidden lg:flex">
              <Button size="sm" onClick={() => setBlockModalOpen(true)}>
                + Block Seller
              </Button>
            </div>
          ) : undefined
        }
      >
        {canManageSellers && (
          <div className="mb-4 lg:hidden">
            <Button className="w-full" onClick={() => setBlockModalOpen(true)}>
              + Block Seller
            </Button>
          </div>
        )}

        {list.loading && list.dealers.length === 0 ? (
          <LoadingState label="Loading blocked sellers…" />
        ) : list.error ? (
          <EmptyState
            title="Failed to load blocked sellers"
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
            emptyTitle="No blocked sellers"
            emptyDescription="This user has no blocked sellers."
          />
        )}
      </PageContainer>

      {canManageSellers && (
        <>
          <BlockSellerModal
            open={blockModalOpen}
            loading={actions.blocking}
            sellerOptions={sellerOptions}
            onClose={() => setBlockModalOpen(false)}
            onSubmit={({ sellerId, reason }) =>
              actions.blockSellerForUser(pancardNo, sellerId, reason)
            }
          />

          <UnblockDealerModal
            open={unblockModalOpen}
            panCardNo={unblockPan}
            loading={actions.unblocking}
            onClose={() => setUnblockModalOpen(false)}
            onSubmit={(reason) =>
              actions.unblockDealer(
                { sellerId: unblockSellerId },
                { panCardNo: unblockPan, reason }
              )
            }
          />
        </>
      )}
    </div>
  );
}
