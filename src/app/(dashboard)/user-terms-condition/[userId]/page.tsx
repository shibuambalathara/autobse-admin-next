import { UserTermsConditionListView } from "@/modules/terms-and-conditions";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserTermsConditionPage({ params }: PageProps) {
  const { userId } = await params;
  return <UserTermsConditionListView userId={userId} />;
}
