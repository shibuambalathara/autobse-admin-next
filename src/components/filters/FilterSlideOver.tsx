"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui";

interface FilterSlideOverProps {
  open: boolean;
  onClose: () => void;
  onClear: () => void;
  children: ReactNode;
  activeCount?: number;
  title?: string;
  titleId?: string;
}

export function FilterSlideOver({
  open,
  onClose,
  onClear,
  children,
  activeCount = 0,
  title = "Filters",
  titleId = "filter-panel-title",
}: FilterSlideOverProps) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <>
      <button
        type="button"
        className="fixed inset-0 z-drawer bg-black/40"
        aria-label="Close filters"
        onClick={onClose}
      />
      <aside
        className="fixed inset-y-0 right-0 z-drawer flex w-[min(100vw,20rem)] max-w-full flex-col bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-surface-border px-4 py-3">
          <div>
            <h2
              id={titleId}
              className="text-base font-semibold text-brand-900"
            >
              {title}
            </h2>
            {activeCount > 0 && (
              <p className="mt-0.5 text-xs text-brand-500">
                {activeCount} active filter{activeCount === 1 ? "" : "s"}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-brand-500 hover:bg-surface-muted hover:text-brand-900"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

        <div className="flex shrink-0 flex-col gap-2 border-t border-surface-border px-4 py-4">
          <Button type="button" className="w-full" onClick={onClose}>
            Apply filters
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              onClear();
              onClose();
            }}
          >
            Clear all
          </Button>
        </div>
      </aside>
    </>,
    document.body
  );
}
