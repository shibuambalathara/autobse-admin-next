import type {
  BuyerPreference,
  CallStatus,
  PotentialClientStatus,
} from "@/modules/crm/constants";
import {
  BUYER_PREFERENCE_OPTIONS,
  CALL_STATUS_OPTIONS,
  POTENTIAL_CLIENT_STATUS_OPTIONS,
} from "@/modules/crm/constants";

export function getPotentialClientStatusLabel(status?: string | null): string {
  if (!status) return "—";
  return (
    POTENTIAL_CLIENT_STATUS_OPTIONS.find((option) => option.value === status)
      ?.label ?? status
  );
}

export function getBuyerPreferenceLabel(value?: string | null): string {
  if (!value) return "—";
  return (
    BUYER_PREFERENCE_OPTIONS.find((option) => option.value === value)?.label ??
    value
  );
}

export function getCallStatusLabel(status?: string | null): string {
  if (!status) return "—";
  return (
    CALL_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    status
  );
}

export function formatCallDuration(seconds?: number | null): string {
  if (seconds == null) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getMinDateTimeLocalForToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function isFollowUpDateNotInPast(value: string): boolean {
  if (!value) return true;
  return new Date(value).getTime() >= Date.now();
}

export type {
  BuyerPreference,
  CallStatus,
  PotentialClientStatus,
};
