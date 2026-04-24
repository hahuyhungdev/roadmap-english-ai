import { notFound } from "next/navigation";
import { getSession, getPhraseGroup } from "@/lib/sessions.server";
import SessionDetailClient from "@/features/learning/components/SessionDetailClient";

export default async function SessionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ phraseId: string; id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { phraseId, id } = await params;
  const resolvedSearchParams = await searchParams;
  const session = getSession(id);
  const phase = getPhraseGroup(phraseId);
  const canViewAnswerGuides = Object.prototype.hasOwnProperty.call(
    resolvedSearchParams,
    "student",
  );
  if (!session || !phase) notFound();
  return (
    <SessionDetailClient
      session={session}
      phase={phase}
      canViewAnswerGuides={canViewAnswerGuides}
    />
  );
}
