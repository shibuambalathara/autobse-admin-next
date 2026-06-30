import { UserArchivedTermsListView } from "@/modules/terms-and-conditions";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserArchivedTermsConditionPage({
  params,
}: PageProps) {
  const { userId } = await params;
  return <UserArchivedTermsListView userId={userId} />;
}
