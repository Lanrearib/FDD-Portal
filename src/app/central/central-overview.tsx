"use client";

import clsx from "clsx";
import { ArrowUpRight, Globe, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Field, Select, Textarea } from "@/components/form";
import { Modal } from "@/components/modal";
import { useToast } from "@/components/toast";
import { Avatar, Button, ButtonLink, Card, StatusPill } from "@/components/ui";
import { areaSummaries, escalations as initialEscalations, unassigned as initialUnassigned, type UnassignedCase } from "@/lib/central-data";
import { centralStaff, counsellors } from "@/lib/staff-directory";

const metrics = [
  { label: "Active candidates", value: 92 },
  { label: "Pending Pastor introductions", value: 20, note: "4 overdue", bad: true },
  { label: "Overdue actions", value: 5, note: "Oldest 12 days", bad: true },
  { label: "Unassigned", value: 2, note: "Tema Zone", bad: true },
  { label: "Active proposal cases", value: 31 },
  { label: "In counselling", value: 14, note: "7 couples" },
  { label: "Completed", value: 47, note: "This year" },
  { label: "Open escalations", value: 2 },
];

export function CentralOverview() {
  const [pending, setPending] = useState(initialUnassigned);
  const [escalations, setEscalations] = useState(initialEscalations);
  const [assigning, setAssigning] = useState<UnassignedCase | null>(null);
  const [handling, setHandling] = useState<(typeof initialEscalations)[number] | null>(null);
  const [choice, setChoice] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast, toastNode } = useToast();

  const reset = () => {
    setChoice("");
    setReason("");
    setError(null);
  };

  const aside = (
    <div className="space-y-8">
      <section aria-labelledby="esc-heading">
        <h2 id="esc-heading" className="t-h2">
          Escalated to you
        </h2>
        <p className="mt-1 text-[13px] text-muted">From local counsellors, oldest last</p>
        {escalations.length === 0 ? (
          <p className="mt-5 rounded-[14px] bg-sunken/70 p-4 text-[14px] text-ink-2">Nothing waiting. New escalations appear here.</p>
        ) : (
          <ul className="mt-5 space-y-2.5">
            {escalations.map((e) => (
              <li key={e.id} className="rounded-[14px] bg-surface p-3.5 ring-1 ring-line/70">
                <div className="flex items-center gap-2.5">
                  <Avatar name={e.name} size={30} />
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-medium">{e.name}</p>
                    <p className="text-[12.5px] text-muted">
                      {e.zone}, {e.when}
                    </p>
                  </div>
                </div>
                <p className="mt-2.5 text-[13px] leading-relaxed text-ink-2">{e.reason}</p>
                <p className="mt-1.5 text-[12.5px] text-muted">Escalated by {e.from}</p>
                <Button size="sm" variant="secondary" className="mt-3" onClick={() => { reset(); setHandling(e); }}>
                  Decide
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="load-heading">
        <div className="flex items-baseline justify-between">
          <h2 id="load-heading" className="t-h3">
            Counsellor caseloads
          </h2>
          <Link href="/central/counsellors" className="text-[13px] font-medium text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink">
            Manage
          </Link>
        </div>
        <ul className="mt-3 space-y-2.5">
          {counsellors
            .filter((c) => c.role !== "Central Marriage Counsellor")
            .sort((a, b) => b.caseload - a.caseload)
            .map((c) => (
              <li key={c.id} className="text-[13px]">
                <div className="flex justify-between gap-2">
                  <span className="truncate">{c.name}</span>
                  <span className="text-muted tabular-nums">{c.caseload}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-line/70" aria-hidden>
                  <div className="h-1.5 rounded-full bg-ink" style={{ width: `${(c.caseload / 30) * 100}%` }} />
                </div>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );

  return (
    <AppShell user={centralStaff} variant="central" aside={aside}>
      <div className="mx-auto max-w-[920px]">
        <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-surface px-3 text-[12.5px] text-ink-2 ring-1 ring-line">
          <Globe className="size-3.5 text-muted" aria-hidden />
          West and Central Africa, all Areas
        </span>
        <h1 className="t-h1 mt-5">Good afternoon, Pastor Funmi</h1>
        <p className="mt-2 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-2">
          Two new cases have no counsellor and two escalations are waiting for your decision.
        </p>

        {pending.length > 0 && (
          <Card className="mt-7 overflow-hidden ring-bad/30">
            <div className="flex flex-wrap items-center gap-3 border-b border-line/80 bg-bad-soft/50 px-5 py-3 sm:px-6">
              <TriangleAlert className="size-4 text-bad" aria-hidden />
              <p className="flex-1 text-[14px] font-medium">Tema Zone has no counsellor assigned</p>
              <ButtonLink href="/central/counsellors" size="sm" variant="secondary">
                Set up coverage
              </ButtonLink>
            </div>
            <ul className="divide-y divide-line/80">
              {pending.map((u) => (
                <li key={u.id} className="flex flex-wrap items-center gap-4 px-5 py-4 sm:px-6">
                  <Avatar name={u.name} size={36} />
                  <div className="min-w-[180px] flex-1">
                    <p className="text-[14.5px] font-medium">{u.name}</p>
                    <p className="text-[12.5px] text-muted">
                      {u.journey}, {u.zone}. Registered {u.registered}.
                    </p>
                  </div>
                  <StatusPill tone="bad">Unassigned {u.waiting}</StatusPill>
                  <Button size="sm" onClick={() => { reset(); setAssigning(u); }}>
                    Assign
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        )}

        <section aria-label="Totals across all Areas" className="mt-6 overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line/70">
          <ul className="grid grid-cols-2 gap-px bg-line/80 sm:grid-cols-4">
            {metrics.map((m) => (
              <li key={m.label} className="bg-surface px-4 py-3 sm:px-5 sm:py-4">
                <p className="text-[12.5px] leading-snug text-muted">{m.label}</p>
                <p className="mt-1.5 text-[24px] leading-none font-semibold tracking-[-0.02em] tabular-nums sm:mt-2 sm:text-[28px]">
                  {m.label === "Unassigned" ? pending.length : m.label === "Open escalations" ? escalations.length : m.value}
                </p>
                {m.note && <p className={clsx("mt-1.5 text-[12px]", m.bad ? "font-medium text-bad" : "text-muted")}>{m.note}</p>}
              </li>
            ))}
          </ul>
        </section>

        <Card className="mt-6 overflow-hidden">
          <div className="flex items-baseline justify-between px-5 pt-5 sm:px-6">
            <h2 className="t-h2">By Area</h2>
            <Link href="/central/reports" className="flex items-center gap-1 text-[13px] font-medium text-ink-2 hover:text-ink">
              Full reports
              <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[14px]">
              <thead className="border-y border-line/80 bg-frame/60 text-[12.5px] text-muted">
                <tr>
                  <th scope="col" className="px-5 py-2.5 font-normal sm:px-6">Area</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-normal">Active</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-normal">Pending Pastor</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-normal">Overdue</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-normal">Unassigned</th>
                  <th scope="col" className="px-5 py-2.5 text-right font-normal sm:px-6">Counsellors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/80">
                {areaSummaries.map((a) => {
                  const un = a.area === "Accra Area" ? pending.length : a.unassigned;
                  return (
                    <tr key={a.area}>
                      <th scope="row" className="px-5 py-3 font-medium sm:px-6">
                        {a.area}
                        <span className="block text-[12.5px] font-normal text-muted">{a.region}</span>
                      </th>
                      <td className="px-3 py-3 text-right tabular-nums">{a.active}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{a.pendingPastor}</td>
                      <td className={clsx("px-3 py-3 text-right tabular-nums", a.overdue > 0 && "font-medium text-bad")}>{a.overdue}</td>
                      <td className={clsx("px-3 py-3 text-right tabular-nums", un > 0 && "font-medium text-bad")}>{un}</td>
                      <td className="px-5 py-3 text-right tabular-nums sm:px-6">{a.counsellors}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-5 text-[13px] leading-relaxed text-muted">
          You can open any case across West and Central Africa. Each time you do, it’s recorded in the audit log.
        </p>
      </div>

      <Modal
        open={!!assigning}
        onClose={() => setAssigning(null)}
        title={`Assign ${assigning?.name ?? ""}`}
        description="Until Tema Zone has its own counsellor, choose someone to take this case. They’ll be notified straight away."
        footer={
          <>
            <Button variant="ghost" onClick={() => setAssigning(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!choice) return setError("Choose a counsellor.");
                if (reason.trim().length < 10) return setError("A reason is required.");
                setPending((p) => p.filter((x) => x.id !== assigning!.id));
                toast(`${assigning!.name} assigned to ${choice.split(" (")[0]}.`);
                setAssigning(null);
              }}
            >
              Assign case
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Field label="Counsellor">
            <Select value={choice} onChange={(e) => { setChoice(e.target.value); setError(null); }}>
              <option value="">Choose one</option>
              {counsellors.map((c) => (
                <option key={c.id}>{`${c.name} (${c.scope}, ${c.caseload} cases)`}</option>
              ))}
            </Select>
          </Field>
          <Field label="Reason" hint="Recorded in the routing history." error={error}>
            <Textarea rows={3} value={reason} onChange={(e) => { setReason(e.target.value); setError(null); }} placeholder="For example, nearest counsellor while Tema Zone is unstaffed" />
          </Field>
        </div>
      </Modal>

      <Modal
        open={!!handling}
        onClose={() => setHandling(null)}
        title={`Decide on ${handling?.name ?? ""}`}
        description={handling?.reason}
        footer={
          <>
            <Button variant="ghost" onClick={() => setHandling(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!choice) return setError("Choose what happens next.");
                if (reason.trim().length < 10) return setError("A reason is required.");
                setEscalations((es) => es.filter((x) => x.id !== handling!.id));
                toast("Decision recorded. Both counsellors have been told.");
                setHandling(null);
              }}
            >
              Record decision
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Field label="What happens next">
            <Select value={choice} onChange={(e) => { setChoice(e.target.value); setError(null); }}>
              <option value="">Choose one</option>
              <option>Keep with the central office</option>
              <option>Return to the local counsellor</option>
              <option>Reassign to another counsellor</option>
            </Select>
          </Field>
          <Field label="Reason" hint="Shared with the counsellor who escalated it." error={error}>
            <Textarea rows={3} value={reason} onChange={(e) => { setReason(e.target.value); setError(null); }} />
          </Field>
        </div>
      </Modal>
      {toastNode}
    </AppShell>
  );
}
