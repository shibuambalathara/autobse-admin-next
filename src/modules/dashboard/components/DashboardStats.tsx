import { StatsCard } from "@/components/ui";
import { DASHBOARD_PLACEHOLDER_STATS } from "@/modules/dashboard/constants/placeholder-data";

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {DASHBOARD_PLACEHOLDER_STATS.map((stat) => (
        <StatsCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
