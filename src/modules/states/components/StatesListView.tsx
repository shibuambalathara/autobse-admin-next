"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PERMISSIONS } from "@/auth/permissions";
import { useAccess } from "@/auth/use-access";
import { Button, PageContainer } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { AddStateModal } from "@/modules/states/components/modals/AddStateModal";
import { StatesPageToolbar } from "@/modules/states/components/StatesPageToolbar";
import { useStatesList } from "@/modules/states/hooks/useStatesList";
import { createStatesTableColumns } from "@/modules/states/tables/states-table-columns";

export function StatesListView() {
  const { can } = useAccess();
  const canManage = can(PERMISSIONS.STATES_MANAGE);

  const list = useStatesList();
  const [addModalOpen, setAddModalOpen] = useState(false);

  const columns = useMemo(() => createStatesTableColumns(), []);

  const showInitialLoading = list.loading && list.states.length === 0;

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title="States"
        description="Manage Indian states used across locations, users, and CRM."
        actions={
          canManage ? (
            <div className="hidden lg:flex">
              <Button size="sm" onClick={() => setAddModalOpen(true)}>
                <Plus className="h-4 w-4 shrink-0" />
                Add State
              </Button>
            </div>
          ) : undefined
        }
      >
        <StatesPageToolbar
          canManage={canManage}
          onAdd={() => setAddModalOpen(true)}
        />

        {showInitialLoading ? (
          <LoadingState label="Loading states…" />
        ) : list.error ? (
          <EmptyState
            title="Failed to load states"
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
            data={list.states}
            isLoading={list.loading}
            variant="users"
            tableMinWidth={500}
            searchPlaceholder="Search states…"
            emptyTitle="No states found"
            emptyDescription="Add a state to get started."
          />
        )}
      </PageContainer>

      <AddStateModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => list.refetch()}
      />
    </div>
  );
}
