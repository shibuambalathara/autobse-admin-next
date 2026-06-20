import { VehicleStatusHistoryView } from "@/modules/vehicles";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VehicleStatusHistoryPage({ params }: PageProps) {
  const { id } = await params;
  return <VehicleStatusHistoryView vehicleId={id} />;
}
