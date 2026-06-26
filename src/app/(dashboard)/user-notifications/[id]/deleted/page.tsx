import { DeletedNotificationsView } from "@/modules/notifications";

interface UserDeletedNotificationsPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDeletedNotificationsPage({
  params,
}: UserDeletedNotificationsPageProps) {
  const { id } = await params;
  return <DeletedNotificationsView userId={id} />;
}
