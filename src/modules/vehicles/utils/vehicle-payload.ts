import type { CreateVehicleInput } from "@/modules/vehicles/types";

/** Strip empty string values before sending create payload (matches legacy behavior). */
export function stripEmptyVehicleFields(
  payload: Record<string, string | number | string[] | undefined>
): CreateVehicleInput {
  const cleaned: CreateVehicleInput = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value === "" || value === undefined || value === null) return;
    if (Array.isArray(value) && value.length === 0) return;
    cleaned[key] = value;
  });
  return cleaned;
}

/** Flatten API image values that may be comma-separated inside array entries. */
export function normalizeVehicleImages(
  images?: string[] | string | null
): string[] {
  if (!images) return [];
  const items = Array.isArray(images) ? images : [images];
  return items
    .filter(Boolean)
    .flatMap((item) =>
      item
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    );
}

export function formatImageTextareaValue(
  images?: string[] | string | null
): string {
  return normalizeVehicleImages(images).join(",\n");
}

export function normalizeImageTextareaValue(text?: string): string[] {
  if (!text?.trim()) return [];
  return text
    .replace(/,\n/g, ",")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
}

export function vehicleHasHttpsImages(images?: string[] | null): boolean {
  return normalizeVehicleImages(images).some((url) => url.includes("https://"));
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
