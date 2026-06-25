"use client";

import { Button, Select } from "@/components/ui";
import { FormField } from "@/components/forms";
import { SCHEDULE_CALL_STATUS_OPTIONS } from "@/modules/schedule-calls/constants";
import type { CallScheduleStatus } from "@/modules/schedule-calls/types";
import { INDIAN_STATES } from "@/modules/users/constants";
import { formatStateDisplay } from "@/modules/users/utils";

const stateOptions = INDIAN_STATES.map((item) => ({
  value: item.value,
  label: formatStateDisplay(item.label),
}));

interface ScheduleCallFilterFieldsProps {
  status: CallScheduleStatus;
  state: string;
  onStatusChange: (value: CallScheduleStatus) => void;
  onStateChange: (value: string) => void;
  onClear: () => void;
}

export function ScheduleCallFilterFields({
  status,
  state,
  onStatusChange,
  onStateChange,
  onClear,
}: ScheduleCallFilterFieldsProps) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <FormField label="Status" htmlFor="schedule-call-status-filter">
        <Select
          id="schedule-call-status-filter"
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as CallScheduleStatus)
          }
          options={SCHEDULE_CALL_STATUS_OPTIONS}
        />
      </FormField>

      <FormField label="State" htmlFor="schedule-call-state-filter">
        <Select
          id="schedule-call-state-filter"
          value={state}
          onChange={(event) => onStateChange(event.target.value)}
          options={[{ label: "All states", value: "" }, ...stateOptions]}
        />
      </FormField>

      <div className="flex items-end">
        <Button type="button" variant="outline" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
