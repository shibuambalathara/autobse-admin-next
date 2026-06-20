"use client";

import { useEffect, useState } from "react";
import { Button, Input, Modal, Select } from "@/components/ui";
import { FormField } from "@/components/forms";
import type { CrmFilterOption } from "@/modules/crm/types";

interface CrmExcelModalProps {
  open: boolean;
  onClose: () => void;
  onDownload: (stateId: string, skip: number, take: number) => Promise<boolean | void>;
  loading?: boolean;
  stateOptions: CrmFilterOption[];
  initialStateId?: string;
}

export function CrmExcelModal({
  open,
  onClose,
  onDownload,
  loading,
  stateOptions,
  initialStateId = "",
}: CrmExcelModalProps) {
  const [stateId, setStateId] = useState(initialStateId);
  const [skip, setSkip] = useState("0");
  const [take, setTake] = useState("100");

  useEffect(() => {
    if (!open) return;
    setStateId(initialStateId);
    setSkip("0");
    setTake("100");
  }, [open, initialStateId]);

  const handleDownload = async () => {
    const success = await onDownload(stateId, Number(skip), Number(take));
    if (success) onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Download CRM Excel">
      <div className="space-y-4">
        <p className="text-sm text-brand-500">
          Export potential buyer basic info. State is required; other active
          page filters are applied when set.
        </p>

        <FormField label="State" htmlFor="crm-excel-state" required>
          <Select
            id="crm-excel-state"
            placeholder="Select state"
            options={stateOptions}
            value={stateId}
            onChange={(e) => setStateId(e.target.value)}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Skip" htmlFor="crm-excel-skip">
            <Input
              id="crm-excel-skip"
              type="number"
              min={0}
              value={skip}
              onChange={(e) => setSkip(e.target.value)}
            />
          </FormField>
          <FormField label="Take" htmlFor="crm-excel-take">
            <Input
              id="crm-excel-take"
              type="number"
              min={1}
              value={take}
              onChange={(e) => setTake(e.target.value)}
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" isLoading={loading} onClick={handleDownload}>
            Download Excel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
