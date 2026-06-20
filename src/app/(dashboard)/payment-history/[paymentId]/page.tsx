import { PaymentStatusHistoryView } from "@/modules/payments";

interface PageProps {
  params: Promise<{ paymentId: string }>;
}

export default async function PaymentHistoryPage({ params }: PageProps) {
  const { paymentId } = await params;
  return <PaymentStatusHistoryView paymentId={paymentId} />;
}
