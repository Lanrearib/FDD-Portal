import Link from "next/link";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { LiveJourneyPath } from "./live-journey";
import { StageProvider } from "./stage-context";
import type { Persona } from "@/lib/portal-data";

/** Right-hand panel shared by every candidate page: the persistent journey (PRD §6.4). */
export function JourneyAside({ persona }: { persona: Persona }) {
  return (
    <div id="journey" className="scroll-mt-6 space-y-6">
      <LiveJourneyPath />
      <div className="rounded-card bg-sunken/70 p-4">
        <p className="text-[13.5px] font-medium">Questions about a step?</p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          Your counsellor for {persona.zone} is {persona.counsellor.name}. Replies usually arrive within two
          working days.
        </p>
        <Link
          href="/portal/messages"
          className="mt-3 inline-flex text-[13px] font-medium underline decoration-line-strong underline-offset-4 hover:decoration-ink"
        >
          Message your counsellor
        </Link>
      </div>
    </div>
  );
}

export function PortalFrame({ persona, children }: { persona: Persona; children: ReactNode }) {
  return (
    <StageProvider initial={persona.stages}>
      <AppShell
        user={{ name: persona.name, subtitle: `Profile ${persona.profileRef}` }}
        variant="candidate"
        badges={{ "/portal/messages": persona.unread }}
        aside={<JourneyAside persona={persona} />}
      >
        <div className="mx-auto max-w-[760px]">{children}</div>
      </AppShell>
    </StageProvider>
  );
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header>
      <h1 className="t-h1">{title}</h1>
      {description && <p className="mt-2 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-2">{description}</p>}
      {children}
    </header>
  );
}

export { MobileProgress } from "./live-journey";
