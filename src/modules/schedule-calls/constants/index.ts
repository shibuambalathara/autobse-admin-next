import type { CallScheduleStatus } from "@/modules/schedule-calls/types";

export const SCHEDULE_CALLS_PAGE_SIZE = 10;

export const DEFAULT_SCHEDULE_CALL_STATUS: CallScheduleStatus = "PENDING";

export const SCHEDULE_CALL_STATUS_OPTIONS: {
  label: string;
  value: CallScheduleStatus;
}[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Closed", value: "CLOSED" },
];

export function formatScheduleCallStatus(value?: string | null): string {
  if (!value) return "—";
  const match = SCHEDULE_CALL_STATUS_OPTIONS.find(
    (option) => option.value === value
  );
  return match?.label ?? value;
}

export function truncateMessage(message?: string | null, limit = 40): string {
  if (!message) return "—";
  if (message.length <= limit) return message;
  return `${message.slice(0, limit)}…`;
}
