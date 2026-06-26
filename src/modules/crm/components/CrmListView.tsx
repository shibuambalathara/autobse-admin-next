"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileSpreadsheet, Plus, Upload } from "lucide-react";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { useAuth } from "@/auth/use-auth";
import { APP_ROLES } from "@/auth/roles";
import { ROUTES } from "@/constants/routes";
import { CrmPageToolbar } from "@/modules/crm/components/CrmPageToolbar";
import { CrmExcelModal } from "@/modules/crm/components/modals/CrmExcelModal";
import { useCrmActions } from "@/modules/crm/hooks/useCrmActions";
import { useCrmList } from "@/modules/crm/hooks/useCrmList";
import { createCrmTableColumns } from "@/modules/crm/tables/crm-table-columns";

export function CrmListView() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === APP_ROLES.ADMIN;
  const list = useCrmList();
  const actions = useCrmActions(() => list.refetch());
  const [excelModalOpen, setExcelModalOpen] = useState(false);

  const columns = useMemo(
    () =>
      createCrmTableColumns({
        stateNameById: list.filterOptions.stateNameById,
        onDelete: actions.deleteClient,
        onMoveToUser: actions.moveToUser,
        showAssignedStaff: !list.isStaff,
      }),
    [
      actions.deleteClient,
      actions.moveToUser,
      list.filterOptions.stateNameById,
      list.isStaff,
    ]
  );

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title="Buyer Leads — CRM"
        description="Manage buyer leads, follow-ups, and call logs."
        actions={
          <div className="hidden flex-wrap gap-2 lg:flex">
            {isAdmin && (
              <button
                type="button"
                className={buttonVariants({ size: "sm", variant: "outline" })}
                onClick={() => setExcelModalOpen(true)}
              >
                <FileSpreadsheet className="h-4 w-4 shrink-0" />
                CRM Excel Download
              </button>
            )}
            <Link
              href={ROUTES.crmUpload}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              <Upload className="h-4 w-4 shrink-0" />
              Excel Upload Buyer Leads
            </Link>
            <Link
              href={ROUTES.crmDeleted}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              Deleted Buyer Leads
            </Link>
            <Link href={ROUTES.crmAdd} className={buttonVariants({ size: "sm" })}>
              <Plus className="h-4 w-4 shrink-0" />
              Add Lead
            </Link>
          </div>
        }
      >
        <CrmPageToolbar
          filters={list.filters}
          setFilter={list.setFilter}
          stateOptions={list.filterOptions.stateOptions}
          locationOptions={list.filterOptions.locationOptions}
          vehicleCategoryOptions={list.filterOptions.vehicleCategoryOptions}
          staffOptions={list.filterOptions.staffOptions}
          locationsLoading={list.filterOptions.locationsLoading}
          showAssignedStaff={!list.isStaff}
          onClear={list.clearFilters}
        />

        {list.loading && list.clients.length === 0 ? (
          <LoadingState label="Loading buyer leads…" />
        ) : (
          <DataTable
            columns={columns}
            data={list.clients}
            variant="users"
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search by name or mobile…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No buyer leads"
            emptyDescription="Try adjusting your search or filters."
          />
        )}
      </PageContainer>

      <CrmExcelModal
        open={excelModalOpen}
        onClose={() => setExcelModalOpen(false)}
        onDownload={list.downloadExcel}
        loading={list.excelLoading}
        stateOptions={list.filterOptions.stateOptions}
        initialStateId={list.filters.stateId ?? ""}
      />
    </div>
  );
}
