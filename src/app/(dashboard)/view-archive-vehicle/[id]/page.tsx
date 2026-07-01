import { ArchiveVehicleDetailView } from "@/modules/archive-events";

interface ArchiveVehicleDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    eventArchiveId?: string;
    eventNo?: string;
    sellerName?: string;
  }>;
}

export default async function ArchiveVehicleDetailPage({
  params,
  searchParams,
}: ArchiveVehicleDetailPageProps) {
  const { id } = await params;
  const { eventArchiveId, eventNo, sellerName } = await searchParams;

  return (
    <ArchiveVehicleDetailView
      vehicleId={id}
      eventArchiveId={eventArchiveId}
      eventNo={eventNo}
      sellerName={sellerName}
    />
  );
}
