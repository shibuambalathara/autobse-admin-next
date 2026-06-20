import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
  {
    variants: {
      variant: {
        default: "bg-brand-100 text-brand-800",
        success: "bg-emerald-50 text-emerald-700",
        warning: "bg-amber-50 text-amber-700",
        danger: "bg-red-50 text-red-700",
        info: "bg-sky-50 text-sky-700",
        neutral: "bg-slate-100 text-slate-700",
      },
      dot: {
        true: "pl-1.5",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      dot: false,
    },
  }
);

/** Enterprise status presets mapped to badge variants. */
export const STATUS_PRESETS = {
  active: { variant: "success", label: "Active" },
  pending: { variant: "warning", label: "Pending" },
  live: { variant: "info", label: "Live" },
  completed: { variant: "success", label: "Completed" },
  failed: { variant: "danger", label: "Failed" },
  approved: { variant: "success", label: "Approved" },
  rejected: { variant: "danger", label: "Rejected" },
} as const satisfies Record<
  string,
  { variant: NonNullable<VariantProps<typeof badgeVariants>["variant"]>; label: string }
>;

export type StatusPreset = keyof typeof STATUS_PRESETS;

export interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  label?: string;
  status?: StatusPreset;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({
  label,
  status,
  variant,
  showDot = false,
  className,
}: StatusBadgeProps) {
  const preset = status ? STATUS_PRESETS[status] : undefined;
  const resolvedVariant = variant ?? preset?.variant ?? "default";
  const resolvedLabel = label ?? preset?.label ?? status ?? "";

  return (
    <span
      className={cn(
        badgeVariants({ variant: resolvedVariant, dot: showDot }),
        className
      )}
    >
      {showDot && (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-80"
          aria-hidden
        />
      )}
      {resolvedLabel}
    </span>
  );
}

export { badgeVariants };
