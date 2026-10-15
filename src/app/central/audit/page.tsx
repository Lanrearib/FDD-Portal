import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { centralStaff } from "@/lib/staff-directory";
import { AuditView } from "./audit-view";

export const metadata: Metadata = { title: "Audit log" };

export default function AuditPage() {
  return (
    <AppShell user={centralStaff} variant="central">
      <AuditView />
    </AppShell>
  );
}
