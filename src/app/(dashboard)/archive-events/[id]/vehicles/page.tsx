import { ArchiveEventVehiclesView } from "@/modules/archive-events";

interface ArchiveEventVehiclesPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ eventNo?: string; sellerName?: string }>;
}

export default async function ArchiveEventVehiclesPage({
  params,
  searchParams,
}: ArchiveEventVehiclesPageProps) {
  const { id } = await params;
  const { eventNo, sellerName } = await searchParams;

  return (
    <ArchiveEventVehiclesView
      eventArchiveId={id}
      eventNo={eventNo}
      sellerName={sellerName}
    />
  );
}
