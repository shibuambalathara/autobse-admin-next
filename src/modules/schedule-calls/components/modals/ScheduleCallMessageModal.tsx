"use client";

import { Modal } from "@/components/ui";

interface ScheduleCallMessageModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export function ScheduleCallMessageModal({
  open,
  message,
  onClose,
}: ScheduleCallMessageModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Full Message" size="md">
      <p className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-sm text-brand-700">
        {message}
      </p>
    </Modal>
  );
}
