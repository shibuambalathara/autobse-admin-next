"use client";

import { PageContainer } from "@/components/ui";
import { useAccess } from "@/auth/use-access";
import { PERMISSIONS } from "@/auth/permissions";
import { EditEventForm } from "@/modules/events/forms/EditEventForm";

interface EditEventViewProps {
  eventId: string;
}

export function EditEventView({ eventId }: EditEventViewProps) {
  const { can } = useAccess();
  const canManageEvents = can(PERMISSIONS.EVENTS_MANAGE);

  return (
    <PageContainer
      title={canManageEvents ? "Edit Event" : "View Event"}
      description={
        canManageEvents
          ? "Update auction event details."
          : "View auction event details."
      }
    >
      <EditEventForm eventId={eventId} />
    </PageContainer>
  );
}
