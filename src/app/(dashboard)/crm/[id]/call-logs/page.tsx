import { CallLogsListView } from "@/modules/crm";

interface CrmCallLogsPageProps {
  params: Promise<{ id: string }>;
}

export default async function CrmCallLogsPage({ params }: CrmCallLogsPageProps) {
  const { id } = await params;
  return <CallLogsListView clientId={id} />;
}
