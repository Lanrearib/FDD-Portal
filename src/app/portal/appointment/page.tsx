import type { Metadata } from "next";
import { PageHeader, PortalFrame } from "@/components/portal/portal-frame";
import { getPersona } from "@/lib/portal";
import { AppointmentFlow } from "./appointment-flow";

export const metadata: Metadata = { title: "Appointments" };

export default async function AppointmentPage() {
  const persona = await getPersona();
  return (
    <PortalFrame persona={persona}>
      <PageHeader
        title="Appointments"
        description={`Meet ${persona.counsellor.name}, the marriage counsellor for ${persona.zone}. Your first appointment comes after your checks are complete.`}
      />
      <AppointmentFlow persona={persona} />
    </PortalFrame>
  );
}
