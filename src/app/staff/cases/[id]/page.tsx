import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findProposalCase } from "../data";
import { CaseDetail } from "./case-detail";

export async function generateMetadata({ params }: PageProps<"/staff/cases/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: findProposalCase(id)?.ref ?? "Proposal case" };
}

export default async function ProposalCasePage({ params }: PageProps<"/staff/cases/[id]">) {
  const { id } = await params;
  const c = findProposalCase(id);
  if (!c) notFound();
  return <CaseDetail key={c.id} c={c} />;
}
