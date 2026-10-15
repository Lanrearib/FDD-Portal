import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { currentStaff } from "@/lib/staff-directory";
import { CandidateTable } from "../candidate-table";
import { candidates } from "../data";

export const metadata: Metadata = { title: "Candidates" };

export default function CandidatesPage() {
  return (
    <AppShell user={currentStaff} variant="staff">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="t-h1">Candidates</h1>
        <p className="mt-2 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-2">
          Everyone routed to Ikeja Zone, with where they are and who each step is waiting on. Brothers and sisters are
          listed separately, even when their proposals are linked.
        </p>
        <div className="mt-7">
          <CandidateTable rows={candidates} full />
        </div>
      </div>
    </AppShell>
  );
}
