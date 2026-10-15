import type { Metadata } from "next";
import { PageHeader, PortalFrame } from "@/components/portal/portal-frame";
import { getPersona } from "@/lib/portal";
import { Thread } from "./thread";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const persona = await getPersona();
  return (
    <PortalFrame persona={persona}>
      <PageHeader title="Messages" description="Your conversation with your counsellor, plus updates from the portal." />
      <Thread persona={persona} />
    </PortalFrame>
  );
}
