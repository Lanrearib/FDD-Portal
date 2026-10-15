import clsx from "clsx";
import type { StageState } from "./journey-path";

const fill: Record<StageState, string> = {
  done: "bg-ink",
  returned: "bg-bad",
  action: "bg-peach",
  waiting: "bg-wait/60",
  locked: "bg-line",
};

/** Compact segmented progress: one segment per stage, coloured like the journey path. */
export function StageBar({
  states,
  className,
  thin = false,
}: {
  states: StageState[];
  className?: string;
  thin?: boolean;
}) {
  return (
    <span className={clsx("flex gap-[3px]", className)} aria-hidden>
      {states.map((s, i) => (
        <span
          key={i}
          className={clsx("flex-1 rounded-full", thin ? "h-1" : "h-1.5", fill[s])}
        />
      ))}
    </span>
  );
}
