"use client";

import { JourneyPath } from "@/components/journey-path";
import { StageBar } from "@/components/stage-bar";
import { useStages } from "./stage-context";

export function LiveJourneyPath() {
  const { stages } = useStages();
  return <JourneyPath stages={stages} />;
}

export function MobileProgress() {
  const { stages } = useStages();
  const idx = stages.findIndex((s) => s.state === "action" || s.state === "returned");
  const focus = idx >= 0 ? idx : Math.max(0, stages.findIndex((s) => s.state !== "done"));
  const current = stages[focus];
  return (
    <a href="#journey" className="mt-5 block rounded-card bg-surface p-3.5 ring-1 ring-line/70 lg:hidden">
      <StageBar states={stages.map((s) => s.state)} />
      <span className="mt-2.5 flex items-center justify-between gap-3 text-[13px]">
        <span className="font-medium">
          Stage {focus + 1} of {stages.length}: {current?.title}
        </span>
        <span className="shrink-0 text-muted underline underline-offset-4">Your journey</span>
      </span>
    </a>
  );
}
