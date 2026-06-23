import { BlockedSellersByUserView } from "@/modules/blocked-dealers";

interface BlockedSellersByUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlockedSellersByUserPage({
  params,
}: BlockedSellersByUserPageProps) {
  const { id } = await params;
  return <BlockedSellersByUserView userId={id} />;
}
