import { AuditLogsListView } from "@/modules/audit-logs";

interface UserAuditLogsPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserAuditLogsPage({ params }: UserAuditLogsPageProps) {
  const { id } = await params;
  return <AuditLogsListView userId={id} />;
}
