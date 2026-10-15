import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { centralStaff } from "@/lib/staff-directory";
import { PastorsView } from "./pastors-view";

export const metadata: Metadata = { title: "Pastor directory" };

export default function PastorsPage() {
  return (
    <AppShell user={centralStaff} variant="central">
      <PastorsView />
    </AppShell>
  );
}
