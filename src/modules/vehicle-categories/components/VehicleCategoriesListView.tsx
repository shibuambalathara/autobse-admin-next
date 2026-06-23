"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PERMISSIONS } from "@/auth/permissions";
import { useAccess } from "@/auth/use-access";
import { Button, PageContainer } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { AddVehicleCategoryModal } from "@/modules/vehicle-categories/components/modals/AddVehicleCategoryModal";
import { EditVehicleCategoryModal } from "@/modules/vehicle-categories/components/modals/EditVehicleCategoryModal";
import { VehicleCategoriesPageToolbar } from "@/modules/vehicle-categories/components/VehicleCategoriesPageToolbar";
import { useVehicleCategoriesList } from "@/modules/vehicle-categories/hooks/useVehicleCategoriesList";
import { createVehicleCategoriesTableColumns } from "@/modules/vehicle-categories/tables/vehicle-categories-table-columns";
import type { VehicleCategory } from "@/modules/vehicle-categories/types";

export function VehicleCategoriesListView() {
  const { can } = useAccess();
  const canManage = can(PERMISSIONS.EVENTS_TYPES_MANAGE);

  const list = useVehicleCategoriesList();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<VehicleCategory | null>(null);

  const columns = useMemo(
    () =>
      createVehicleCategoriesTableColumns({
        canManage,
        onEdit: (category) => {
          setSelectedCategory(category);
          setEditModalOpen(true);
        },
      }),
    [canManage]
  );

  const showInitialLoading = list.loading && list.categories.length === 0;

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title="Vehicle Category"
        description="Manage vehicle categories used across events, calendars, and CRM."
        actions={
          canManage ? (
            <div className="hidden lg:flex">
              <Button size="sm" onClick={() => setAddModalOpen(true)}>
                <Plus className="h-4 w-4 shrink-0" />
                Add Category
              </Button>
            </div>
          ) : undefined
        }
      >
        <VehicleCategoriesPageToolbar
          canManage={canManage}
          onAdd={() => setAddModalOpen(true)}
        />

        {showInitialLoading ? (
          <LoadingState label="Loading vehicle categories…" />
        ) : list.error ? (
          <EmptyState
            title="Failed to load vehicle categories"
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
            data={list.categories}
            isLoading={list.loading}
            variant="users"
            tableMinWidth={600}
            searchPlaceholder="Search categories…"
            emptyTitle="No vehicle categories found"
            emptyDescription="Add a category to get started."
          />
        )}
      </PageContainer>

      <AddVehicleCategoryModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => list.refetch()}
      />

      <EditVehicleCategoryModal
        open={editModalOpen}
        category={selectedCategory}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedCategory(null);
        }}
        onSuccess={() => list.refetch()}
      />
    </div>
  );
}
