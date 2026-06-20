"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileSpreadsheet, Plus, Trash2 } from "lucide-react";
import { APP_ROLES } from "@/auth/roles";
import { Button, PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { createUsersTableColumns } from "@/modules/users/tables/users-table-columns";
import { useUsersList } from "@/modules/users/hooks/useUsersList";
import {
  mapUsersForDisplay,
  useUserRowActions,
} from "@/modules/users/hooks/useUserRowActions";
import { UsersExcelModal } from "@/modules/users/components/modals/UsersExcelModal";
import { EmdExcelModal } from "@/modules/users/components/modals/EmdExcelModal";
import { DeleteUsersByDateModal } from "@/modules/users/components/modals/DeleteUsersByDateModal";
import { UsersPageToolbar } from "@/modules/users/components/UsersPageToolbar";
import { useAuth } from "@/auth/use-auth";

export function UsersListView() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === APP_ROLES.ADMIN;

  const list = useUsersList();
  const rowActions = useUserRowActions(() => list.refetch());

  const [excelOpen, setExcelOpen] = useState(false);
  const [emdOpen, setEmdOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const displayUsers = useMemo(
    () => mapUsersForDisplay(list.users),
    [list.users]
  );

  const columns = useMemo(
    () =>
      createUsersTableColumns({
        onDelete: rowActions.handleDelete,
        onMoveToCrm: rowActions.handleMoveToCrm,
        onSendExpiryWhatsapp: rowActions.handleSendExpiryWhatsapp,
        loadingUserId: rowActions.loadingUserId,
      }),
    [rowActions]
  );

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
    <PageContainer
      title="Users"
      description="Manage dealers, staff, and admin accounts."
      actions={
        <div className="hidden flex-wrap gap-2 lg:flex">
          {isAdmin && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setExcelOpen(true)}
              >
                <FileSpreadsheet className="h-4 w-4 shrink-0" />
                Download Excel
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEmdOpen(true)}
              >
                <FileSpreadsheet className="h-4 w-4 shrink-0" />
                EMD Approved Excel
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDeleteModalOpen(true)}
          >
            <Trash2 className="h-4 w-4 shrink-0" />
            Delete by Date
          </Button>
          <Link
            href={ROUTES.usersDeleted}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Deleted Users
          </Link>
          <Link href={ROUTES.usersAdd} className={buttonVariants({ size: "sm" })}>
            <Plus className="h-4 w-4 shrink-0" />
            Add User
          </Link>
        </div>
      }
    >
      <UsersPageToolbar
        isAdmin={isAdmin}
        registrationExpiryDate={list.registrationExpiryDate}
        setRegistrationExpiryDate={list.setRegistrationExpiryDate}
        state={list.state}
        setState={list.setState}
        role={list.role}
        setRole={list.setRole}
        status={list.status}
        setStatus={list.setStatus}
        onClear={list.clearFilters}
        onDownloadExcel={() => setExcelOpen(true)}
        onEmdExcel={() => setEmdOpen(true)}
        onDeleteByDate={() => setDeleteModalOpen(true)}
      />

      {list.loading && displayUsers.length === 0 ? (
        <LoadingState label="Loading users…" />
      ) : (
        <DataTable
          columns={columns}
          data={displayUsers}
          tableMinWidth={1200}
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
          emptyTitle="No users found"
          emptyDescription="Try adjusting your search or filters."
        />
      )}

      <UsersExcelModal
        open={excelOpen}
        onClose={() => setExcelOpen(false)}
        loading={list.excelLoading}
        onDownload={list.downloadUsersExcel}
        getFilteredCount={list.getFilteredCount}
        filterSummary={{
          search: list.searchQuery,
          state: list.state,
          role: list.role,
          status: list.status,
          registrationExpiryDate: list.registrationExpiryDate,
        }}
      />

      <EmdExcelModal
        open={emdOpen}
        onClose={() => setEmdOpen(false)}
        loading={list.emdExcelLoading}
        initialState={list.state}
        onDownload={list.downloadEmdExcel}
        getCount={list.getEmdApprovedCount}
      />

      <DeleteUsersByDateModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        loading={list.deletingByDate}
        onConfirm={list.deleteByDateRange}
      />
    </PageContainer>
    </div>
  );
}
