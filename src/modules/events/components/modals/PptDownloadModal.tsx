"use client";

import { Loader2 } from "lucide-react";
import { Button, Modal } from "@/components/ui";

interface PptDownloadModalProps {
  open: boolean;
  includeVahan: boolean | null;
  loading: boolean;
  pptUrl: string;
  onSelectVahan: (value: boolean) => void;
  onClose: () => void;
}

export function PptDownloadModal({
  open,
  includeVahan,
  loading,
  pptUrl,
  onSelectVahan,
  onClose,
}: PptDownloadModalProps) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => undefined : onClose}
      title="Download PPT"
      size="md"
    >
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-6 text-brand-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Preparing PPT for download…</span>
        </div>
      )}

      {!loading && includeVahan === null && (
        <>
          <p className="mb-4 text-sm text-brand-700">
            Do you want <strong>Vahan information</strong> in the PPT?
          </p>
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={() => onSelectVahan(true)}>
              Yes
            </Button>
            <Button type="button" variant="outline" onClick={() => onSelectVahan(false)}>
              No
            </Button>
          </div>
        </>
      )}

      {!loading && pptUrl && (
        <a
          href={pptUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          Download PPT
        </a>
      )}
    </Modal>
  );
}
