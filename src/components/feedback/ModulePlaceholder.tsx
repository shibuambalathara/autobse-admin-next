import { PageContainer } from "@/components/ui/PageContainer";
import { EmptyState } from "@/components/feedback/EmptyState";

interface ModulePlaceholderProps {
  title: string;
  description?: string;
}

export function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  return (
    <PageContainer
      title={title}
      description={
        description ??
        `Migrate the ${title} module from the legacy admin panel.`
      }
    >
      <EmptyState
        title={`${title} module`}
        description="This feature has not been migrated yet."
      />
    </PageContainer>
  );
}
