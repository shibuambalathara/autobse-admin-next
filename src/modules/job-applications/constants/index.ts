import type { JobApplicationStatus } from "@/modules/job-applications/types";

export const JOB_APPLICATIONS_PAGE_SIZE = 10;

export const JOB_APPLICATION_STATUS_OPTIONS: {
  label: string;
  value: JobApplicationStatus;
}[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Reviewed", value: "REVIEWED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Accepted", value: "ACCEPTED" },
];

export function formatJobApplicationStatus(value?: string | null): string {
  if (!value) return "—";
  const match = JOB_APPLICATION_STATUS_OPTIONS.find(
    (option) => option.value === value
  );
  return match?.label ?? value;
}
