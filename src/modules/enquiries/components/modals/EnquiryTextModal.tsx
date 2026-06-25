"use client";

import { Modal } from "@/components/ui";

interface EnquiryTextModalProps {
  open: boolean;
  title: string;
  text: string;
  onClose: () => void;
}

export function EnquiryTextModal({
  open,
  title,
  text,
  onClose,
}: EnquiryTextModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="md">
      <p className="whitespace-pre-wrap text-sm text-brand-700">{text}</p>
    </Modal>
  );
}
