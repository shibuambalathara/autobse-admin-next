import { PageContainer } from "@/components/ui";
import { CreateEventBotForm } from "@/modules/event-bots/forms/CreateEventBotForm";

export function CreateEventBotView() {
  return (
    <PageContainer
      title="EventBot"
      description="Generate a new EventBot and upload vehicles."
    >
      <div className="mx-auto w-full max-w-4xl">
        <CreateEventBotForm />
      </div>
    </PageContainer>
  );
}
