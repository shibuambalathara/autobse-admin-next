"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatusBadge,
  buttonVariants,
} from "@/components/ui";
import { EmptyState, LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { useDashboardContext } from "@/modules/dashboard/context/DashboardDataContext";

export function DashboardRecentActivity() {
  const { activityItems, activityLoading, activityError, isAdmin } =
    useDashboardContext();

  if (!isAdmin) {
    return (
      <Card padding="none" className="flex h-full flex-col overflow-hidden">
        <CardHeader className="mb-0 border-b border-surface-border px-5 py-4">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription className="mt-0.5">
              Audit log activity is available to administrators.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center p-6">
          <p className="text-center text-sm text-brand-500">
            Sign in as an admin to view recent system activity.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card padding="none" className="flex h-full flex-col overflow-hidden">
      <CardHeader className="mb-0 border-b border-surface-border px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription className="mt-0.5">
              Latest audit log entries across the system.
            </CardDescription>
          </div>
          <Link
            href={ROUTES.auditLogs}
            className={buttonVariants({ size: "sm", variant: "ghost" })}
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        {activityLoading ? (
          <div className="p-6">
            <LoadingState label="Loading recent activity…" />
          </div>
        ) : activityError ? (
          <div className="p-6">
            <EmptyState
              title="Failed to load activity"
              description={extractGraphqlError(activityError).message}
            />
          </div>
        ) : activityItems.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No recent activity"
              description="Audit log entries will appear here."
            />
          </div>
        ) : (
          <ul className="divide-y divide-surface-border">
            {activityItems.map((item) => (
              <li key={item.id} className="flex gap-3 px-4 py-3.5 sm:px-5">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-300" />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-brand-900">
                      {item.title}
                    </p>
                    <StatusBadge status={item.status} showDot />
                  </div>
                  <p className="text-sm text-brand-600">{item.description}</p>
                  <p className="text-xs text-brand-400">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
