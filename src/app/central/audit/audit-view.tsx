"use client";

import clsx from "clsx";
import { CircleCheck, Cog, Download, Lock, Search, ShieldCheck, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, StatusPill, type Tone } from "@/components/ui";

type Actor = "staff" | "candidate" | "pastor" | "system";
type Category = "Decision" | "Restricted access" | "Routing" | "Communication" | "Settings" | "Submission";

interface Entry {
  id: string;
  when: string;
  day: number; // days ago, for the date filter
  actor: string;
  actorType: Actor;
  action: string;
  record: string;
  category: Category;
  reason?: string;
}

const entries: Entry[] = [
  { id: "a1", when: "Today, 14:05", day: 0, actor: "Sis. Ngozi Okafor", actorType: "staff", action: "Accepted consent letter, version 2", record: "Daniel Okoro, APP-26-0402", category: "Decision" },
  { id: "a2", when: "Today, 13:48", day: 0, actor: "Pastor Mrs. Funmi Adeyemi", actorType: "staff", action: "Opened a case outside her own Zone", record: "Esi Mensah, Tema Zone", category: "Restricted access", reason: "Central oversight of an unassigned case." },
  { id: "a3", when: "Today, 12:40", day: 0, actor: "Chiamaka Eze", actorType: "candidate", action: "Uploaded identity document", record: "Chiamaka Eze, APP-26-0428", category: "Submission" },
  { id: "a4", when: "Today, 11:02", day: 0, actor: "Sis. Ngozi Okafor", actorType: "staff", action: "Viewed the restricted closure reason", record: "PC-25-0044", category: "Restricted access" },
  { id: "a5", when: "Today, 10:16", day: 0, actor: "System", actorType: "system", action: "Sent introduction link", record: "Femi Adeola, to Pastor Grace Bello", category: "Communication" },
  { id: "a6", when: "Today, 09:00", day: 0, actor: "System", actorType: "system", action: "Flagged a case as unassigned", record: "Yaw Owusu, Tema Zone", category: "Routing", reason: "No counsellor configured for Tema Zone." },
  { id: "a7", when: "Yesterday, 19:52", day: 1, actor: "Sis. Ngozi Okafor", actorType: "staff", action: "Viewed bereavement request details", record: "SR-26-027", category: "Restricted access" },
  { id: "a8", when: "Yesterday, 16:30", day: 1, actor: "Sis. Ada Nnaji", actorType: "staff", action: "Escalated the case to the central office", record: "Fola Bello, Surulere Zone", category: "Routing", reason: "Brother lives in Surulere but worships in Garki." },
  { id: "a9", when: "Yesterday, 09:00", day: 1, actor: "System", actorType: "system", action: "Skipped a scheduled reminder", record: "Kunle Ajayi, session task", category: "Communication", reason: "Task was already complete." },
  { id: "a10", when: "14 Oct, 16:20", day: 1, actor: "Sis. Ngozi Okafor", actorType: "staff", action: "Returned consent letter, version 1", record: "Tunde Bakare, APP-26-0418", category: "Decision", reason: "Missing signature and date." },
  { id: "a11", when: "13 Oct, 17:10", day: 2, actor: "Pastor Mrs. Funmi Adeyemi", actorType: "staff", action: "Changed a setting: overdue after 10 days to 7 days", record: "Settings", category: "Settings" },
  { id: "a12", when: "13 Oct, 09:00", day: 2, actor: "System", actorType: "system", action: "Sent automatic reminder 2 of 3", record: "Emeka Nwosu, to Pastor John Ojo", category: "Communication" },
  { id: "a13", when: "12 Oct, 17:02", day: 3, actor: "Zainab Yusuf", actorType: "candidate", action: "Linked a proposal with code K7Q-4MZ", record: "PC-26-0118", category: "Submission" },
  { id: "a14", when: "12 Oct, 16:05", day: 3, actor: "Pastor Michael Ade", actorType: "pastor", action: "Submitted introduction: unable to confirm", record: "Ifeoma Chukwu, APP-26-0391", category: "Submission" },
  { id: "a15", when: "11 Oct, 15:30", day: 4, actor: "Pastor Mrs. Funmi Adeyemi", actorType: "staff", action: "Bulk uploaded counsellors: 2 imported, 1 skipped", record: "Counsellor directory", category: "Routing" },
  { id: "a16", when: "10 Oct, 11:05", day: 5, actor: "Sis. Ngozi Okafor", actorType: "staff", action: "Confirmed appointment for Thu 23 Oct, 10:00", record: "Tunde Bakare, APP-26-0418", category: "Decision" },
  { id: "a17", when: "8 Oct, 07:12", day: 7, actor: "Pastor Grace Bello", actorType: "pastor", action: "Opened introduction link and verified email", record: "Olumide Bankole, APP-26-0389", category: "Submission" },
  { id: "a18", when: "2 Oct, 13:10", day: 13, actor: "Sis. Ngozi Okafor", actorType: "staff", action: "Signed off counselling session 1", record: "PC-26-0102", category: "Decision" },
  { id: "a19", when: "29 Sep, 10:00", day: 16, actor: "Bro. Femi Ogun", actorType: "staff", action: "Reassigned the Pastor to Pastor Chidi Eze", record: "Lekki Zone candidate", category: "Routing", reason: "Original Pastor travelling until November." },
];

const actorMeta: Record<Actor, { icon: typeof UserRound; cls: string; label: string }> = {
  staff: { icon: ShieldCheck, cls: "bg-info-soft text-info", label: "Staff" },
  candidate: { icon: UserRound, cls: "bg-sunken text-ink-2", label: "Candidate" },
  pastor: { icon: CircleCheck, cls: "bg-ok-soft text-ok", label: "Pastor" },
  system: { icon: Cog, cls: "bg-sunken text-muted", label: "System" },
};

const categoryTone: Record<Category, Tone> = {
  Decision: "info",
  "Restricted access": "action",
  Routing: "wait",
  Communication: "neutral",
  Settings: "neutral",
  Submission: "ok",
};

export function AuditView() {
  const [query, setQuery] = useState("");
  const [actor, setActor] = useState<"all" | Actor>("all");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [range, setRange] = useState(30);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter(
      (e) =>
        e.day <= range &&
        (actor === "all" || e.actorType === actor) &&
        (category === "all" || e.category === category) &&
        (!q || `${e.actor} ${e.action} ${e.record} ${e.reason ?? ""}`.toLowerCase().includes(q)),
    );
  }, [query, actor, category, range]);

  const exportCsv = () => {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = ["when,actor,actor_type,category,action,record,reason", ...list.map((e) => [e.when, e.actor, e.actorType, e.category, e.action, e.record, e.reason ?? ""].map(esc).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: "audit-log.csv" }).click();
    URL.revokeObjectURL(url);
  };

  const selectCls = "h-10 rounded-full bg-frame px-3.5 text-[14px] ring-1 ring-line focus:ring-ink focus:outline-none";

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="t-h1">Audit log</h1>
          <p className="mt-2 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-2">
            Every decision, change, message and look at restricted information, with who did it and when. Records can’t be
            edited or deleted.
          </p>
        </div>
        <button type="button" onClick={exportCsv} className="inline-flex h-10 items-center gap-2 rounded-full bg-surface px-5 text-[14px] font-medium ring-1 ring-line-strong hover:bg-sunken">
          <Download className="size-4" aria-hidden />
          Export {list.length} entries
        </button>
      </div>

      <Card className="mt-8 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 sm:px-6">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">Search the audit log</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Person, action or reference…" className="h-10 w-full rounded-full bg-frame pr-4 pl-10 text-[14px] ring-1 ring-line placeholder:text-faint focus:bg-surface focus:ring-ink focus:outline-none" />
          </label>
          <select aria-label="Who" value={actor} onChange={(e) => setActor(e.target.value as typeof actor)} className={selectCls}>
            <option value="all">Everyone</option>
            {(Object.keys(actorMeta) as Actor[]).map((a) => (
              <option key={a} value={a}>
                {actorMeta[a].label}
              </option>
            ))}
          </select>
          <select aria-label="Type of event" value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className={selectCls}>
            <option value="all">All events</option>
            {(Object.keys(categoryTone) as Category[]).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select aria-label="Period" value={range} onChange={(e) => setRange(Number(e.target.value))} className={selectCls}>
            <option value={1}>Today and yesterday</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>

        <ol className="divide-y divide-line/80 border-t border-line/80">
          {list.map((e) => {
            const a = actorMeta[e.actorType];
            const Icon = a.icon;
            return (
              <li key={e.id} className="grid gap-x-4 gap-y-1.5 px-5 py-3.5 sm:grid-cols-[130px_minmax(0,1fr)_auto] sm:px-6">
                <p className="text-[12.5px] text-muted tabular-nums sm:pt-1">{e.when}</p>
                <div className="flex min-w-0 gap-3">
                  <span className={clsx("flex size-8 shrink-0 items-center justify-center rounded-full", a.cls)}>
                    <Icon className="size-4" aria-hidden />
                    <span className="sr-only">{a.label}</span>
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px]">
                      <span className="font-medium">{e.actor}</span> <span className="text-ink-2">{e.action.charAt(0).toLowerCase() + e.action.slice(1)}</span>
                    </p>
                    <p className="text-[13px] text-muted">{e.record}</p>
                    {e.reason && <p className="mt-0.5 text-[13px] text-ink-2">Reason: {e.reason}</p>}
                  </div>
                </div>
                <div className="sm:pt-0.5">
                  <StatusPill tone={categoryTone[e.category]}>
                    {e.category === "Restricted access" && <Lock className="-ml-0.5 size-3" aria-hidden />}
                    {e.category}
                  </StatusPill>
                </div>
              </li>
            );
          })}
        </ol>
        {list.length === 0 && <p className="px-6 py-10 text-center text-[14px] text-muted">Nothing matches these filters.</p>}
      </Card>
    </div>
  );
}
