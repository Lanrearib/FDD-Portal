import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { currentStaff } from "@/lib/staff-directory";
import { AppointmentsView } from "./appointments-view";

export const metadata: Metadata = { title: "Appointments" };

export default function StaffAppointments() {
  return (
    <AppShell user={currentStaff} variant="staff">
      <AppointmentsView />
    </AppShell>
  );
}
