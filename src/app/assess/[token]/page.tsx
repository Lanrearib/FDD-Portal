import { CircleSlash, Clock, Link2Off, LockKeyhole, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Card } from "@/components/ui";
import { findAssessment, type AssessmentLink } from "@/lib/assessments";
import { AssessmentFlow } from "./assessment-flow";

export const metadata: Metadata = {
  title: "Pastor’s introduction",
  // Private, single-use links must never be indexed.
  robots: { index: false, follow: false },
};

function Aside({ link }: { link?: AssessmentLink }) {
  return (
    <div className="max-w-[42ch]">
      <h2 className="t-h2">About this request</h2>
      <ul className="mt-5 space-y-5 text-[14.5px] leading-relaxed text-ink-2">
        <li className="flex gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-muted" aria-hidden />
          <span>
            This link is private to you and to one candidate. It doesn’t give access to any other records.
          </span>
        </li>
        <li className="flex gap-3">
          <LockKeyhole className="mt-0.5 size-5 shrink-0 text-muted" aria-hidden />
          <span>
            You’ll see the candidate’s name and reference only. Their documents stay with the counsellors.
          </span>
        </li>
        <li className="flex gap-3">
          <Clock className="mt-0.5 size-5 shrink-0 text-muted" aria-hidden />
          <span>
            {!link
              ? "Links expire after 14 days."
              : link.state === "open"
                ? `Sent ${link.sentOn}. It expires on ${link.expiresOn}.`
                : `Sent ${link.sentOn}.`}{" "}
            After an introduction is submitted, the link only shows the answers.
          </span>
        </li>
      </ul>
      <p className="mt-8 border-t border-line pt-5 text-[13.5px] text-muted">
        Family Development Department office: family@example.org, Monday to Friday, 9:00 to 17:00.
      </p>
    </div>
  );
}

function Notice({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div>
      <span className="flex size-12 items-center justify-center rounded-full bg-sunken text-ink">{icon}</span>
      <h1 className="t-h1 mt-5">{title}</h1>
      <div className="mt-3 space-y-3 text-[15.5px] leading-relaxed text-ink-2">{children}</div>
    </div>
  );
}

export default async function AssessPage({ params }: PageProps<"/assess/[token]">) {
  const { token } = await params;
  const link = findAssessment(token);

  let content: ReactNode;
  if (!link) {
    content = (
      <Notice icon={<CircleSlash className="size-6" aria-hidden />} title="This link isn’t valid">
        <p>Check that you opened the full link from the email. If it still doesn’t work, contact the department office.</p>
      </Notice>
    );
  } else if (link.state === "expired") {
    content = (
      <Notice icon={<Clock className="size-6" aria-hidden />} title="This link has expired">
        <p>
          The introduction link for {link.candidate.name} expired on {link.expiresOn}. {link.counsellor}, their counsellor,
          can send you a new one.
        </p>
        <p>Write to family@example.org with the reference {link.candidate.ref}, and we’ll send it straight away.</p>
      </Notice>
    );
  } else if (link.state === "replaced") {
    content = (
      <Notice icon={<Link2Off className="size-6" aria-hidden />} title="A newer link has been sent">
        <p>
          This link for {link.candidate.name} was replaced. Please use the most recent email from the Family Development
          Department.
        </p>
      </Notice>
    );
  } else if (link.state === "submitted" && link.submitted) {
    content = (
      <div>
        <h1 className="t-h1">Your introduction of {link.candidate.firstName}</h1>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
          Submitted on {link.submitted.on}. This page is read-only. To change an answer, contact the department office and it
          will be recorded as an amendment.
        </p>
        <Card className="mt-7 p-5 sm:p-6">
          <p className="text-[15px] font-semibold">
            {link.candidate.name} <span className="font-normal text-muted">({link.candidate.ref})</span>
          </p>
          <dl className="mt-4 space-y-4">
            {link.submitted.answers.map((a) => (
              <div key={a.q}>
                <dt className="text-[13px] text-muted">{a.q}</dt>
                <dd className="mt-0.5 text-[15px]">{a.a}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    );
  } else {
    content = <AssessmentFlow link={link} />;
  }

  return (
    <AuthShell wide aside={<Aside link={link} />}>
      {content}
      {/* The side panel is hidden on small screens; keep its privacy notes reachable there. */}
      <details className="group mt-12 rounded-card bg-sunken/70 p-4 lg:hidden">
        <summary className="cursor-pointer list-none text-[14px] font-medium [&::-webkit-details-marker]:hidden">
          About this request <span className="text-muted group-open:hidden">(privacy and expiry)</span>
        </summary>
        <div className="mt-4 [&_h2]:hidden">
          <Aside link={link} />
        </div>
      </details>
    </AuthShell>
  );
}
