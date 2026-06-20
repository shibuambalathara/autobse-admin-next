import { EditCrmView } from "@/modules/crm";

interface CrmEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function CrmEditPage({ params }: CrmEditPageProps) {
  const { id } = await params;
  return <EditCrmView clientId={id} />;
}
