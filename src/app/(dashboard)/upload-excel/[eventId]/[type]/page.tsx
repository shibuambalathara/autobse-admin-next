import { notFound } from "next/navigation";
import { EventUploadView } from "@/modules/events/components/EventUploadView";
import { isEventUploadType } from "@/modules/events/utils/event-upload-api";

interface PageProps {
  params: Promise<{ eventId: string; type: string }>;
}

export default async function EventUploadPage({ params }: PageProps) {
  const { eventId, type } = await params;

  if (!isEventUploadType(type)) {
    notFound();
  }

  return <EventUploadView eventId={eventId} uploadType={type} />;
}
