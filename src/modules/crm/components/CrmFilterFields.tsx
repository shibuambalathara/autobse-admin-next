"use client";

import { FormField } from "@/components/forms";
import { Select } from "@/components/ui";
import {
  BUYER_PREFERENCE_OPTIONS,
  POTENTIAL_CLIENT_STATUS_OPTIONS,
} from "@/modules/crm/constants";
import type { CrmFilterOption, CrmPageFilters } from "@/modules/crm/types";
import { cn } from "@/lib/utils";

export interface CrmFilterFieldsProps {
  filters: CrmPageFilters;
  setFilter: (name: keyof CrmPageFilters, value: string) => void;
  stateOptions: CrmFilterOption[];
  locationOptions: CrmFilterOption[];
  vehicleCategoryOptions: CrmFilterOption[];
  staffOptions: CrmFilterOption[];
  locationsLoading?: boolean;
  layout?: "grid" | "stack";
}

export function CrmFilterFields({
  filters,
  setFilter,
  stateOptions,
  locationOptions,
  vehicleCategoryOptions,
  staffOptions,
  locationsLoading,
  layout = "grid",
}: CrmFilterFieldsProps) {
  const isStacked = layout === "stack";

  return (
    <div className={cn(isStacked ? "flex flex-col gap-4" : "contents")}>
      <FormField label="State" htmlFor="crm-filter-state">
        <Select
          id="crm-filter-state"
          placeholder="All states"
          options={stateOptions}
          value={filters.stateId ?? ""}
          onChange={(e) => setFilter("stateId", e.target.value)}
        />
      </FormField>

      <FormField label="Location" htmlFor="crm-filter-location">
        <Select
          id="crm-filter-location"
          placeholder={filters.stateId ? "All locations" : "Select state first"}
          options={locationOptions}
          value={filters.locationId ?? ""}
          disabled={!filters.stateId || locationsLoading}
          onChange={(e) => setFilter("locationId", e.target.value)}
        />
      </FormField>

      <FormField label="Status" htmlFor="crm-filter-status">
        <Select
          id="crm-filter-status"
          placeholder="All statuses"
          options={[...POTENTIAL_CLIENT_STATUS_OPTIONS]}
          value={filters.status ?? ""}
          onChange={(e) => setFilter("status", e.target.value)}
        />
      </FormField>

      <FormField label="Buyer Preference" htmlFor="crm-filter-buyer-preference">
        <Select
          id="crm-filter-buyer-preference"
          placeholder="All preferences"
          options={[...BUYER_PREFERENCE_OPTIONS]}
          value={filters.buyerPreference ?? ""}
          onChange={(e) => setFilter("buyerPreference", e.target.value)}
        />
      </FormField>

      <FormField label="Vehicle Category" htmlFor="crm-filter-vehicle-category">
        <Select
          id="crm-filter-vehicle-category"
          placeholder="All categories"
          options={vehicleCategoryOptions}
          value={filters.vehicleCategoryId ?? ""}
          onChange={(e) => setFilter("vehicleCategoryId", e.target.value)}
        />
      </FormField>

      <FormField label="Assigned Staff" htmlFor="crm-filter-staff">
        <Select
          id="crm-filter-staff"
          placeholder="All staff"
          options={staffOptions}
          value={filters.assignedStaffId ?? ""}
          onChange={(e) => setFilter("assignedStaffId", e.target.value)}
        />
      </FormField>

      <FormField label="Next Follow Up" htmlFor="crm-filter-next-follow-up">
        <input
          id="crm-filter-next-follow-up"
          type="date"
          className="h-10 w-full rounded-md border border-surface-border px-3 text-sm"
          value={filters.nextFollowUpAt ?? ""}
          onChange={(e) => setFilter("nextFollowUpAt", e.target.value)}
        />
      </FormField>
    </div>
  );
}
