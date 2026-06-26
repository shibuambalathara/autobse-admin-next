import type { NotificationType } from "@/modules/notifications/types";

export const NOTIFICATIONS_PAGE_SIZE = 10;

export const NOTIFICATION_TYPE_OPTIONS: {
  label: string;
  value: NotificationType;
}[] = [
  { label: "Bid", value: "BID" },
  { label: "Event", value: "EVENT" },
  { label: "General", value: "GENERAL" },
  { label: "Payment", value: "PAYMENT" },
  { label: "System", value: "SYSTEM" },
  { label: "Watchlist", value: "WATCHLIST" },
];

export const NOTIFICATION_READ_OPTIONS = [
  { label: "Read", value: "true" },
  { label: "Unread", value: "false" },
] as const;

export function formatNotificationType(value?: string | null): string {
  if (!value) return "—";
  const match = NOTIFICATION_TYPE_OPTIONS.find((option) => option.value === value);
  return match?.label ?? value;
}

export function formatReadStatus(isRead?: boolean | null): string {
  if (isRead == null) return "—";
  return isRead ? "Read" : "Unread";
}
