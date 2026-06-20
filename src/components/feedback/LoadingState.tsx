import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  fullPage?: boolean;
  className?: string;
}

export function LoadingState({
  label = "Loading…",
  fullPage = false,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullPage ? "min-h-[50vh]" : "py-12",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700" />
      <span className="text-sm text-brand-500">{label}</span>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded bg-brand-50" />
      ))}
    </div>
  );
}
