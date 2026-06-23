import { EditVehicleView } from "@/modules/vehicles";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVehiclePage({ params }: PageProps) {
  const { id } = await params;
  return <EditVehicleView vehicleId={id} />;
}
