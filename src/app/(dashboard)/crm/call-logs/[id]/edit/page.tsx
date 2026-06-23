import { EditCallLogView } from "@/modules/crm";

interface CrmCallLogEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function CrmCallLogEditPage({
  params,
}: CrmCallLogEditPageProps) {
  const { id } = await params;
  return <EditCallLogView callLogId={id} />;
}
