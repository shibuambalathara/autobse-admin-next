import { PageContainer } from "@/components/ui";
import { AddEventForm } from "@/modules/events/forms/AddEventForm";

export function AddEventView() {
  return (
    <PageContainer
      title="Add Event"
      description="Create a new auction event."
    >
      <AddEventForm />
    </PageContainer>
  );
}
