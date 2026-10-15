import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { centralStaff } from "@/lib/staff-directory";
import { CounsellorsView } from "./counsellors-view";

export const metadata: Metadata = { title: "Counsellors and Zones" };

export default function CounsellorsPage() {
  return (
    <AppShell user={centralStaff} variant="central">
      <CounsellorsView />
    </AppShell>
  );
}
