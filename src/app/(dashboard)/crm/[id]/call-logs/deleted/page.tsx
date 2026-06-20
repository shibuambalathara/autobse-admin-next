import { DeletedCallLogsListView } from "@/modules/crm";

interface CrmDeletedCallLogsPageProps {
  params: Promise<{ id: string }>;
}

export default async function CrmDeletedCallLogsPage({
  params,
}: CrmDeletedCallLogsPageProps) {
  const { id } = await params;
  return <DeletedCallLogsListView clientId={id} />;
}
