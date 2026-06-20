"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { fieldStyles } from "@/components/ui/field-styles";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        fieldStyles.base,
        "min-h-[5rem] resize-y px-3 py-2",
        error && fieldStyles.error,
        className
      )}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
