import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Avatar, StatusPill } from "@/components/ui";
import { currentStaff } from "@/lib/staff-directory";
import { cases } from "./data";

export const metadata: Metadata = { title: "Proposal cases" };

export default function CasesPage() {
  const open = cases.filter((c) => !c.closure && c.status.label !== "Completed");
  const closed = cases.filter((c) => c.closure || c.status.label === "Completed");

  const Row = ({ c }: { c: (typeof cases)[number] }) => (
    <li>
      <Link href={`/staff/cases/${c.id}`} className="group flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4 transition-colors hover:bg-frame/70 sm:px-6">
        <div className="flex -space-x-2">
          <Avatar name={c.brother.name} size={36} />
          {c.sister ? <Avatar name={c.sister.name} size={36} /> : <span className="flex size-9 items-center justify-center rounded-full border border-dashed border-line-strong bg-frame text-[12px] text-faint ring-2 ring-surface">?</span>}
        </div>
        <div className="min-w-[200px] flex-1">
          <p className="text-[14.5px] font-medium">
            {c.brother.name} <span className="text-muted">and</span> {c.sister?.name ?? "a sister yet to link"}
          </p>
          <p className="text-[12.5px] text-muted">
            <span className="tabular-nums">{c.ref}</span>, {c.stage.toLowerCase()}
          </p>
        </div>
        <StatusPill tone={c.status.tone}>{c.status.label}</StatusPill>
        <span className="w-24 text-[13px] text-ink-2">{c.lastActivity}</span>
        <ChevronRight className="hidden size-4 text-faint group-hover:text-ink sm:block" aria-hidden />
      </Link>
    </li>
  );

  return (
    <AppShell user={currentStaff} variant="staff">
      <div className="mx-auto max-w-[1000px]">
        <h1 className="t-h1">Proposal cases</h1>
        <p className="mt-2 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-2">
          A case links a brother and a sister once the brother has shared his intention. Each keeps their own validation;
          the case tracks what they share.
        </p>

        <section aria-labelledby="open-heading" className="mt-8 rounded-card bg-surface shadow-card ring-1 ring-line/70">
          <h2 id="open-heading" className="px-5 pt-5 pb-3 text-[15px] font-semibold sm:px-6">
            Open <span className="font-normal text-muted tabular-nums">{open.length}</span>
          </h2>
          <ul className="divide-y divide-line/80 border-t border-line/80">
            {open.map((c) => (
              <Row key={c.id} c={c} />
            ))}
          </ul>
        </section>

        <section aria-labelledby="closed-heading" className="mt-6 rounded-card bg-surface shadow-card ring-1 ring-line/70">
          <h2 id="closed-heading" className="px-5 pt-5 pb-3 text-[15px] font-semibold sm:px-6">
            Closed and completed <span className="font-normal text-muted tabular-nums">{closed.length}</span>
          </h2>
          <ul className="divide-y divide-line/80 border-t border-line/80">
            {closed.map((c) => (
              <Row key={c.id} c={c} />
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
