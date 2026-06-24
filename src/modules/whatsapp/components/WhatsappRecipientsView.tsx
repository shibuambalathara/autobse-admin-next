"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { ArrowLeft } from "lucide-react";
import { Button, PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { DELETE_WHATSAPP_MUTATION } from "@/graphql/documents/whatsapp";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { WhatsappFilterFields } from "@/modules/whatsapp/components/WhatsappFilterFields";
import { useWhatsappRecipientsList } from "@/modules/whatsapp/hooks/useWhatsappRecipientsList";
import { createWhatsappRecipientsTableColumns } from "@/modules/whatsapp/tables/whatsapp-table-columns";
import type { WhatsappRecipient } from "@/modules/whatsapp/types";

export function WhatsappRecipientsView() {
  const list = useWhatsappRecipientsList();
  const [deleteWhatsapp] = useMutation(DELETE_WHATSAPP_MUTATION);

  const handleDelete = async (recipient: WhatsappRecipient) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this record?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Delete Record",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteWhatsapp({ variables: { where: { id: recipient.id } } });
      await list.refetch();
      await Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  const columns = useMemo(
    () => createWhatsappRecipientsTableColumns({ onDelete: handleDelete }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list.refetch]
  );

  const showInitialLoading = list.loading && list.recipients.length === 0;

  return (
    <PageContainer
      title="Recipients"
      description="View WhatsApp message recipients and delivery status."
      actions={
        <div className="flex flex-wrap gap-2">
          <Link
            href={ROUTES.whatsapp}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Upload
          </Link>
          <Link
            href={ROUTES.whatsappDeleted}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Deleted Records
          </Link>
        </div>
      }
    >
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <WhatsappFilterFields
          template={list.template}
          status={list.status}
          eventNo={list.eventNo}
          eventOptions={list.eventOptions}
          onTemplateChange={list.setTemplate}
          onStatusChange={list.setStatus}
          onEventNoChange={list.setEventNo}
        />
        <div className="flex items-end">
          <Button size="sm" variant="ghost" onClick={list.clearFilters}>
            Clear filters
          </Button>
        </div>
      </div>

      {showInitialLoading ? (
        <LoadingState label="Loading recipients…" />
      ) : list.recipients.length === 0 ? (
        <EmptyState
          title="No recipients found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <DataTable
          columns={columns}
          data={list.recipients}
          isLoading={list.loading}
          variant="users"
          tableMinWidth={1200}
          searchValue={list.searchInput}
          onSearchChange={list.setSearchInput}
          searchPlaceholder="Search by first name or mobile…"
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
          emptyTitle="No recipients found"
          emptyDescription="Try adjusting your search or filters."
        />
      )}
    </PageContainer>
  );
}
