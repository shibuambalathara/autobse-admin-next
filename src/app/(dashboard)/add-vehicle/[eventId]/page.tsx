import { AddVehicleView } from "@/modules/vehicles";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function AddVehiclePage({ params }: PageProps) {
  const { eventId } = await params;
  return <AddVehicleView eventId={eventId} />;
}
