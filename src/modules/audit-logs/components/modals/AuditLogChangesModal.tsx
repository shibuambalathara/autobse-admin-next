"use client";

import type { ReactNode } from "react";
import { Modal } from "@/components/ui";

function formatChangeValue(value: unknown): ReactNode {
  if (value === null || value === undefined) return "—";

  if (typeof value === "boolean") {
    return (
      <span className={value ? "font-medium text-emerald-600" : "font-medium text-red-600"}>
        {value ? "True" : "False"}
      </span>
    );
  }

  if (Array.isArray(value)) {
    return (
      <ul className="list-disc pl-4">
        {value.map((item, index) => (
          <li key={index} className="mb-1 rounded bg-surface-muted px-2 py-1">
            {String(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (record.connect || record.disconnect) {
      const connect = Array.isArray(record.connect) ? record.connect : [];
      const disconnect = Array.isArray(record.disconnect) ? record.disconnect : [];

      return (
        <div className="space-y-2">
          {connect.length > 0 ? (
            <div>
              <span className="font-medium text-emerald-600">Connect:</span>
              {connect.map((item, index) => (
                <div
                  key={`connect-${index}`}
                  className="mb-1 rounded bg-emerald-50 px-2 py-1"
                >
                  {typeof item === "object" && item && "id" in item
                    ? String((item as { id?: string }).id)
                    : String(item)}
                </div>
              ))}
            </div>
          ) : null}
          {disconnect.length > 0 ? (
            <div>
              <span className="font-medium text-red-600">Disconnect:</span>
              {disconnect.map((item, index) => (
                <div
                  key={`disconnect-${index}`}
                  className="mb-1 rounded bg-red-50 px-2 py-1"
                >
                  {typeof item === "object" && item && "id" in item
                    ? String((item as { id?: string }).id)
                    : String(item)}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <pre className="overflow-x-auto rounded bg-surface-muted p-2 text-xs">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  if (typeof value === "string" && value.includes("T") && value.includes("Z")) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString();
    }
  }

  return String(value);
}

function renderChangesTable(changes: unknown) {
  if (!changes || typeof changes !== "object") {
    return <p className="text-sm text-brand-500">No changes available.</p>;
  }

  const record = changes as Record<string, unknown>;

  if ("old" in record || "new" in record) {
    return (
      <table className="w-full border border-surface-border text-sm">
        <thead className="bg-surface-muted">
          <tr>
            <th className="border border-surface-border px-3 py-2 text-left">
              Old Value
            </th>
            <th className="border border-surface-border px-3 py-2 text-left">
              New Value
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-surface-border px-3 py-2 text-red-600">
              {formatChangeValue(record.old)}
            </td>
            <td className="border border-surface-border px-3 py-2 text-emerald-600">
              {formatChangeValue(record.new)}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <table className="w-full border border-surface-border text-sm">
      <thead className="bg-surface-muted">
        <tr>
          <th className="border border-surface-border px-3 py-2 text-left">Field</th>
          <th className="border border-surface-border px-3 py-2 text-left">
            Old Value
          </th>
          <th className="border border-surface-border px-3 py-2 text-left">
            New Value
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(record).map(([key, value]) => {
          const change = value as { old?: unknown; new?: unknown } | undefined;
          return (
            <tr key={key}>
              <td className="border border-surface-border px-3 py-2 font-medium">
                {key}
              </td>
              <td className="border border-surface-border px-3 py-2 text-red-600">
                {formatChangeValue(change?.old)}
              </td>
              <td className="border border-surface-border px-3 py-2 text-emerald-600">
                {formatChangeValue(change?.new)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

interface AuditLogChangesModalProps {
  open: boolean;
  changes: unknown;
  onClose: () => void;
}

export function AuditLogChangesModal({
  open,
  changes,
  onClose,
}: AuditLogChangesModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Audit Log Changes" size="lg">
      <div className="max-h-[70vh] overflow-y-auto">{renderChangesTable(changes)}</div>
    </Modal>
  );
}
