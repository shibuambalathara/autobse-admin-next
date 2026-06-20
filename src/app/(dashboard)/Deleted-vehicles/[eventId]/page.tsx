import { DeletedVehiclesListView } from "@/modules/vehicles";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function DeletedVehiclesPage({ params }: PageProps) {
  const { eventId } = await params;
  return <DeletedVehiclesListView eventId={eventId} />;
}
