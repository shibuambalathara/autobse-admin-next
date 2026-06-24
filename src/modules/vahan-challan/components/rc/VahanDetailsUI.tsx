"use client";

import { VAHAN_HIDDEN_FIELDS } from "@/modules/vahan-challan/constants";
import type { ProvahanVehicleData } from "@/modules/vahan-challan/types";
import { formatFieldName } from "@/modules/vahan-challan/utils/challan-formatters";

interface VahanDetailsUIProps {
  vehicleData: ProvahanVehicleData | null;
  elementId?: string;
}

function isDisplayableValue(key: string, value: unknown): boolean {
  if (key === "__typename") return false;
  if (VAHAN_HIDDEN_FIELDS.includes(key as (typeof VAHAN_HIDDEN_FIELDS)[number])) {
    return false;
  }
  if (typeof value === "string" && value.trim() === "") return false;

  const badValues = ["null", "undefined", "na", "n/a", "-", "--"];
  if (badValues.includes(String(value).toLowerCase())) return false;

  return true;
}

export function VahanDetailsUI({
  vehicleData,
  elementId = "vahan-details-section",
}: VahanDetailsUIProps) {
  if (!vehicleData) return null;

  const entries = Object.entries(vehicleData).filter(([key, value]) =>
    isDisplayableValue(key, value)
  );

  const fieldsPerBox = Math.ceil(entries.length / 3);
  const columnData = [
    entries.slice(0, fieldsPerBox),
    entries.slice(fieldsPerBox, fieldsPerBox * 2),
    entries.slice(fieldsPerBox * 2),
  ];

  return (
    <div
      id={elementId}
      className="mt-4 rounded-md border border-surface-border bg-white p-4 shadow-sm"
    >
      <h3 className="mb-4 text-lg font-semibold text-brand-900">
        Vehicle Information
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columnData.map((col, i) => (
          <div
            key={i}
            className="rounded border border-surface-border p-3 shadow-sm"
          >
            {col.map(([key, value]) => (
              <div key={key} className="pb-2">
                <div className="text-sm font-medium text-gray-600">
                  {formatFieldName(key)}
                </div>
                <div className="break-words text-sm font-semibold text-gray-900">
                  {String(value)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
