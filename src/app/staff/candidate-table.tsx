"use client";

import clsx from "clsx";
import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { StageBar } from "@/components/stage-bar";
import { Avatar, StatusPill } from "@/components/ui";
import type { CandidateRow } from "./data";

type Filter = "all" | "needs_you" | "overdue" | "pastor" | "counselling";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "needs_you", label: "Needs you" },
  { key: "overdue", label: "Overdue" },
  { key: "pastor", label: "Waiting on Pastor" },
  { key: "counselling", label: "In counselling" },
];

const waitingStyle: Record<CandidateRow["waitingOn"], string> = {
  You: "bg-ink text-white",
  Candidate: "bg-sunken text-ink-2",
  Pastor: "bg-wait-soft text-wait",
  Sister: "bg-lilac-soft text-[#5b4aa6]",
};

export function CandidateTable({ rows, full = false }: { rows: CandidateRow[]; full?: boolean }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [journey, setJourney] = useState<"all" | "Brother" | "Sister">("all");
  const [sort, setSort] = useState<"activity" | "name" | "stage">("activity");

  const counts = useMemo(() => {
    const c = { all: rows.length } as Record<Filter, number>;
    for (const f of filters.slice(1)) c[f.key] = rows.filter((r) => r.tags.includes(f.key as never)).length;
    return c;
  }, [rows]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = rows.filter(
      (r) =>
        (filter === "all" || r.tags.includes(filter as never)) &&
        (!q ||
          r.name.toLowerCase().includes(q) ||
          r.ref.toLowerCase().includes(q) ||
          r.pastor.toLowerCase().includes(q)) &&
        (journey === "all" || r.journey === journey),
    );
    if (sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "stage") return [...list].sort((a, b) => b.stageIndex / b.stages.length - a.stageIndex / a.stages.length);
    return list;
  }, [rows, filter, query, journey, sort]);

  return (
    <section
      aria-labelledby="candidates-heading"
      className="@container rounded-card bg-surface shadow-card ring-1 ring-line/70"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-6">
        <h2 id="candidates-heading" className="t-h2">
          {full ? "All candidates in Ikeja Zone" : "Your candidates"}
        </h2>
        <label className="relative w-full sm:w-64">
          <span className="sr-only">Search candidates</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, reference or Pastor…"
            className="h-10 w-full rounded-full bg-frame pr-4 pl-10 text-[14px] ring-1 ring-line placeholder:text-faint focus:bg-surface focus:ring-ink focus:outline-none"
          />
        </label>
      </div>

      <div
        role="tablist"
        aria-label="Filter candidates"
        className="scroll-thin mt-4 flex gap-1.5 overflow-x-auto px-5 pb-1 sm:px-6"
      >
        {filters.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setFilter(f.key)}
              className={clsx(
                "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium transition-colors",
                active ? "bg-ink text-white" : "text-ink-2 ring-1 ring-line hover:bg-sunken",
              )}
            >
              {f.label}
              <span className={clsx("tabular-nums", active ? "text-white/70" : "text-faint")}>
                {counts[f.key]}
              </span>
            </button>
          );
        })}
      </div>

      {full && (
        <div className="mt-3 flex flex-wrap items-center gap-3 px-5 sm:px-6">
          <label className="flex items-center gap-2 text-[13px] text-muted">
            Journey
            <select value={journey} onChange={(e) => setJourney(e.target.value as typeof journey)} className="h-8 rounded-full bg-frame px-3 text-[13px] text-ink ring-1 ring-line focus:ring-ink focus:outline-none">
              <option value="all">All</option>
              <option>Brother</option>
              <option>Sister</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-[13px] text-muted">
            Sort by
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="h-8 rounded-full bg-frame px-3 text-[13px] text-ink ring-1 ring-line focus:ring-ink focus:outline-none">
              <option value="activity">Last activity</option>
              <option value="stage">Furthest along</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
      )}

      {/* Column headings (wide screens) */}
      <div className="mt-4 hidden gap-4 border-y border-line/80 bg-frame/60 px-6 py-2.5 text-[12.5px] text-muted @min-[560px]:grid @min-[560px]:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_92px] @min-[820px]:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)_96px_112px_20px]">
        <span>Candidate</span>
        <span>Current stage</span>
        <span>Waiting on</span>
        <span className="hidden @min-[820px]:block">Last activity</span>
        <span className="hidden @min-[820px]:block" />
      </div>

      <ul className="divide-y divide-line/80 border-t border-line/80 @min-[560px]:border-t-0">
        {visible.map((r) => (
          <li key={r.id}>
            <Link
              href={`/staff/candidates/${r.id}`}
              className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 px-5 py-4 transition-colors hover:bg-frame/70 sm:px-6 @min-[560px]:items-center @min-[560px]:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_92px] @min-[820px]:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)_96px_112px_20px]"
            >
              {/* Candidate */}
              <span className="flex min-w-0 items-center gap-3">
                <Avatar name={r.name} size={36} />
                <span className="min-w-0">
                  <span className="block truncate text-[14.5px] font-medium">{r.name}</span>
                  <span className="block truncate text-[12.5px] text-muted">
                    {r.journey}, <span className="tabular-nums">{r.ref}</span>
                  </span>
                  <span className="hidden truncate text-[12px] text-muted @min-[560px]:block @min-[820px]:hidden">
                    {r.overdue ? <span className="font-medium text-bad">Overdue {r.overdue}</span> : r.lastActivity}
                  </span>
                </span>
              </span>

              {/* Waiting on (mobile: top right) */}
              <span className="justify-self-end @min-[560px]:hidden">
                <span className={clsx("inline-flex h-6 items-center rounded-full px-2.5 text-[12px] font-medium", waitingStyle[r.waitingOn])}>
                  {r.waitingOn}
                </span>
              </span>

              {/* Stage */}
              <span className="col-span-2 min-w-0 @min-[560px]:col-span-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13.5px]">
                    <span className="text-muted tabular-nums">
                      {r.stageIndex + 1}/{r.stages.length}
                    </span>{" "}
                    {r.stageName}
                  </span>
                  <StatusPill tone={r.statusTone} className="hidden @min-[400px]:inline-flex @min-[560px]:hidden @min-[960px]:inline-flex">
                    {r.status}
                  </StatusPill>
                </span>
                <StageBar states={r.stages} thin className="mt-2" />
              </span>

              {/* Waiting on (desktop) */}
              <span className="hidden @min-[560px]:block">
                <span className={clsx("inline-flex h-6 items-center rounded-full px-2.5 text-[12px] font-medium", waitingStyle[r.waitingOn])}>
                  {r.waitingOn}
                </span>
              </span>

              {/* Last activity */}
              <span className="col-span-2 flex items-center justify-between text-[13px] @min-[560px]:hidden @min-[820px]:col-span-1 @min-[820px]:block">
                <span className="text-ink-2">{r.lastActivity}</span>
                {r.overdue && (
                  <span className="block text-[12px] font-medium text-bad">Overdue {r.overdue}</span>
                )}
              </span>

              <ChevronRight className="hidden size-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ink @min-[820px]:block" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-[14.5px] font-medium">No candidates match</p>
          <p className="mt-1 text-[13.5px] text-muted">
            Try a different name or reference, or switch back to All.
          </p>
        </div>
      )}

      {!full && <div className="flex items-center justify-between border-t border-line/80 px-5 py-3.5 text-[13px] text-muted sm:px-6">
        <span>
          Showing {visible.length} of {rows.length} most recently active
        </span>
        <Link href="/staff/candidates" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
          Open full list
        </Link>
      </div>}
    </section>
  );
}
