import { ChatWorkspace } from "@/components/chat-workspace";
import { getHomePageData } from "@/lib/data";

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ chat?: string }>;
}) {
  const params = await searchParams;
  const data = await getHomePageData(params.chat);

  return <ChatWorkspace data={data} />;
}
