import { Archive, Plus } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader, PortalFrame } from "@/components/portal/portal-frame";
import { ButtonLink, Card, StatusPill } from "@/components/ui";
import { getPersona } from "@/lib/portal";

export const metadata: Metadata = { title: "History" };

export default async function HistoryPage() {
  const p = await getPersona();
  return (
    <PortalFrame persona={p}>
      <PageHeader
        title="History"
        description="Everything that has happened in your current proposal, and any earlier proposals on your profile."
      />

      <section aria-labelledby="current-heading" className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="current-heading" className="t-h2">
            Current proposal
          </h2>
          <span className="inline-flex h-7 items-center rounded-full bg-surface px-3 text-[12.5px] text-ink-2 ring-1 ring-line">
            <span className="font-semibold text-ink tabular-nums">{p.proposalRef}</span>
          </span>
        </div>
        <Card className="mt-4 p-5 sm:p-6">
          <ol className="relative">
            {p.updates.map((u, i) => (
              <li key={u.title + u.when} className="relative flex gap-4 pb-6 last:pb-0">
                {i < p.updates.length - 1 && <span aria-hidden className="absolute top-3 bottom-0 left-[5px] w-px bg-line" />}
                <span aria-hidden className="relative mt-1.5 size-[11px] shrink-0 rounded-full bg-ink ring-4 ring-surface" />
                <div className="min-w-0">
                  <p className="text-[14.5px] font-medium">{u.title}</p>
                  <p className="mt-0.5 text-[13.5px] text-ink-2">{u.body}</p>
                  <p className="mt-0.5 text-[12.5px] text-muted tabular-nums">{u.when}</p>
                </div>
              </li>
            ))}
            <li className="relative flex gap-4">
              <span aria-hidden className="relative mt-1.5 size-[11px] shrink-0 rounded-full bg-line-strong ring-4 ring-surface" />
              <div>
                <p className="text-[14.5px] font-medium">Proposal started</p>
                <p className="mt-0.5 text-[12.5px] text-muted">{p.profileConfirmed}</p>
              </div>
            </li>
          </ol>
        </Card>
      </section>

      <section aria-labelledby="past-heading" className="mt-10">
        <h2 id="past-heading" className="t-h2">
          Earlier proposals
        </h2>
        {p.history.length === 0 ? (
          <p className="mt-3 text-[14.5px] text-muted">This is your first proposal.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {p.history.map((h) => (
              <li key={h.ref}>
                <Card className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-full bg-sunken text-ink-2">
                        <Archive className="size-[18px]" aria-hidden />
                      </span>
                      <div>
                        <p className="text-[15px] font-semibold tabular-nums">{h.ref}</p>
                        <p className="text-[13px] text-muted">
                          {h.started} to {h.closed}
                        </p>
                      </div>
                    </div>
                    <StatusPill tone={h.tone}>{h.outcome}</StatusPill>
                  </div>
                  <p className="mt-4 text-[14px] leading-relaxed text-ink-2">{h.summary}</p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Card className="mt-10 flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <div className="max-w-[46ch]">
          <h2 className="t-h3">Starting a new proposal?</h2>
          <p className="mt-1 text-[14px] leading-relaxed text-ink-2">
            You can start one when you have no active proposal. Your profile and verified identity carry over; everything
            else starts fresh.
          </p>
        </div>
        <ButtonLink href="/portal/new-proposal" variant="secondary">
          <Plus className="size-4" aria-hidden />
          New proposal
        </ButtonLink>
      </Card>
    </PortalFrame>
  );
}
