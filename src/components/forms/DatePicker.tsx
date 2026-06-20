"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFieldClassName } from "@/components/ui/field-styles";

export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: boolean;
  inputSize?: "sm" | "md" | "lg";
}

/**
 * Date picker wrapper — native input with consistent enterprise styling.
 * Swap internals for a headless date library during migration if needed.
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, error, inputSize = "md", ...props }, ref) => (
    <div className="relative w-full">
      <input
        ref={ref}
        type="date"
        className={cn(
          getFieldClassName({ error, size: inputSize, className }),
          "pr-9 [&::-webkit-calendar-picker-indicator]:opacity-0"
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      <Calendar
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400"
        aria-hidden
      />
    </div>
  )
);

DatePicker.displayName = "DatePicker";
