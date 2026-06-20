import { CreateCallLogView } from "@/modules/crm";

interface CrmCallLogAddPageProps {
  params: Promise<{ id: string }>;
}

export default async function CrmCallLogAddPage({
  params,
}: CrmCallLogAddPageProps) {
  const { id } = await params;
  return <CreateCallLogView clientId={id} />;
}
