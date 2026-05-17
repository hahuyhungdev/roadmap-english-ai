import IeltsDashboardClient from "@/features/ielts/pages/IeltsDashboardClient";
import { loadIeltsDocuments } from "@/lib/ielts.server";

export default function IeltsPage() {
  const documents = loadIeltsDocuments();

  return <IeltsDashboardClient documents={documents} />;
}
