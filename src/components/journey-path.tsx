import clsx from "clsx";
import { Check, Lock } from "lucide-react";
import Link from "next/link";
import { StatusPill, type Tone } from "./ui";

export type StageState = "done" | "action" | "returned" | "waiting" | "locked";

export interface StageView {
  key: string;
  title: string;
  state: StageState;
  /** PRD §6.4 status vocabulary, e.g. "Pending Pastor". */
  status: string;
  /** One line of context: a date, a name, what happened. */
  detail?: string;
  /** For locked stages: what must happen first. */
  lockReason?: string;
  /** Overrides the status colour, e.g. neutral for a closed proposal. */
  tone?: Tone;
  /** Who the stage is waiting on, when it isn't the candidate. */
  waitingOn?: string;
  href?: string;
}

const stateTone: Record<StageState, Tone> = {
  done: "ok",
  action: "action",
  returned: "bad",
  waiting: "wait",
  locked: "neutral",
};

function Node({ state, index }: { state: StageState; index: number }) {
  const base = "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold";
  if (state === "done")
    return (
      <span className={clsx(base, "bg-ink text-white")}>
        <Check className="size-3.5" strokeWidth={3} aria-hidden />
      </span>
    );
  if (state === "action" || state === "returned")
    return (
      <span
        className={clsx(
          base,
          "pulse-ring text-white",
          state === "returned" ? "bg-bad" : "bg-peach",
        )}
      >
        {index + 1}
      </span>
    );
  if (state === "waiting")
    return <span className={clsx(base, "bg-wait-soft text-wait ring-2 ring-wait/40")}>{index + 1}</span>;
  return (
    <span className={clsx(base, "border border-dashed border-line-strong bg-frame text-faint")}>
      <Lock className="size-3" aria-hidden />
    </span>
  );
}

export function JourneyPath({
  stages,
  className,
  title = "Your journey",
}: {
  stages: StageView[];
  className?: string;
  title?: string;
}) {
  const doneCount = stages.filter((s) => s.state === "done").length;
  // Focus the stage that needs the candidate; otherwise the first incomplete one.
  const actionIndex = stages.findIndex((s) => s.state === "action" || s.state === "returned");
  const focusIndex = actionIndex >= 0 ? actionIndex : stages.findIndex((s) => s.state !== "done");

  return (
    <div className={className}>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h2 className="t-h2">{title}</h2>
          <p className="mt-1 text-[13px] text-muted">
            {doneCount} of {stages.length} stages complete
          </p>
        </div>
        <div
          className="relative size-11"
          role="img"
          aria-label={`${Math.round((doneCount / stages.length) * 100)}% complete`}
        >
          <svg viewBox="0 0 44 44" className="size-11 -rotate-90">
            <circle cx="22" cy="22" r="18" fill="none" stroke="var(--color-line)" strokeWidth="4" />
            {doneCount > 0 && <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${(doneCount / stages.length) * 113.1} 113.1`}
            />}
          </svg>
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold tabular-nums"
          >
            {doneCount}/{stages.length}
          </span>
        </div>
      </div>

      <ol className="relative">
        {stages.map((stage, i) => {
          const isFocus = i === focusIndex;
          const isLast = i === stages.length - 1;
          const nextDone = stages[i + 1]?.state === "done";
          return (
            <li key={stage.key} className="relative flex gap-3.5 pb-1">
              {/* connector */}
              {!isLast && (
                <span
                  aria-hidden
                  className={clsx(
                    "absolute top-8 bottom-0 left-[13.5px] w-px",
                    stage.state === "done" && nextDone
                      ? "bg-ink"
                      : stage.state === "done"
                        ? "bg-line-strong"
                        : "border-l border-dashed border-line-strong",
                  )}
                />
              )}
              <div className="pt-0.5">
                <Node state={stage.state} index={i} />
              </div>
              <div
                className={clsx(
                  "mb-3 min-w-0 flex-1 rounded-[14px] px-3 py-2 -mt-1",
                  isFocus && "bg-surface shadow-card ring-1 ring-line/70",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <p
                    className={clsx(
                      "text-[14px] font-medium leading-snug",
                      stage.state === "locked" ? "text-muted" : "text-ink",
                    )}
                  >
                    <span className="sr-only">Stage {i + 1}: </span>
                    {stage.title}
                  </p>
                  {stage.state !== "locked" && (
                    <StatusPill tone={stage.tone ?? stateTone[stage.state]}>{stage.status}</StatusPill>
                  )}
                </div>
                {stage.state === "locked" ? (
                  <p className="mt-0.5 text-[12.5px] leading-snug text-faint">
                    {stage.lockReason}
                  </p>
                ) : (
                  stage.detail && (
                    <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{stage.detail}</p>
                  )
                )}
                {isFocus && stage.href && (
                  <Link
                    href={stage.href}
                    className="mt-2 inline-flex text-[13px] font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
                  >
                    {stage.state === "waiting" ? "See details" : "Go to this step"}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
