"use client";

import { FormField } from "@/components/forms";
import { Select } from "@/components/ui";
import { ENQUIRY_STATUS_OPTIONS } from "@/modules/enquiries/constants";
import type { EnquiryStatus } from "@/modules/enquiries/types";
import { INDIAN_STATES } from "@/modules/users/constants";
import { formatStateDisplay } from "@/modules/users/utils";
import { cn } from "@/lib/utils";

interface EnquiriesFilterFieldsProps {
  statusFilter: EnquiryStatus | "";
  stateFilter: string;
  onStatusChange: (value: EnquiryStatus | "") => void;
  onStateChange: (value: string) => void;
  layout?: "inline" | "stack";
}

const stateOptions = INDIAN_STATES.map((state) => ({
  value: state.value,
  label: formatStateDisplay(state.label),
}));

export function EnquiriesFilterFields({
  statusFilter,
  stateFilter,
  onStatusChange,
  onStateChange,
  layout = "inline",
}: EnquiriesFilterFieldsProps) {
  const gridClass =
    layout === "stack"
      ? "grid grid-cols-1 gap-4"
      : "grid grid-cols-1 gap-4 sm:grid-cols-2";

  return (
    <div className={cn(gridClass)}>
      <FormField label="Status" htmlFor="enquiries-status-filter">
        <Select
          id="enquiries-status-filter"
          placeholder="All statuses"
          options={ENQUIRY_STATUS_OPTIONS}
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as EnquiryStatus | "")}
        />
      </FormField>

      <FormField label="State" htmlFor="enquiries-state-filter">
        <Select
          id="enquiries-state-filter"
          placeholder="All states"
          options={stateOptions}
          value={stateFilter}
          onChange={(e) => onStateChange(e.target.value)}
        />
      </FormField>
    </div>
  );
}
