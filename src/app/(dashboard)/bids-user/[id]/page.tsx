import { ActiveBidsPerUserView } from "@/modules/bids";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BidsPerUserPage({ params }: PageProps) {
  const { id } = await params;
  return <ActiveBidsPerUserView userId={id} />;
}
