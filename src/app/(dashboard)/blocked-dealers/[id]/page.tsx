import { BlockedDealersBySellerView } from "@/modules/blocked-dealers";

interface BlockedDealersBySellerPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
}

export default async function BlockedDealersBySellerPage({
  params,
  searchParams,
}: BlockedDealersBySellerPageProps) {
  const { id } = await params;
  const { name } = await searchParams;

  return (
    <BlockedDealersBySellerView sellerId={id} sellerName={name} />
  );
}
