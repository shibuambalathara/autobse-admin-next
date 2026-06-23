import { PageContainer } from "@/components/ui";
import { CreateCallLogForm } from "@/modules/crm/forms/CreateCallLogForm";

interface CreateCallLogViewProps {
  clientId: string;
}

export function CreateCallLogView({ clientId }: CreateCallLogViewProps) {
  return (
    <PageContainer
      title="Add Call Log"
      description="Record a new call log for this potential buyer."
    >
      <div className="mx-auto w-full max-w-4xl">
        <CreateCallLogForm clientId={clientId} />
      </div>
    </PageContainer>
  );
}
