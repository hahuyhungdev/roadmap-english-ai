import { ShadowingSessionClient } from "@/features/shadowing/shared/ShadowingSessionClient";

export default async function ShadowingSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShadowingSessionClient sessionId={parseInt(id, 10)} />;
}
