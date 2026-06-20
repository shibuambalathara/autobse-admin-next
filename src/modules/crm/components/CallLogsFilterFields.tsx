"use client";

import { FormField } from "@/components/forms";
import { Select } from "@/components/ui";
import { CALL_STATUS_OPTIONS } from "@/modules/crm/constants";
import type { CallLogPageFilters, CrmFilterOption } from "@/modules/crm/types";
import { cn } from "@/lib/utils";

export interface CallLogsFilterFieldsProps {
  filters: CallLogPageFilters;
  setFilter: (name: keyof CallLogPageFilters, value: string) => void;
  staffOptions: CrmFilterOption[];
  layout?: "grid" | "stack";
  showNextFollowUp?: boolean;
}

export function CallLogsFilterFields({
  filters,
  setFilter,
  staffOptions,
  layout = "grid",
  showNextFollowUp = true,
}: CallLogsFilterFieldsProps) {
  const isStacked = layout === "stack";

  return (
    <div className={cn(isStacked ? "flex flex-col gap-4" : "contents")}>
      <FormField label="Call Status" htmlFor="call-log-filter-status">
        <Select
          id="call-log-filter-status"
          placeholder="All statuses"
          options={[...CALL_STATUS_OPTIONS]}
          value={filters.callStatus ?? ""}
          onChange={(e) => setFilter("callStatus", e.target.value)}
        />
      </FormField>

      <FormField label="Staff" htmlFor="call-log-filter-staff">
        <Select
          id="call-log-filter-staff"
          placeholder="All staff"
          options={staffOptions}
          value={filters.staffId ?? ""}
          onChange={(e) => setFilter("staffId", e.target.value)}
        />
      </FormField>

      {showNextFollowUp && (
        <FormField label="Next Follow Up" htmlFor="call-log-filter-next-follow-up">
          <input
            id="call-log-filter-next-follow-up"
            type="date"
            className="h-10 w-full rounded-md border border-surface-border px-3 text-sm"
            value={filters.nextFollowUpAt ?? ""}
            onChange={(e) => setFilter("nextFollowUpAt", e.target.value)}
          />
        </FormField>
      )}
    </div>
  );
}
