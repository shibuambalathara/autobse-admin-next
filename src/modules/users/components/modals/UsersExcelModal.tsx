"use client";

import { useEffect, useState } from "react";
import { Button, Input, Modal } from "@/components/ui";
import { FormField } from "@/components/forms";

interface UsersExcelModalProps {
  open: boolean;
  onClose: () => void;
  onDownload: (skip: number, take: number) => Promise<boolean | void>;
  loading?: boolean;
  getFilteredCount: () => Promise<number>;
  filterSummary: {
    search?: string;
    state?: string;
    role?: string;
    status?: string;
    registrationExpiryDate?: string;
  };
}

export function UsersExcelModal({
  open,
  onClose,
  onDownload,
  loading,
  getFilteredCount,
  filterSummary,
}: UsersExcelModalProps) {
  const [skip, setSkip] = useState("0");
  const [take, setTake] = useState("100");
  const [filteredCount, setFilteredCount] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setSkip("0");
    setTake("100");
    let cancelled = false;
    getFilteredCount()
      .then((count) => {
        if (!cancelled) setFilteredCount(count);
      })
      .catch(() => {
        if (!cancelled) setFilteredCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, [open, getFilteredCount]);

  const hasFilters =
    filterSummary.search ||
    filterSummary.state ||
    filterSummary.role ||
    filterSummary.status ||
    filterSummary.registrationExpiryDate;

  return (
    <Modal open={open} onClose={onClose} title="Download Users Excel">
      <div className="space-y-4">
        {filteredCount != null && (
          <p className="text-sm text-brand-600">
            Total users matching current filters:{" "}
            <strong>{filteredCount}</strong>
          </p>
        )}
        <p className="text-sm text-brand-500">
          Exports users using the same filters applied on this page.
        </p>
        {hasFilters ? (
          <div className="space-y-1 text-sm text-brand-600">
            {filterSummary.search && (
              <p>
                Search: <strong>{filterSummary.search}</strong>
              </p>
            )}
            {filterSummary.state && (
              <p>
                State: <strong>{filterSummary.state.replace(/_/g, " ")}</strong>
              </p>
            )}
            {filterSummary.role && (
              <p>
                Role: <strong>{filterSummary.role}</strong>
              </p>
            )}
            {filterSummary.status && (
              <p>
                Status: <strong>{filterSummary.status}</strong>
              </p>
            )}
            {filterSummary.registrationExpiryDate && (
              <p>
                Registration Expiry:{" "}
                <strong>{filterSummary.registrationExpiryDate}</strong>
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-brand-500">
            No filters applied — all users will be included.
          </p>
        )}
        <FormField label="Skip" htmlFor="excel-skip">
          <Input
            id="excel-skip"
            type="number"
            min={0}
            value={skip}
            onChange={(e) => setSkip(e.target.value)}
          />
        </FormField>
        <FormField label="Take" htmlFor="excel-take">
          <Input
            id="excel-take"
            type="number"
            min={1}
            value={take}
            onChange={(e) => setTake(e.target.value)}
          />
        </FormField>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            isLoading={loading}
            onClick={async () => {
              const ok = await onDownload(Number(skip), Number(take));
              if (ok) onClose();
            }}
          >
            Download Excel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
