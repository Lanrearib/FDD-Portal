import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { Reports } from "@/components/reports";
import { currentStaff } from "@/lib/staff-directory";

export const metadata: Metadata = { title: "Reports" };

export default function ZoneReports() {
  return (
    <AppShell user={currentStaff} variant="staff">
      <Reports scope="zone" />
    </AppShell>
  );
}
