"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { EventBotsPageToolbar } from "@/modules/event-bots/components/EventBotsPageToolbar";
import {
  useEventBotActions,
  useEventBotDisplayRows,
  useEventBotSellerMap,
} from "@/modules/event-bots/hooks/useEventBotActions";
import { useDeletedEventBotsList } from "@/modules/event-bots/hooks/useDeletedEventBotsList";
import { createDeletedEventBotsTableColumns } from "@/modules/event-bots/tables/deleted-event-bots-table-columns";

interface DeletedEventBotsViewProps {
  initialSellerId?: string;
}

export function DeletedEventBotsView({
  initialSellerId,
}: DeletedEventBotsViewProps) {
  const list = useDeletedEventBotsList({ initialSellerId });
  const actions = useEventBotActions(() => list.refetch());
  const sellerMap = useEventBotSellerMap(list.sellers);
  const displayRows = useEventBotDisplayRows(list.eventBots, sellerMap);

  const sellerOptions = useMemo(
    () =>
      list.sellers.map((seller) => ({
        value: seller.id,
        label: seller.name ?? seller.id,
      })),
    [list.sellers]
  );

  const columns = useMemo(
    () =>
      createDeletedEventBotsTableColumns({
        onRestore: actions.restoreEventBot,
        onPermanentDelete: actions.permanentlyDeleteEventBot,
      }),
    [actions.permanentlyDeleteEventBot, actions.restoreEventBot]
  );

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title="Deleted EventBots"
        description="Restore or permanently delete soft-deleted EventBots."
        actions={
          <Link
            href={ROUTES.eventBots}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to EventBots
          </Link>
        }
      >
        <EventBotsPageToolbar
          sellerId={list.sellerId}
          setSellerId={list.setSellerId}
          eventCategory={list.eventCategory}
          setEventCategory={list.setEventCategory}
          startDate={list.startDate}
          setStartDate={list.setStartDate}
          sellerOptions={sellerOptions}
          onClear={list.clearFilters}
          showListActions={false}
        />

        {list.loading && displayRows.length === 0 ? (
          <LoadingState label="Loading deleted EventBots…" />
        ) : (
          <DataTable
            columns={columns}
            data={displayRows}
            variant="users"
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search by seller name…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No deleted EventBots"
            emptyDescription="Try adjusting your search or filters."
          />
        )}
      </PageContainer>
    </div>
  );
}
