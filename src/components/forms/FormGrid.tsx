import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface FormGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3;
}

const columnMap = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
};

export function FormGrid({
  columns = 2,
  className,
  children,
  ...props
}: FormGridProps) {
  return (
    <div
      className={cn("grid gap-4 sm:gap-5", columnMap[columns], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || description) && (
        <div>
          {title && (
            <h3 className="text-sm font-semibold text-brand-900">{title}</h3>
          )}
          {description && (
            <p className="mt-0.5 text-sm text-brand-500">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
