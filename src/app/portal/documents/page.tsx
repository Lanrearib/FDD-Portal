import { ChevronRight, IdCard } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, PortalFrame } from "@/components/portal/portal-frame";
import { StatusPill } from "@/components/ui";
import { getPersona } from "@/lib/portal";
import { ConsentPanel } from "./consent-panel";

export const metadata: Metadata = { title: "Documents" };

const idStatus = {
  not_started: { label: "Not Started", tone: "action" as const, meta: "Upload a photo ID to continue" },
  submitted: { label: "Pending Identity Verification", tone: "wait" as const, meta: "With your counsellor" },
  verified: { label: "Verified", tone: "ok" as const, meta: "" },
  rejected: { label: "Returned for Correction", tone: "bad" as const, meta: "Upload a new photo" },
};

export default async function DocumentsPage() {
  const p = await getPersona();
  const id = idStatus[p.identity.status];
  return (
    <PortalFrame persona={p}>
      <PageHeader
        title="Documents"
        description="Everything you’ve uploaded for this proposal. Only your counsellors can open these files."
      />

      <div className="mt-7 space-y-5">
        <ConsentPanel persona={p} />

        <Link
          href="/portal/identity"
          className="group flex items-center gap-4 rounded-card bg-surface p-5 shadow-card ring-1 ring-line/70 transition-shadow hover:ring-ink/30 sm:px-6"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sunken text-ink-2">
            <IdCard className="size-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold">Photo ID</span>
            <span className="block text-[13px] text-muted">
              {p.identity.status === "verified" ? `${p.identity.docType}, verified ${p.identity.when}` : id.meta}
            </span>
          </span>
          <StatusPill tone={id.tone} className="hidden sm:inline-flex">
            {id.label}
          </StatusPill>
          <ChevronRight className="size-4 shrink-0 text-faint group-hover:text-ink" aria-hidden />
        </Link>
      </div>
    </PortalFrame>
  );
}
