import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { centralStaff } from "@/lib/staff-directory";
import { SettingsView } from "./settings-view";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <AppShell user={centralStaff} variant="central">
      <SettingsView />
    </AppShell>
  );
}
