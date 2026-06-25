"use client";

import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { PERMISSIONS } from "@/auth/permissions";
import { APP_ROLES, isRole } from "@/auth/roles";
import { AccessDenied } from "@/auth/access-denied";
import { useAccess } from "@/auth/use-access";
import { PageContainer } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { UPDATE_ENQUIRY_MUTATION } from "@/graphql/documents/enquiries";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { EnquiriesFilterFields } from "@/modules/enquiries/components/EnquiriesFilterFields";
import { EnquiryTextModal } from "@/modules/enquiries/components/modals/EnquiryTextModal";
import { useEnquiriesList } from "@/modules/enquiries/hooks/useEnquiriesList";
import { createEnquiriesTableColumns } from "@/modules/enquiries/tables/enquiries-table-columns";

export function EnquiriesListView() {
  const { can, role } = useAccess();
  const canManage = can(PERMISSIONS.ENQUIRIES_MANAGE);
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const list = useEnquiriesList();

  const [updateEnquiry] = useMutation(UPDATE_ENQUIRY_MUTATION);
  const [solvingId, setSolvingId] = useState<string | null>(null);
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [textModalTitle, setTextModalTitle] = useState("Details");
  const [textModalContent, setTextModalContent] = useState("");

  const openTextModal = useCallback((text: string, title: string) => {
    setTextModalTitle(title);
    setTextModalContent(text);
    setTextModalOpen(true);
  }, []);

  const handleMarkSolved = useCallback(
    async (enquiryId: string) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        icon: "question",
        text: "Change status to solved?",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      setSolvingId(enquiryId);
      try {
        await updateEnquiry({
          variables: {
            where: { id: enquiryId },
            updateEnquiryInput: { status: "solved" },
          },
        });
        await list.refetch();
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to update enquiry.";
        await Swal.fire({ icon: "error", title: "Failed", text: message });
      } finally {
        setSolvingId(null);
      }
    },
    [list, updateEnquiry]
  );

  const columns = useMemo(
    () =>
      createEnquiriesTableColumns({
        canManage,
        onViewText: openTextModal,
        onMarkSolved: handleMarkSolved,
        solvingId,
      }),
    [canManage, handleMarkSolved, openTextModal, solvingId]
  );

  const showInitialLoading =
    !list.canFetch || (list.loading && list.enquiries.length === 0);
  const hasFilters = Boolean(
    list.statusFilter || list.stateFilter || list.searchQuery
  );

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Admin access required"
        description="Only administrators can view and manage enquiries."
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title="Enquiries"
        description="Review contact form submissions and mark enquiries as solved."
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <EnquiriesFilterFields
            statusFilter={list.statusFilter}
            stateFilter={list.stateFilter}
            onStatusChange={list.setStatusFilter}
            onStateChange={list.setStateFilter}
          />
          {hasFilters ? (
            <button
              type="button"
              className="text-sm text-brand-600 hover:text-brand-900"
              onClick={list.clearFilters}
            >
              Clear filters
            </button>
          ) : null}
        </div>

        {showInitialLoading ? (
          <LoadingState label="Loading enquiries…" />
        ) : list.error ? (
          <EmptyState
            title="Failed to load enquiries"
            description={
              extractGraphqlError(list.error).message === "Unauthorized"
                ? "Your session may have expired. Try refreshing the page or signing in again as an admin user."
                : extractGraphqlError(list.error).message
            }
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
            data={list.enquiries}
            isLoading={list.loading}
            variant="users"
            tableMinWidth={1200}
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search enquiries…"
            pagination={
              list.isSearching
                ? undefined
                : {
                    page: list.page,
                    pageSize: list.pageSize,
                    total: list.total,
                  }
            }
            onPageChange={list.setPage}
            emptyTitle="No enquiries found"
            emptyDescription="Try adjusting your search or filters."
          />
        )}
      </PageContainer>

      <EnquiryTextModal
        open={textModalOpen}
        title={textModalTitle}
        text={textModalContent}
        onClose={() => setTextModalOpen(false)}
      />
    </div>
  );
}
