import { Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, PortalFrame } from "@/components/portal/portal-frame";
import { ButtonLink, Card } from "@/components/ui";
import { getPersona } from "@/lib/portal";
import { NewProposalFlow } from "./new-proposal-flow";

export const metadata: Metadata = { title: "New proposal" };

export default async function NewProposalPage({ searchParams }: PageProps<"/portal/new-proposal">) {
  const persona = await getPersona();
  const { preview } = await searchParams;
  // Prototype: every demo persona has an active proposal, so ?preview shows the flow as if it were closed.
  const blocked = !preview;

  return (
    <PortalFrame persona={persona}>
      <PageHeader
        title="Start a new proposal"
        description="Use your existing profile. You won’t need to register again, and nothing from an earlier proposal carries into the new one."
      />
      {blocked ? (
        <Card className="mt-7 p-6">
          <div className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-info-soft text-info">
              <Info className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="t-h2">You already have an active proposal</h2>
              <p className="mt-2 max-w-[56ch] text-[14.5px] leading-relaxed text-ink-2">
                Proposal <span className="tabular-nums">{persona.proposalRef}</span> is still in progress. You can start a new one
                once it’s closed. If you need to withdraw, talk to your counsellor.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <ButtonLink href="/portal/messages" variant="secondary">
                  Message your counsellor
                </ButtonLink>
                <Link href="/portal/new-proposal?preview=1" className="inline-flex h-10 items-center px-3 text-[13.5px] text-muted underline underline-offset-4 hover:text-ink">
                  Prototype: preview the flow anyway
                </Link>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <NewProposalFlow persona={persona} />
      )}
    </PortalFrame>
  );
}
