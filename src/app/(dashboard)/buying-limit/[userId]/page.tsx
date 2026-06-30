import { VehicleBuyingLimitListView } from "@/modules/payments";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function BuyingLimitPage({ params }: PageProps) {
  const { userId } = await params;
  return <VehicleBuyingLimitListView userId={userId} />;
}
