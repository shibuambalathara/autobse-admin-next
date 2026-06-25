import { JobApplicationsListView } from "@/modules/job-applications";

interface CareerApplicationsPageProps {
  params: Promise<{ id: string }>;
}

export default async function CareerApplicationsPage({
  params,
}: CareerApplicationsPageProps) {
  const { id } = await params;
  return <JobApplicationsListView careerId={id} />;
}
