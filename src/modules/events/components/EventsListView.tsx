"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { Archive, Plus } from "lucide-react";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { PERMISSIONS } from "@/auth/permissions";
import { useAccess } from "@/auth/use-access";
import { ROUTES } from "@/constants/routes";
import { LocationModal } from "@/modules/events/components/modals/LocationModal";
import { PptDownloadModal } from "@/modules/events/components/modals/PptDownloadModal";
import { PptLinkModal } from "@/modules/events/components/modals/PptLinkModal";
import { EventsPageToolbar } from "@/modules/events/components/EventsPageToolbar";
import { useEventFilterOptions } from "@/modules/events/hooks/useEventFilterOptions";
import { useEventRowActions } from "@/modules/events/hooks/useEventRowActions";
import { useEventsList } from "@/modules/events/hooks/useEventsList";
import { createEventsTableColumns } from "@/modules/events/tables/events-table-columns";
import { getEventPptUrl } from "@/modules/events/utils/event-ppt";
import Swal from "sweetalert2";

export function EventsListView() {
  const { can } = useAccess();
  const canManageEvents = can(PERMISSIONS.EVENTS_MANAGE);
  const canManageVehicles = can(PERMISSIONS.VEHICLES_MANAGE);
  const list = useEventsList();
  const filterOptions = useEventFilterOptions();
  const rowActions = useEventRowActions(() => list.refetch());

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [pptDownloadOpen, setPptDownloadOpen] = useState(false);
  const [pptLinkOpen, setPptLinkOpen] = useState(false);
  const [includeVahan, setIncludeVahan] = useState<boolean | null>(null);
  const [pptLoading, setPptLoading] = useState(false);
  const [pptUrl, setPptUrl] = useState("");
  const [pptCopied, setPptCopied] = useState(false);

  const resetPptState = useCallback(() => {
    setIncludeVahan(null);
    setPptUrl("");
    setPptCopied(false);
    setPptLoading(false);
  }, []);

  const handleOpenPptDownload = useCallback(
    (eventId: string) => {
      setSelectedEventId(eventId);
      resetPptState();
      setPptDownloadOpen(true);
    },
    [resetPptState]
  );

  const handleOpenPptLink = useCallback(
    (eventId: string) => {
      setSelectedEventId(eventId);
      resetPptState();
      setPptLinkOpen(true);
    },
    [resetPptState]
  );

  const handleViewLocation = useCallback((location: string) => {
    setSelectedLocation(location);
    setLocationModalOpen(true);
  }, []);

  const handlePptVahanSelection = useCallback(
    async (value: boolean, mode: "download" | "link") => {
      if (!selectedEventId) return;

      setIncludeVahan(value);
      setPptLoading(true);
      try {
        const url = await getEventPptUrl(selectedEventId, value);
        setPptUrl(url);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to generate PPT";
        await Swal.fire({
          icon: "error",
          title: "Failed",
          text: mode === "download" ? "Failed to prepare PPT download" : message,
        });
        if (mode === "download") {
          setPptDownloadOpen(false);
        } else {
          setPptLinkOpen(false);
        }
        resetPptState();
      } finally {
        setPptLoading(false);
      }
    },
    [resetPptState, selectedEventId]
  );

  const columns = useMemo(
    () =>
      createEventsTableColumns({
        onArchive: rowActions.handleArchive,
        onDownloadAcr: rowActions.handleDownloadAcr,
        onWhatsApp: rowActions.handleWhatsApp,
        onOpenPptDownload: handleOpenPptDownload,
        onOpenPptLink: handleOpenPptLink,
        onViewLocation: handleViewLocation,
        acrLoadingEventId: rowActions.acrLoadingEventId,
        whatsappLoading: rowActions.whatsappLoading,
        canManageEvents,
        canManageVehicles,
      }),
    [
      canManageEvents,
      canManageVehicles,
      handleOpenPptDownload,
      handleOpenPptLink,
      handleViewLocation,
      rowActions,
    ]
  );

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title="Events"
        description="Manage auction events and schedules."
        actions={
          <div className="hidden flex-wrap gap-2 lg:flex">
            <Link
              href={ROUTES.archiveEvents}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              <Archive className="h-4 w-4 shrink-0" />
              Archived events
            </Link>
            {canManageEvents && (
              <Link
                href={ROUTES.eventsAdd}
                className={buttonVariants({ size: "sm" })}
              >
                <Plus className="h-4 w-4 shrink-0" />
                Add Event
              </Link>
            )}
          </div>
        }
      >
        <EventsPageToolbar
          startDate={list.startDate}
          setStartDate={list.setStartDate}
          eventCategory={list.eventCategory}
          setEventCategory={list.setEventCategory}
          status={list.status}
          setStatus={list.setStatus}
          locationId={list.locationId}
          setLocationId={list.setLocationId}
          sellerId={list.sellerId}
          setSellerId={list.setSellerId}
          vehicleCategoryId={list.vehicleCategoryId}
          setVehicleCategoryId={list.setVehicleCategoryId}
          locationOptions={filterOptions.locationOptions}
          sellerOptions={filterOptions.sellerOptions}
          vehicleCategoryOptions={filterOptions.vehicleCategoryOptions}
          showAddEvent={canManageEvents}
          onClear={list.clearFilters}
        />

        {list.loading && list.events.length === 0 ? (
          <LoadingState label="Loading events…" />
        ) : (
          <DataTable
            columns={columns}
            data={list.events}
            tableMinWidth={3600}
            variant="users"
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search by location or seller name…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No events found"
            emptyDescription="Try adjusting your search or filters."
          />
        )}
      </PageContainer>

      <LocationModal
        open={locationModalOpen}
        location={selectedLocation}
        onClose={() => setLocationModalOpen(false)}
      />

      <PptDownloadModal
        open={pptDownloadOpen}
        includeVahan={includeVahan}
        loading={pptLoading}
        pptUrl={pptUrl}
        onSelectVahan={(value) => handlePptVahanSelection(value, "download")}
        onClose={() => {
          setPptDownloadOpen(false);
          resetPptState();
        }}
      />

      <PptLinkModal
        open={pptLinkOpen}
        includeVahan={includeVahan}
        loading={pptLoading}
        pptUrl={pptUrl}
        copied={pptCopied}
        onSelectVahan={(value) => handlePptVahanSelection(value, "link")}
        onCopy={() => {
          if (!pptUrl) return;
          navigator.clipboard.writeText(pptUrl);
          setPptCopied(true);
          setTimeout(() => setPptCopied(false), 2000);
        }}
        onClose={() => {
          setPptLinkOpen(false);
          resetPptState();
        }}
      />
    </div>
  );
}
