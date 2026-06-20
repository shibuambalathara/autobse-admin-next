import { EventVehiclesListView } from "@/modules/event-vehicles";

interface ViewVehiclesPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category?: string }>;
}

export default async function ViewVehiclesPage({
  params,
  searchParams,
}: ViewVehiclesPageProps) {
  const { id } = await params;
  const { category } = await searchParams;

  return <EventVehiclesListView eventId={id} eventCategory={category} />;
}
