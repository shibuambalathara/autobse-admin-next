import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui";
import { DASHBOARD_QUICK_ACTIONS } from "@/modules/dashboard/constants/placeholder-data";

export function DashboardQuickActions() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {DASHBOARD_QUICK_ACTIONS.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.id}
            href={action.href}
            className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <Card className="h-full p-4 transition-shadow group-hover:shadow-md sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100">
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center gap-1 text-sm">
                    {action.label}
                    <ArrowRight
                      className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </CardTitle>
                  <CardDescription className="mt-1 line-clamp-2 text-xs sm:text-sm">
                    {action.description}
                  </CardDescription>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
