"use client";

import { useState } from "react";
import { Textarea } from "@/components/forms";
import { stripHtml } from "@/modules/blog/constants";
import { cn } from "@/lib/utils";

interface BlogDescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  id?: string;
}

export function BlogDescriptionEditor({
  value,
  onChange,
  error,
  id = "blog-description",
}: BlogDescriptionEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          type="button"
          className={cn(
            "rounded-md px-3 py-1 text-sm font-medium",
            mode === "edit"
              ? "bg-brand-600 text-white"
              : "bg-surface-muted text-brand-700 hover:bg-surface-border"
          )}
          onClick={() => setMode("edit")}
        >
          Edit HTML
        </button>
        <button
          type="button"
          className={cn(
            "rounded-md px-3 py-1 text-sm font-medium",
            mode === "preview"
              ? "bg-brand-600 text-white"
              : "bg-surface-muted text-brand-700 hover:bg-surface-border"
          )}
          onClick={() => setMode("preview")}
        >
          Preview
        </button>
      </div>

      {mode === "edit" ? (
        <Textarea
          id={id}
          rows={12}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter blog description (HTML supported)…"
        />
      ) : (
        <div
          className="min-h-[12rem] rounded-md border border-surface-border bg-white p-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: stripHtml(value) ? value : "<p class='text-brand-400'>Nothing to preview</p>",
          }}
        />
      )}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
