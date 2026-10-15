import type { Metadata } from "next";
import { PageHeader, PortalFrame } from "@/components/portal/portal-frame";
import { getPersona } from "@/lib/portal";
import { IdentityFlow } from "./identity-flow";

export const metadata: Metadata = { title: "Verify your identity" };

export default async function IdentityPage() {
  const persona = await getPersona();
  return (
    <PortalFrame persona={persona}>
      <PageHeader
        title="Verify your identity"
        description="We check a photo ID once, so the church knows each candidate is who they say they are. It stays with your profile for any future proposal."
      />
      <IdentityFlow persona={persona} />
    </PortalFrame>
  );
}
