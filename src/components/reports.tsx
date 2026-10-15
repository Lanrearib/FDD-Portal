"use client";

import { Info, Lock } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BarList, ChartCard, ColumnChart, StatTiles, StatusBar } from "./charts";
import { Card, StatusPill } from "./ui";

export type ReportScope = "zone" | "central" | "leadership";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const ALL_REGISTRATIONS = [9, 11, 15, 12, 14, 18, 22, 19, 27, 31];
const AREA_SHARE: Record<string, number> = { all: 1, "Lagos Area": 0.58, "Abuja Area": 0.23, "Accra Area": 0.12, "Douala Area": 0.07 };

const scaled = (n: number, f: number) => Math.max(0, Math.round(n * f));

const overdueTasks = [
  { who: "Emeka Nwosu", task: "Pastor’s introduction", owner: "Pastor John Ojo", days: 9, area: "Lagos Area", href: "/staff/candidates/c4" },
  { who: "Olumide Bankole", task: "Pastor’s introduction", owner: "Pastor Grace Bello", days: 8, area: "Lagos Area", href: "/staff/candidates/c11" },
  { who: "Segun Afolabi", task: "Verify email", owner: "Candidate", days: 6, area: "Lagos Area", href: "/staff/candidates/c9" },
  { who: "Halima Bako", task: "Consent letter", owner: "Candidate", days: 12, area: "Abuja Area" },
  { who: "Kojo Asare", task: "Pastor’s introduction", owner: "Pastor Kofi Asante", days: 7, area: "Accra Area" },
];

export function Reports({ scope }: { scope: ReportScope }) {
  const [period, setPeriod] = useState<6 | 10>(6);
  const [area, setArea] = useState<string>("all");
  // Zone view: Ikeja is roughly a quarter of all activity.
  const f = scope === "zone" ? 0.26 : AREA_SHARE[area];
  const scopeLabel = scope === "zone" ? "Ikeja Zone" : area === "all" ? "All Areas" : area;

  const data = useMemo(() => {
    const regs = ALL_REGISTRATIONS.map((v, i) => ({ label: MONTHS[i], value: scaled(v, f), note: i === 9 ? "to date" : undefined })).slice(-period);
    const statuses = [
      { label: "Email not verified", value: scaled(5, f) },
      { label: "Identity check pending", value: scaled(9, f) },
      { label: "Pastor introduction pending", value: scaled(20, f) },
      { label: "Further information required", value: scaled(4, f) },
      { label: "Validated, in progress", value: scaled(38, f) },
      { label: "In counselling", value: scaled(14, f) },
      { label: "On hold", value: scaled(2, f) },
    ];
    const consent = [
      { label: "Accepted", value: scaled(41, f), tone: "ok" as const },
      { label: "Under review", value: scaled(6, f), tone: "wait" as const },
      { label: "Not uploaded yet", value: scaled(12, f), tone: "neutral" as const },
      { label: "Re-upload required", value: scaled(4, f), tone: "bad" as const },
    ];
    const cases = [
      { label: "Waiting for the sister to link", value: scaled(6, f) },
      { label: "Waiting for her response", value: scaled(5, f) },
      { label: "In counselling", value: scaled(14, f) },
      { label: "On hold", value: scaled(2, f) },
    ];
    return { regs, statuses, consent, cases };
  }, [f, period]);

  const response =
    scope === "zone"
      ? [
          { label: "Pastor Samuel Adeyemi", value: 2.5 },
          { label: "Pastor Michael Ade", value: 3 },
          { label: "Pastor Grace Bello", value: 4.5 },
          { label: "Pastor John Ojo", value: 9 },
        ]
      : [
          { label: "Douala Area", value: 3.9 },
          { label: "Lagos Area", value: 4.2 },
          { label: "Abuja Area", value: 5.1 },
          { label: "Accra Area", value: 6.8 },
        ].filter((r) => area === "all" || r.label === area);

  const overdue = overdueTasks.filter((t) => (scope === "zone" ? t.area === "Lagos Area" && t.href : area === "all" || t.area === area));
  const totalActive = data.statuses.reduce((n, s) => n + s.value, 0);
  const regTotal = data.regs.reduce((n, r) => n + r.value, 0);

  const selectCls = "h-10 rounded-full bg-surface px-3.5 text-[14px] ring-1 ring-line-strong focus:ring-ink focus:outline-none";

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="t-h1">{scope === "leadership" ? "Family Development at a glance" : "Reports"}</h1>
          <p className="mt-2 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-2">
            {scope === "leadership"
              ? "Totals across the department. Names, documents and case notes are never shown here."
              : scope === "zone"
                ? "How Ikeja Zone is doing. Figures come from recorded events, not from manual counts."
                : "How every Area is doing. Figures come from recorded events, not from manual counts."}
          </p>
        </div>
        {/* Filters in one row above the charts */}
        <div className="flex flex-wrap gap-2">
          {scope !== "zone" && (
            <select aria-label="Area" value={area} onChange={(e) => setArea(e.target.value)} className={selectCls}>
              {Object.keys(AREA_SHARE).map((a) => (
                <option key={a} value={a}>
                  {a === "all" ? "All Areas" : a}
                </option>
              ))}
            </select>
          )}
          <select aria-label="Period" value={period} onChange={(e) => setPeriod(Number(e.target.value) as 6 | 10)} className={selectCls}>
            <option value={6}>Last 6 months</option>
            <option value={10}>This year</option>
          </select>
        </div>
      </div>

      {scope === "leadership" && (
        <p className="mt-5 flex items-center gap-2 rounded-full bg-sunken/80 px-4 py-2 text-[13px] text-ink-2 sm:w-fit">
          <Lock className="size-3.5" aria-hidden />
          Aggregate view for church leadership. Individual cases are visible only to counsellors.
        </p>
      )}

      <div className="mt-7">
        <StatTiles
          items={[
            { label: "Registrations", value: String(regTotal), note: `${scopeLabel}, ${period === 6 ? "last 6 months" : "this year"}` },
            { label: "Active candidates", value: String(totalActive) },
            { label: "Median Pastor response", value: scope === "zone" ? "4 days" : area === "all" ? "4.6 days" : `${response[0]?.value ?? "–"} days`, note: "Target: 7 days" },
            { label: "Overdue tasks", value: String(overdue.length), note: overdue.length ? `Oldest ${Math.max(...overdue.map((o) => o.days))} days` : undefined, bad: overdue.length > 0 },
          ]}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <ChartCard
          title="Registrations by month"
          subtitle={`${scopeLabel}. October is month to date.`}
          table={{ columns: ["Month", "Registrations"], rows: data.regs.map((r) => [r.label, r.value]) }}
        >
          <ColumnChart data={data.regs} unit="registrations" />
        </ChartCard>

        <ChartCard
          title="Where active candidates are"
          subtitle="By current status"
          table={{ columns: ["Status", "Candidates"], rows: data.statuses.map((s) => [s.label, s.value]) }}
        >
          <BarList data={data.statuses} total={totalActive} />
        </ChartCard>

        <ChartCard
          title="Pastor response time"
          subtitle={`Median days from link sent to introduction submitted, ${scope === "zone" ? "by Pastor" : "by Area"}`}
          table={{ columns: [scope === "zone" ? "Pastor" : "Area", "Median days"], rows: response.map((r) => [r.label, r.value]) }}
        >
          <BarList data={response} format={(n) => `${n} days`} highlight={(d) => d.value > 7} />
          <p className="mt-4 flex items-center gap-1.5 text-[12.5px] text-muted">
            <Info className="size-3.5" aria-hidden />
            Red marks a median over the 7-day overdue threshold.
          </p>
        </ChartCard>

        <ChartCard
          title="Parental consent letters"
          subtitle="Candidates who have reached this stage"
          table={{ columns: ["Status", "Letters"], rows: data.consent.map((c) => [c.label, c.value]) }}
        >
          <StatusBar data={data.consent} />
        </ChartCard>

        <ChartCard
          title="Active proposal cases"
          subtitle="By shared stage"
          table={{ columns: ["Stage", "Cases"], rows: data.cases.map((c) => [c.label, c.value]) }}
        >
          <BarList data={data.cases} total={data.cases.reduce((n, c) => n + c.value, 0)} />
        </ChartCard>

        <Card className="p-5 sm:p-6">
          <h2 className="t-h3">Overdue tasks</h2>
          <p className="mt-0.5 text-[13px] text-muted">Pending longer than 7 days, oldest first</p>
          {overdue.length === 0 ? (
            <p className="mt-5 text-[14px] text-ink-2">Nothing is overdue.</p>
          ) : scope === "leadership" ? (
            <ul className="mt-5 space-y-3 text-[14px]">
              {Object.entries(
                overdue.reduce<Record<string, number>>((acc, o) => ({ ...acc, [o.task]: (acc[o.task] ?? 0) + 1 }), {}),
              ).map(([task, n]) => (
                <li key={task} className="flex justify-between gap-3">
                  <span>{task}</span>
                  <span className="font-medium tabular-nums">{n}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-4 divide-y divide-line/80">
              {[...overdue].sort((a, b) => b.days - a.days).map((o) => (
                <li key={o.who} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-[13.5px]">
                  <span className="min-w-0 flex-1">
                    {o.href ? (
                      <Link href={o.href} className="font-medium underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                        {o.who}
                      </Link>
                    ) : (
                      <span className="font-medium">{o.who}</span>
                    )}
                    <span className="block text-[12.5px] text-muted">
                      {o.task}, waiting on {o.owner}
                      {scope === "central" && `, ${o.area}`}
                    </span>
                  </span>
                  <StatusPill tone="bad">{o.days} days</StatusPill>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
