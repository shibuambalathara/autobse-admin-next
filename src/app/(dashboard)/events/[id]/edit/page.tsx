import { EditEventView } from "@/modules/events";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  return <EditEventView eventId={id} />;
}
