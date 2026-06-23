import { PageContainer } from "@/components/ui";
import { EditEventForm } from "@/modules/events/forms/EditEventForm";

interface EditEventViewProps {
  eventId: string;
}

export function EditEventView({ eventId }: EditEventViewProps) {
  return (
    <PageContainer
      title="Edit Event"
      description="Update auction event details."
    >
      <EditEventForm eventId={eventId} />
    </PageContainer>
  );
}
