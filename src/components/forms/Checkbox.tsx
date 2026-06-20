"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  error?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label
        htmlFor={inputId}
        className={cn("group flex cursor-pointer items-start gap-3", className)}
      >
        <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className="peer sr-only"
            aria-invalid={error ? true : undefined}
            {...props}
          />
          <span
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded border border-surface-border bg-white transition-colors",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2",
              "peer-checked:border-brand-800 peer-checked:bg-brand-800",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              error && "border-red-500"
            )}
            aria-hidden
          >
            <Check className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100" />
          </span>
        </span>
        {(label || description) && (
          <span className="flex flex-col gap-0.5">
            {label && (
              <span className="text-sm font-medium text-brand-800">{label}</span>
            )}
            {description && (
              <span className="text-xs text-brand-500">{description}</span>
            )}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
