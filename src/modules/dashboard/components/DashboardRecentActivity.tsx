import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatusBadge,
} from "@/components/ui";
import { DASHBOARD_PLACEHOLDER_ACTIVITY } from "@/modules/dashboard/constants/placeholder-data";

export function DashboardRecentActivity() {
  return (
    <Card padding="none" className="flex h-full flex-col overflow-hidden">
      <CardHeader className="mb-0 border-b border-surface-border px-5 py-4">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription className="mt-0.5">
            Latest actions and system events.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ul className="divide-y divide-surface-border">
          {DASHBOARD_PLACEHOLDER_ACTIVITY.map((item) => (
            <li
              key={item.id}
              className="flex gap-3 px-4 py-3.5 sm:px-5"
            >
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
      </CardContent>
    </Card>
  );
}
