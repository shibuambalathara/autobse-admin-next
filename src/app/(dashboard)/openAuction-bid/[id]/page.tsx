import { OpenAuctionBidView } from "@/modules/bids/components/OpenAuctionBidView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OpenAuctionBidPage({ params }: PageProps) {
  const { id } = await params;
  return <OpenAuctionBidView vehicleId={id} />;
}
