import { EmdDetailsListView } from "@/modules/payments";

interface PageProps {
  params: Promise<{ paymentId: string }>;
}

export default async function EmdDetailsPage({ params }: PageProps) {
  const { paymentId } = await params;
  return <EmdDetailsListView paymentId={paymentId} />;
}
