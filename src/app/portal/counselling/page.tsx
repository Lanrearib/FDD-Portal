import clsx from "clsx";
import { Check, Clock, Lock, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader, PortalFrame } from "@/components/portal/portal-frame";
import { Card, StatusPill } from "@/components/ui";
import { getPersona } from "@/lib/portal";

export const metadata: Metadata = { title: "Counselling" };

export default async function CounsellingPage() {
  const p = await getPersona();
  const sessions = p.sessions;
  const partner = p.proposal.kind === "active" ? p.proposal.partnerFirstName : null;
  const done = sessions?.filter((s) => s.status === "completed").length ?? 0;

  return (
    <PortalFrame persona={p}>
      <PageHeader
        title="Counselling"
        description={
          partner
            ? `Your counselling plan with ${partner}. Your counsellor schedules each session and signs it off when you’ve both attended.`
            : "Counselling begins once a proposal is accepted. Your counsellor plans the sessions with you both."
        }
      />

      {!sessions ? (
        <Card className="mt-7 p-6">
          <div className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-dashed border-line-strong text-faint">
              <Lock className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="t-h2">Not open yet</h2>
              <p className="mt-2 max-w-[56ch] text-[14.5px] leading-relaxed text-ink-2">
                {p.gender === "sister" ? "This opens if you accept a proposal." : "This opens once the sister accepts your proposal."}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <div className="mt-7 flex items-center gap-3">
            <div className="flex flex-1 gap-1" aria-hidden>
              {sessions.map((s) => (
                <span key={s.title} className={clsx("h-1.5 flex-1 rounded-full", s.status === "completed" ? "bg-ink" : s.status === "scheduled" ? "bg-info/50" : "bg-line")} />
              ))}
            </div>
            <p className="text-[13px] text-muted tabular-nums">
              {done} of {sessions.length} signed off
            </p>
          </div>

          <ol className="mt-6 space-y-3">
            {sessions.map((s, i) => (
              <li key={s.title}>
                <Card className={clsx("p-5 sm:px-6", s.status === "not_scheduled" && "bg-surface/70 shadow-none")}>
                  <div className="flex gap-4">
                    <span
                      className={clsx(
                        "flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold",
                        s.status === "completed" ? "bg-ink text-white" : s.status === "scheduled" ? "bg-info-soft text-info" : "bg-sunken text-muted",
                      )}
                    >
                      {s.status === "completed" ? <Check className="size-4" strokeWidth={2.75} aria-hidden /> : i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-[16px] font-semibold">{s.title}</h2>
                        <StatusPill tone={s.status === "completed" ? "ok" : s.status === "scheduled" ? "info" : "neutral"}>
                          {s.status === "completed" ? "Completed" : s.status === "scheduled" ? "Scheduled" : "Not yet scheduled"}
                        </StatusPill>
                      </div>
                      <p className="mt-0.5 text-[14px] text-ink-2">{s.description}</p>
                      {s.when && (
                        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px]">
                          <span className="flex items-center gap-1.5">
                            <Clock className="size-3.5 text-muted" aria-hidden />
                            {s.when}
                          </span>
                          {s.where && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="size-3.5 text-muted" aria-hidden />
                              {s.where}
                            </span>
                          )}
                        </p>
                      )}
                      {s.note && <p className="mt-2 text-[13px] text-muted">{s.note}</p>}
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[13.5px] leading-relaxed text-muted">
            Session notes are kept by your counsellor and aren’t shown here. If you can’t attend a session, message
            your counsellor as early as you can.
          </p>
        </>
      )}
    </PortalFrame>
  );
}
