import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { currentStaff } from "@/lib/staff-directory";
import { SupportView } from "./support-view";

export const metadata: Metadata = { title: "Support requests" };

export default function SupportPage() {
  return (
    <AppShell user={currentStaff} variant="staff">
      <SupportView />
    </AppShell>
  );
}
