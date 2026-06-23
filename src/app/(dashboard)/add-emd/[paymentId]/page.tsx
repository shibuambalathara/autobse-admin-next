import { AddEmdForm } from "@/modules/payments";

interface PageProps {
  params: Promise<{ paymentId: string }>;
}

export default async function AddEmdPage({ params }: PageProps) {
  const { paymentId } = await params;
  return <AddEmdForm paymentId={paymentId} />;
}
