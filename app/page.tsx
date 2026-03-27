import { loadPhraseGroups } from "@/lib/sessions.server";
import SessionHubClient from "@/views/SessionHubClient";

export default function HomePage() {
  const phrases = loadPhraseGroups();
  return <SessionHubClient phrases={phrases} />;
}
