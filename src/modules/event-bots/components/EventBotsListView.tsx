"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Plus } from "lucide-react";
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
import { useEventBotsList } from "@/modules/event-bots/hooks/useEventBotsList";
import { createEventBotsTableColumns } from "@/modules/event-bots/tables/event-bots-table-columns";

export function EventBotsListView() {
  const list = useEventBotsList();
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

  const deletedHref = list.sellerId
    ? `${ROUTES.eventBotsDeleted}?sellerId=${list.sellerId}`
    : ROUTES.eventBotsDeleted;

  const columns = useMemo(
    () => createEventBotsTableColumns({ onDelete: actions.deleteEventBot }),
    [actions.deleteEventBot]
  );

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title="EventBots"
        description="Manage auto-generated event bots and vehicle uploads."
        actions={
          <div className="hidden flex-wrap gap-2 lg:flex">
            <Link
              href={deletedHref}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              Deleted EventBots
            </Link>
            <Link href={ROUTES.eventBotsAdd} className={buttonVariants({ size: "sm" })}>
              <Plus className="h-4 w-4 shrink-0" />
              EventBot
            </Link>
          </div>
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
          deletedHref={deletedHref}
          onClear={list.clearFilters}
        />

        {list.loading && displayRows.length === 0 ? (
          <LoadingState label="Loading EventBots…" />
        ) : (
          <DataTable
            columns={columns}
            data={displayRows}
            variant="users"
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search auto events…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No EventBots"
            emptyDescription="Try adjusting your search or filters."
          />
        )}
      </PageContainer>
    </div>
  );
}
