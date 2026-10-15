import type { Metadata } from "next";
import { PageHeader, PortalFrame } from "@/components/portal/portal-frame";
import { getPersona } from "@/lib/portal";
import { ProfileEditor } from "./profile-editor";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const persona = await getPersona();
  return (
    <PortalFrame persona={persona}>
      <PageHeader
        title="Your profile"
        description="One profile for every proposal you take part in. Keep it up to date so your counsellor can reach you."
      />
      <ProfileEditor persona={persona} />
    </PortalFrame>
  );
}
