import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  className,
  padding = "md",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-surface-border bg-surface shadow-card",
        paddingMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold text-brand-900", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-brand-500", className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 flex flex-col-reverse gap-2 border-t border-surface-border pt-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

/** Metric / KPI card for dashboards. */
export interface StatsCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

const trendStyles = {
  up: "text-emerald-600",
  down: "text-red-600",
  neutral: "text-brand-400",
};

export function StatsCard({
  label,
  value,
  change,
  icon: Icon,
  trend = "neutral",
  className,
  ...props
}: StatsCardProps) {
  return (
    <Card className={cn("p-5", className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-brand-500">{label}</p>
          <p className="mt-1 truncate text-2xl font-semibold text-brand-900">
            {value}
          </p>
          {change && (
            <p className={cn("mt-1 text-xs", trendStyles[trend])}>{change}</p>
          )}
        </div>
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-500">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
    </Card>
  );
}

/** Card optimised for form layouts with optional footer actions. */
export interface FormCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function FormCard({
  title,
  description,
  footer,
  children,
  className,
  ...props
}: FormCardProps) {
  return (
    <Card padding="none" className={cn("overflow-hidden", className)} {...props}>
      <div className="border-b border-surface-border px-5 py-4">
        <h3 className="text-base font-semibold text-brand-900">{title}</h3>
        {description && (
          <p className="mt-0.5 text-sm text-brand-500">{description}</p>
        )}
      </div>
      <div className="px-5 py-5">{children}</div>
      {footer && (
        <div className="flex flex-col-reverse gap-2 border-t border-surface-border bg-surface-muted px-5 py-4 sm:flex-row sm:justify-end">
          {footer}
        </div>
      )}
    </Card>
  );
}
