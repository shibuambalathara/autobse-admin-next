import { DeletedEventBotsView } from "@/modules/event-bots";

interface PageProps {
  searchParams: Promise<{ sellerId?: string }>;
}

export default async function DeletedEventBotsPage({
  searchParams,
}: PageProps) {
  const { sellerId } = await searchParams;
  return <DeletedEventBotsView initialSellerId={sellerId} />;
}
