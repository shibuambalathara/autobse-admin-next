import { cn } from "@/lib/utils";

/** Shared field styles for all form controls. */
export const fieldStyles = {
  base: cn(
    "w-full rounded-md border border-surface-border bg-white text-sm text-brand-900 shadow-sm",
    "transition-colors placeholder:text-brand-400",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
    "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-50"
  ),
  error: "border-red-500 focus-visible:ring-red-500",
  sizes: {
    sm: "h-8 px-2.5 text-xs",
    md: "h-9 px-3 py-1",
    lg: "h-10 px-3.5 text-base",
  },
} as const;

export function getFieldClassName(
  options?: { error?: boolean; size?: keyof typeof fieldStyles.sizes; className?: string }
): string {
  return cn(
    fieldStyles.base,
    fieldStyles.sizes[options?.size ?? "md"],
    options?.error && fieldStyles.error,
    options?.className
  );
}
