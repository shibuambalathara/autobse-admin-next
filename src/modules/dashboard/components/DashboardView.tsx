import { PageContainer } from "@/components/ui";
import { DashboardStats } from "@/modules/dashboard/components/DashboardStats";
import { DashboardQuickActions } from "@/modules/dashboard/components/DashboardQuickActions";
import { DashboardTableSection } from "@/modules/dashboard/components/DashboardTableSection";
import { DashboardRecentActivity } from "@/modules/dashboard/components/DashboardRecentActivity";
import { DashboardSection } from "@/modules/dashboard/components/DashboardSection";

export function DashboardView() {
  return (
    <PageContainer
      title="Dashboard"
      description="AutoBSE admin overview and quick access to key modules."
    >
      <div className="space-y-8">
        <DashboardSection title="Statistics" description="Key metrics at a glance.">
          <DashboardStats />
        </DashboardSection>

        <DashboardSection
          title="Quick Actions"
          description="Shortcuts to common admin tasks."
        >
          <DashboardQuickActions />
        </DashboardSection>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <DashboardTableSection />
          </div>
          <div className="xl:col-span-1">
            <DashboardRecentActivity />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
