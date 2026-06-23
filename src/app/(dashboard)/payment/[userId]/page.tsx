import { UserPaymentsListView } from "@/modules/payments";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserPaymentsPage({ params }: PageProps) {
  const { userId } = await params;
  return <UserPaymentsListView userId={userId} />;
}
