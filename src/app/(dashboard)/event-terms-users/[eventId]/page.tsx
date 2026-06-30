import { EventTermsUsersListView } from "@/modules/terms-and-conditions";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventTermsUsersPage({ params }: PageProps) {
  const { eventId } = await params;
  return <EventTermsUsersListView eventId={eventId} />;
}
