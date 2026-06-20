import { EditPaymentForm } from "@/modules/payments";

interface PageProps {
  params: Promise<{ paymentId: string }>;
}

export default async function UpdatePaymentPage({ params }: PageProps) {
  const { paymentId } = await params;
  return <EditPaymentForm paymentId={paymentId} />;
}
