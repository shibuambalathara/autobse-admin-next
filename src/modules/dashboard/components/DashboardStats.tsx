"use client";

import Link from "next/link";
import { StatsCard } from "@/components/ui";
import { EmptyState, LoadingState } from "@/components/feedback";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { useDashboardContext } from "@/modules/dashboard/context/DashboardDataContext";

export function DashboardStats() {
  const { stats, statsLoading, statsError } = useDashboardContext();

  if (statsLoading) {
    return <LoadingState label="Loading statistics…" />;
  }

  if (statsError) {
    return (
      <EmptyState
        title="Failed to load statistics"
        description={extractGraphqlError(statsError).message}
      />
    );
  }

  if (stats.length === 0) {
    return (
      <EmptyState
        title="No statistics available"
        description="You do not have permission to view dashboard metrics."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const card = (
          <StatsCard
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            className={stat.href ? "transition-shadow hover:shadow-md" : undefined}
          />
        );

        if (!stat.href) {
          return <div key={stat.id}>{card}</div>;
        }

        return (
          <Link
            key={stat.id}
            href={stat.href}
            className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            {card}
          </Link>
        );
      })}
    </div>
  );
}
