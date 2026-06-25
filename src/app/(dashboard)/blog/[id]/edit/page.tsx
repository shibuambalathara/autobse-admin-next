import { EditBlogView } from "@/modules/blog";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  return <EditBlogView blogId={id} />;
}
