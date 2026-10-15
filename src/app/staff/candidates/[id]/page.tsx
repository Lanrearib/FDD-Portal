import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findCase } from "./case-data";
import { CaseView } from "./case-view";

export async function generateMetadata({ params }: PageProps<"/staff/candidates/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: findCase(id)?.name ?? "Candidate" };
}

const TABS = ["overview", "messages", "notes", "history"] as const;

export default async function CandidateCase({ params, searchParams }: PageProps<"/staff/candidates/[id]">) {
  const { id } = await params;
  const { tab } = await searchParams;
  const initialTab = TABS.find((t) => t === tab) ?? "overview";
  const record = findCase(id);
  if (!record) notFound();
  // key resets all local decision state when moving between candidates.
  return <CaseView key={record.id} record={record} initialTab={initialTab} />;
}
