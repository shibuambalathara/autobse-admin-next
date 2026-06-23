"use client";

import { Loader2 } from "lucide-react";
import { Button, Input, Modal } from "@/components/ui";

interface PptLinkModalProps {
  open: boolean;
  includeVahan: boolean | null;
  loading: boolean;
  pptUrl: string;
  copied: boolean;
  onSelectVahan: (value: boolean) => void;
  onCopy: () => void;
  onClose: () => void;
}

export function PptLinkModal({
  open,
  includeVahan,
  loading,
  pptUrl,
  copied,
  onSelectVahan,
  onCopy,
  onClose,
}: PptLinkModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="PPT Link" size="lg">
      {includeVahan === null && !loading && (
        <>
          <p className="mb-4 text-sm text-brand-700">
            Do you want <strong>Vahan information</strong> in the PPT?
          </p>
          <div className="flex gap-2">
            <Button type="button" onClick={() => onSelectVahan(true)}>
              Yes
            </Button>
            <Button type="button" variant="outline" onClick={() => onSelectVahan(false)}>
              No
            </Button>
          </div>
        </>
      )}

      {loading && (
        <div className="flex items-center gap-2 py-4 text-brand-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Preparing PPT link…</span>
        </div>
      )}

      {!loading && pptUrl && (
        <>
          <Input value={pptUrl} readOnly className="mb-4" />
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={onCopy}>
              Copy URL
            </Button>
            <a
              href={pptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Open PPT
            </a>
          </div>
          {copied && (
            <p className="mt-2 text-sm text-emerald-600">URL copied!</p>
          )}
        </>
      )}
    </Modal>
  );
}
