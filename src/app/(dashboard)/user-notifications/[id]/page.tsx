import { NotificationsListView } from "@/modules/notifications";

interface UserNotificationsPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserNotificationsPage({
  params,
}: UserNotificationsPageProps) {
  const { id } = await params;
  return <NotificationsListView userId={id} />;
}
