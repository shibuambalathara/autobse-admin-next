import { PageContainer } from "@/components/ui";
import { EditEventBotForm } from "@/modules/event-bots/forms/EditEventBotForm";

interface EditEventBotViewProps {
  eventBotId: string;
}

export function EditEventBotView({ eventBotId }: EditEventBotViewProps) {
  return (
    <PageContainer
      title="Edit EventBot"
      description="Update EventBot configuration or view completed details."
    >
      <div className="mx-auto w-full max-w-4xl">
        <EditEventBotForm eventBotId={eventBotId} />
      </div>
    </PageContainer>
  );
}
