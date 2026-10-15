"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { StageView } from "@/components/journey-path";

/*
  Lets a page's flow update the journey panel beside it (e.g. after uploading an ID),
  so the page and its progress never disagree. In production the server would
  re-derive stages from the new workflow event instead.
*/

type Patch = Partial<Pick<StageView, "state" | "status" | "detail" | "lockReason" | "tone">>;

const Ctx = createContext<{ stages: StageView[]; update: (key: string, patch: Patch) => void } | null>(null);

export function StageProvider({ initial, children }: { initial: StageView[]; children: ReactNode }) {
  const [stages, setStages] = useState(initial);
  const update = useCallback(
    (key: string, patch: Patch) => setStages((s) => s.map((st) => (st.key === key ? { ...st, ...patch } : st))),
    [],
  );
  const value = useMemo(() => ({ stages, update }), [stages, update]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStages() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStages must be used inside StageProvider");
  return ctx;
}

/** For flows: returns a stage updater, or a no-op outside the portal. */
export function useStageUpdate() {
  return useContext(Ctx)?.update ?? (() => {});
}
