import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { Reports } from "@/components/reports";
import { centralStaff } from "@/lib/staff-directory";

export const metadata: Metadata = { title: "Reports" };

export default function CentralReports() {
  return (
    <AppShell user={centralStaff} variant="central">
      <Reports scope="central" />
    </AppShell>
  );
}
