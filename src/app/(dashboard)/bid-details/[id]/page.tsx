import { BidDetailsListView } from "@/modules/bids";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BidDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return <BidDetailsListView vehicleId={id} />;
}
