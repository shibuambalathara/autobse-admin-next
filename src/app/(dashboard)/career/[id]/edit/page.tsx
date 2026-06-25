import { EditCareerView } from "@/modules/career";

interface EditCareerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCareerPage({ params }: EditCareerPageProps) {
  const { id } = await params;
  return <EditCareerView careerId={id} />;
}
