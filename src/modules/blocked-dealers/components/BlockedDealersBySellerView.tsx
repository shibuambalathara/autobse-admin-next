"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Button, PageContainer } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { SELLER_DETAIL_QUERY } from "@/graphql/documents/sellers";
import { extractGraphqlError } from "@/lib/graphql-errors";
import {
  BlockDealerModal,
  UnblockDealerModal,
} from "@/modules/blocked-dealers/components/modals/BlockedDealerModals";
import { useBlockedDealerActions } from "@/modules/blocked-dealers/hooks/useBlockedDealerActions";
import { useBlockedDealersList } from "@/modules/blocked-dealers/hooks/useBlockedDealersList";
import { createBlockedDealersTableColumns } from "@/modules/blocked-dealers/tables/blocked-dealers-table-columns";
import type { SellerDetailResult } from "@/modules/sellers/types";

interface BlockedDealersBySellerViewProps {
  sellerId: string;
  sellerName?: string;
}

export function BlockedDealersBySellerView({
  sellerId,
  sellerName,
}: BlockedDealersBySellerViewProps) {
  const list = useBlockedDealersList({ sellerId });
  const actions = useBlockedDealerActions(() => list.refetch());

  const { data: sellerData } = useQuery<SellerDetailResult>(SELLER_DETAIL_QUERY, {
    variables: { where: { id: sellerId } },
    skip: !sellerId || Boolean(sellerName),
    fetchPolicy: "cache-first",
  });

  const resolvedSellerName =
    sellerName || sellerData?.seller?.name || "Unknown Seller";

  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [unblockModalOpen, setUnblockModalOpen] = useState(false);
  const [unblockPan, setUnblockPan] = useState("");

  const columns = useMemo(
    () =>
      createBlockedDealersTableColumns({
        canManage: true,
        onUnblock: ({ pan }) => {
          setUnblockPan(pan);
          setUnblockModalOpen(true);
        },
        unblocking: actions.unblocking,
      }),
    [actions.unblocking]
  );

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title={`Blocked Dealers — ${resolvedSellerName}`}
        description="Block or unblock dealers for this seller."
        actions={
          <div className="hidden lg:flex">
            <Button size="sm" onClick={() => setBlockModalOpen(true)}>
              + Block Dealer
            </Button>
          </div>
        }
      >
        <div className="mb-4 lg:hidden">
          <Button className="w-full" onClick={() => setBlockModalOpen(true)}>
            + Block Dealer
          </Button>
        </div>

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
            tableMinWidth={900}
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search by PAN or reason…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No blocked dealers"
            emptyDescription="No dealers are blocked for this seller."
          />
        )}
      </PageContainer>

      <BlockDealerModal
        open={blockModalOpen}
        loading={actions.blocking}
        onClose={() => setBlockModalOpen(false)}
        onSubmit={(values) =>
          actions.blockDealer({ sellerId }, values)
        }
      />

      <UnblockDealerModal
        open={unblockModalOpen}
        panCardNo={unblockPan}
        loading={actions.unblocking}
        onClose={() => setUnblockModalOpen(false)}
        onSubmit={(reason) =>
          actions.unblockDealer(
            { sellerId },
            { panCardNo: unblockPan, reason }
          )
        }
      />
    </div>
  );
}
