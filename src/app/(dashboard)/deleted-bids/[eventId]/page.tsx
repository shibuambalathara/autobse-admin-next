import { DeletedBidsListView } from "@/modules/bids";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function DeletedBidsPage({ params }: PageProps) {
  const { eventId } = await params;
  return <DeletedBidsListView eventId={eventId} />;
}
