"use client";

import { Modal } from "@/components/ui";

interface CoverLetterModalProps {
  open: boolean;
  text: string;
  onClose: () => void;
}

export function CoverLetterModal({ open, text, onClose }: CoverLetterModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Cover Letter" size="md">
      <p className="whitespace-pre-wrap text-sm text-brand-700">{text}</p>
    </Modal>
  );
}
