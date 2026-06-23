import { EditSellerView } from "@/modules/sellers";

interface SellerEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function SellerEditPage({ params }: SellerEditPageProps) {
  const { id } = await params;
  return <EditSellerView sellerId={id} />;
}
