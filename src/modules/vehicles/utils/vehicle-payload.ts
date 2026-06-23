import type { CreateVehicleInput } from "@/modules/vehicles/types";

/** Strip empty string values before sending create payload (matches legacy behavior). */
export function stripEmptyVehicleFields(
  payload: Record<string, string | number | undefined>
): CreateVehicleInput {
  const cleaned: CreateVehicleInput = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      cleaned[key] = value;
    }
  });
  return cleaned;
}

export function formatImageTextareaValue(text?: string | null): string {
  if (!text) return "";
  return text.replace(/,/g, ",\n");
}

export function normalizeImageTextareaValue(text?: string): string {
  return text?.replace(/,\n/g, ",") ?? "";
}

export function parseAdditionalData(
  raw: Record<string, unknown> | string | null | undefined
): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
