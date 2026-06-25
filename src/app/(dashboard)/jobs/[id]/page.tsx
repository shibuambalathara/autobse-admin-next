import { JobApplicationDetailView } from "@/modules/job-applications";

interface JobApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobApplicationDetailPage({
  params,
}: JobApplicationDetailPageProps) {
  const { id } = await params;
  return <JobApplicationDetailView applicationId={id} />;
}
