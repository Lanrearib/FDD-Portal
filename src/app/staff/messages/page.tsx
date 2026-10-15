import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { currentStaff } from "@/lib/staff-directory";
import { Inbox } from "./inbox";

export const metadata: Metadata = { title: "Messages" };

export default function StaffMessages() {
  return (
    <AppShell user={currentStaff} variant="staff">
      <Inbox />
    </AppShell>
  );
}
