"use client";

import { Modal } from "@/components/ui";

interface LocationModalProps {
  open: boolean;
  location: string;
  onClose: () => void;
}

export function LocationModal({ open, location, onClose }: LocationModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Full Location" size="md">
      <p className="text-sm text-brand-700">{location}</p>
    </Modal>
  );
}
