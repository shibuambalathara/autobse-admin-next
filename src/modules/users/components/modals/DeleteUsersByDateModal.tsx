"use client";

import { useState } from "react";
import { Button, Input, Modal } from "@/components/ui";
import { FormField } from "@/components/forms";

interface DeleteUsersByDateModalProps {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  onConfirm: (startDate: string, endDate: string) => Promise<boolean | void>;
}

export function DeleteUsersByDateModal({
  open,
  onClose,
  loading,
  onConfirm,
}: DeleteUsersByDateModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleClose = () => {
    setStartDate("");
    setEndDate("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Delete Users by Date Range">
      <div className="space-y-4">
        <FormField label="Start Date" htmlFor="delete-start-date" required>
          <Input
            id="delete-start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FormField>
        <FormField label="End Date" htmlFor="delete-end-date" required>
          <Input
            id="delete-end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </FormField>
        <p className="text-sm text-red-600">
          This action will permanently delete all users created within the
          selected date range.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            isLoading={loading}
            onClick={async () => {
              const ok = await onConfirm(startDate, endDate);
              if (ok) handleClose();
            }}
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
