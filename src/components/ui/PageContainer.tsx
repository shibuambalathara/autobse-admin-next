import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export function PageContainer({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: PageContainerProps) {
  return (
    <div className={cn("mx-auto w-full min-w-0 max-w-7xl overflow-x-hidden", className)} {...props}>
      {(title || description || actions) && (
        <div className="mb-5 flex flex-col gap-3 lg:mb-6 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
          <div className="min-w-0">
            {title && (
              <h1 className="hidden text-2xl font-bold tracking-tight text-brand-900 lg:block">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1 text-sm text-brand-500">{description}</p>
            )}
          </div>
          {actions}
        </div>
      )}
      {children && <div className="min-w-0">{children}</div>}
    </div>
  );
}
