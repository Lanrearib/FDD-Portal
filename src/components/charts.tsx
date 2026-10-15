"use client";

import clsx from "clsx";
import { Table2, BarChart3 } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { Card } from "./ui";

/*
  Small chart kit. Rules (dataviz method): single-series charts use one ink colour;
  status colours appear only where the data is a status; thin bars with 4px rounded
  data-ends; hairline gridlines; a hover readout on every mark; a table view always.
*/

export function ChartCard({
  title,
  subtitle,
  table,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  table: { columns: string[]; rows: (string | number)[][] };
  children: ReactNode;
  className?: string;
}) {
  const [asTable, setAsTable] = useState(false);
  return (
    <Card className={clsx("p-5 sm:p-6", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="t-h3">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={() => setAsTable((t) => !t)}
          aria-pressed={asTable}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium text-ink-2 ring-1 ring-line hover:bg-sunken"
        >
          {asTable ? <BarChart3 className="size-3.5" aria-hidden /> : <Table2 className="size-3.5" aria-hidden />}
          {asTable ? "Show chart" : "Show as table"}
        </button>
      </div>
      <div className="mt-5">
        {asTable ? (
          <table className="w-full text-left text-[13.5px]">
            <thead className="text-[12.5px] text-muted">
              <tr className="border-b border-line">
                {table.columns.map((c, i) => (
                  <th key={c} scope="col" className={clsx("pb-2 font-normal", i > 0 && "text-right")}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {table.rows.map((r) => (
                <tr key={String(r[0])}>
                  {r.map((v, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="py-2 font-normal">
                        {v}
                      </th>
                    ) : (
                      <td key={i} className="py-2 text-right tabular-nums">
                        {v}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          children
        )}
      </div>
    </Card>
  );
}

/** Vertical columns for change over time; the latest value is labelled directly. */
export function ColumnChart({ data, unit }: { data: { label: string; value: number; note?: string }[]; unit: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);
  const nice = Math.ceil(max / 10) * 10;
  const ticks = [0, nice / 2, nice];
  const H = 160;
  return (
    <div className="relative" onMouseLeave={() => setHover(null)}>
      <div className="relative ml-7" style={{ height: H }}>
        {ticks.map((t) => (
          <div key={t} className="absolute inset-x-0 border-t border-line" style={{ bottom: (t / nice) * H }}>
            <span className="absolute -top-2 -left-7 w-6 text-right text-[11px] text-muted tabular-nums">{t}</span>
          </div>
        ))}
        <div className="absolute inset-0 flex items-end">
          {data.map((d, i) => {
            const last = i === data.length - 1;
            return (
              <button
                key={d.label}
                type="button"
                className="group relative flex h-full flex-1 items-end justify-center focus:outline-none"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                aria-label={`${d.label}: ${d.value} ${unit}${d.note ? `, ${d.note}` : ""}`}
              >
                <span
                  className={clsx("w-[min(24px,60%)] rounded-t-[4px] transition-opacity", hover !== null && hover !== i ? "bg-ink/35" : "bg-ink", "group-focus-visible:ring-2 group-focus-visible:ring-peach")}
                  style={{ height: Math.max(2, (d.value / nice) * H) }}
                />
                {last && hover === null && (
                  <span className="absolute text-[12px] font-semibold tabular-nums" style={{ bottom: (d.value / nice) * H + 4 }}>
                    {d.value}
                  </span>
                )}
                {hover === i && (
                  <span role="tooltip" className="pointer-events-none absolute z-10 rounded-[10px] bg-ink px-2.5 py-1.5 text-left text-[12px] whitespace-nowrap text-white shadow-pop" style={{ bottom: (d.value / nice) * H + 8 }}>
                    <span className="block font-semibold">{d.value} {unit}</span>
                    <span className="block text-white/70">
                      {d.label}
                      {d.note ? `, ${d.note}` : ""}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-2 ml-7 flex">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[11.5px] text-muted">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Horizontal bars for comparing categories; values sit at the bar end. */
export function BarList({
  data,
  format = (n) => String(n),
  highlight,
  total,
}: {
  data: { label: string; value: number; sub?: string }[];
  format?: (n: number) => string;
  highlight?: (d: { label: string; value: number }) => boolean;
  total?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="space-y-3" onMouseLeave={() => setHover(null)}>
      {data.map((d, i) => {
        const hi = highlight?.(d);
        return (
          <li key={d.label} onMouseEnter={() => setHover(i)} className="relative">
            <div className="flex items-baseline justify-between gap-3 text-[13px]">
              <span className="min-w-0 truncate">
                {d.label}
                {d.sub && <span className="text-muted"> {d.sub}</span>}
              </span>
              <span className={clsx("shrink-0 font-medium tabular-nums", hi && "text-bad")}>{format(d.value)}</span>
            </div>
            <div className="mt-1.5 h-2.5 rounded-full bg-sunken" aria-hidden>
              <div className={clsx("h-2.5 rounded-full transition-opacity", hi ? "bg-bad" : "bg-ink", hover !== null && hover !== i && "opacity-35")} style={{ width: `${Math.max(1.5, (d.value / max) * 100)}%` }} />
            </div>
            {hover === i && total ? (
              <span role="tooltip" className="pointer-events-none absolute -top-8 right-0 z-10 rounded-[10px] bg-ink px-2.5 py-1 text-[12px] whitespace-nowrap text-white shadow-pop">
                {Math.round((d.value / total) * 100)}% of {total}
              </span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

// Chart steps validated with the dataviz palette script: amber is lighter than red so the two
// stay distinct under colour-blindness; keep red and amber apart in segment order.
const statusFill = { ok: "bg-ok", wait: "bg-[#e3a41c]", bad: "bg-bad", neutral: "bg-faint" } as const;

/** One proportion bar for statuses; status colours, a legend, and a gap between segments. */
export function StatusBar({ data }: { data: { label: string; value: number; tone: keyof typeof statusFill }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const id = useId();
  const total = data.reduce((n, d) => n + d.value, 0);
  return (
    <div>
      <div className="relative flex h-4 gap-[2px]" role="img" aria-labelledby={id} onMouseLeave={() => setHover(null)}>
        {data.map((d, i) => (
          <span
            key={d.label}
            onMouseEnter={() => setHover(i)}
            className={clsx("h-full first:rounded-l-[4px] last:rounded-r-[4px] transition-opacity", statusFill[d.tone], hover !== null && hover !== i && "opacity-40")}
            style={{ width: `${(d.value / total) * 100}%` }}
          />
        ))}
        {hover !== null && (
          <span role="tooltip" className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 rounded-[10px] bg-ink px-2.5 py-1 text-[12px] whitespace-nowrap text-white shadow-pop">
            {data[hover].label}: {data[hover].value} ({Math.round((data[hover].value / total) * 100)}%)
          </span>
        )}
      </div>
      <ul id={id} className="mt-4 grid gap-2 sm:grid-cols-2">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-[13px]">
            <span className={clsx("size-2.5 rounded-[3px]", statusFill[d.tone])} aria-hidden />
            <span className="flex-1">{d.label}</span>
            <span className="font-medium tabular-nums">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StatTiles({ items }: { items: { label: string; value: string; note?: string; bad?: boolean }[] }) {
  return (
    <section aria-label="Headline figures" className="overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line/70">
      <ul className="grid grid-cols-2 gap-px bg-line/80 lg:grid-cols-4">
        {items.map((m) => (
          <li key={m.label} className="bg-surface px-4 py-4 sm:px-5">
            <p className="text-[12.5px] leading-snug text-muted">{m.label}</p>
            <p className="mt-2 text-[28px] leading-none font-semibold tracking-[-0.02em] tabular-nums">{m.value}</p>
            {m.note && <p className={clsx("mt-1.5 text-[12px]", m.bad ? "font-medium text-bad" : "text-muted")}>{m.note}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
