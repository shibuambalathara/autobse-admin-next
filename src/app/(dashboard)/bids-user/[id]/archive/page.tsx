import { BidsArchivePerUserView } from "@/modules/bids";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BidsArchivePerUserPage({ params }: PageProps) {
  const { id } = await params;
  return <BidsArchivePerUserView userId={id} />;
}
