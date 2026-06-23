import type { AdditionalDataFormState } from "@/modules/vehicles/types";

interface MergeAdditionalDataInput {
  existing: Record<string, unknown>;
  formAdditionalData?: Record<string, unknown>;
  keyRenames: Record<string, string>;
  removedFields: Set<string>;
  newFields: Array<{ id: string; key: string; value: string }>;
}

function resolveRenamedKey(originalKey: string, keyRenames: Record<string, string>): string {
  const renamed = keyRenames[originalKey]?.trim();
  return renamed && renamed !== originalKey ? renamed : originalKey;
}

function coerceValue(value: unknown, originalValue: unknown): unknown {
  if (value === "") {
    if (typeof originalValue === "number" || typeof originalValue === "boolean") {
      return null;
    }
    return "";
  }
  if (value === null || value === undefined) {
    return originalValue;
  }
  if (typeof originalValue === "number") {
    return typeof value === "string" ? (Number.parseFloat(value) || value) : value;
  }
  if (typeof originalValue === "boolean") {
    return value === "true" || value === true || value === "True";
  }
  return typeof value === "string" ? value.trim() : value;
}

/** Reconstruct additionalData JSON for UpdateVehicle (ported from legacy editVehicle.tsx). */
export function mergeAdditionalData({
  existing,
  formAdditionalData = {},
  keyRenames,
  removedFields,
  newFields,
}: MergeAdditionalDataInput): Record<string, unknown> {
  const merged: Record<string, unknown> = {};

  Object.keys(existing).forEach((originalKey) => {
    if (removedFields.has(originalKey)) return;
    const value = formAdditionalData[originalKey] ?? existing[originalKey];
    const finalKey = resolveRenamedKey(originalKey, keyRenames);
    merged[finalKey] = coerceValue(value, existing[originalKey]);
  });

  newFields.forEach((field) => {
    const key = field.key.trim();
    const value = field.value.trim();
    if (!key || !value) return;
    const num = Number.parseFloat(value);
    merged[key] = !Number.isNaN(num) && Number.isFinite(num) ? num : value;
  });

  return merged;
}

export function buildAdditionalDataDefaults(
  additionalData: Record<string, unknown> | null
): Record<string, string> {
  if (!additionalData) return {};
  const defaults: Record<string, string> = {};
  Object.entries(additionalData).forEach(([key, value]) => {
    defaults[`additionalData.${key}`] =
      value === null || value === undefined ? "" : String(value);
  });
  return defaults;
}

export function createEmptyAdditionalDataState(): AdditionalDataFormState {
  return { keyRenames: {}, removedFields: new Set(), newFields: [] };
}
