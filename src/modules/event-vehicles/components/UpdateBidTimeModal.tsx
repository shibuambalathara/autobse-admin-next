"use client";

import { Modal, Input, Button } from "@/components/ui";
import { FormField } from "@/components/forms";
import { convertUtcToDateTimeLocal } from "@/lib/date-format";
import type { BidTimeUpdateState } from "@/modules/event-vehicles/hooks/useEventVehicleRowActions";

interface UpdateBidTimeModalProps {
  update: BidTimeUpdateState | null;
  onClose: () => void;
  onSave: (isoDate: string) => Promise<void>;
}

export function UpdateBidTimeModal({
  update,
  onClose,
  onSave,
}: UpdateBidTimeModalProps) {
  if (!update) return null;

  const label =
    update.updateItem === "startTime" ? "Bid Start Time" : "Bid End Time";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const value = String(formData.get("bidTime") || "");
    if (!value) return;
    await onSave(new Date(value).toISOString());
  };

  return (
    <Modal
      open={Boolean(update)}
      onClose={onClose}
      title={`Update ${label}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label={label} htmlFor="bidTime" required>
          <Input
            id="bidTime"
            name="bidTime"
            type="datetime-local"
            defaultValue={convertUtcToDateTimeLocal(update.date)}
            required
          />
        </FormField>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
}
