import { CreatePaymentForm } from "@/modules/payments";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function CreatePaymentPage({ params }: PageProps) {
  const { userId } = await params;
  return <CreatePaymentForm userId={userId} />;
}
