import { ArchiveEventTermsView } from "@/modules/archive-events";

interface ArchiveEventTermsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ eventNo?: string; sellerName?: string }>;
}

export default async function ArchiveEventTermsPage({
  params,
  searchParams,
}: ArchiveEventTermsPageProps) {
  const { id } = await params;
  const { eventNo, sellerName } = await searchParams;

  return (
    <ArchiveEventTermsView
      eventArchiveId={id}
      eventNo={eventNo}
      sellerName={sellerName}
    />
  );
}
