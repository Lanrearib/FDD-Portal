import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { Reports } from "@/components/reports";
import { leadershipUser } from "@/lib/staff-directory";

export const metadata: Metadata = { title: "At a glance" };

export default function LeadershipPage() {
  return (
    <AppShell user={leadershipUser} variant="leadership">
      <Reports scope="leadership" />
    </AppShell>
  );
}
