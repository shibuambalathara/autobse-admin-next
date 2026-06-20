import { EditEventBotView } from "@/modules/event-bots";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventBotPage({ params }: PageProps) {
  const { id } = await params;
  return <EditEventBotView eventBotId={id} />;
}
