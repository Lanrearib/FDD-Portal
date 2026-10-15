import type { Metadata } from "next";
import { PageHeader, PortalFrame } from "@/components/portal/portal-frame";
import { getPersona } from "@/lib/portal";
import { ProposalPanel } from "./proposal-panel";

export const metadata: Metadata = { title: "Proposal" };

export default async function ProposalPage() {
  const persona = await getPersona();
  const description =
    persona.gender === "brother"
      ? "When your checks are complete, you formally share your intention with the sister and give her your proposal code."
      : "When a brother has shared his intention and your checks are complete, you record your response here.";
  return (
    <PortalFrame persona={persona}>
      <PageHeader title="Proposal" description={description} />
      <ProposalPanel persona={persona} />
    </PortalFrame>
  );
}
