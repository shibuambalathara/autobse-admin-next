"use client";

import { Button, Select } from "@/components/ui";
import { FormField } from "@/components/forms";
import { JOB_APPLICATION_STATUS_OPTIONS } from "@/modules/job-applications/constants";
import type { JobApplicationStatus } from "@/modules/job-applications/types";

interface JobApplicationFilterFieldsProps {
  status: JobApplicationStatus | "";
  onStatusChange: (value: JobApplicationStatus | "") => void;
  onClear: () => void;
}

export function JobApplicationFilterFields({
  status,
  onStatusChange,
  onClear,
}: JobApplicationFilterFieldsProps) {
  return (
    <div className="mb-4 flex flex-wrap items-end gap-3">
      <FormField label="Status" htmlFor="job-application-status-filter">
        <Select
          id="job-application-status-filter"
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as JobApplicationStatus | "")
          }
          options={[
            { label: "All statuses", value: "" },
            ...JOB_APPLICATION_STATUS_OPTIONS,
          ]}
          className="min-w-[10rem]"
        />
      </FormField>

      <Button type="button" variant="outline" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}
