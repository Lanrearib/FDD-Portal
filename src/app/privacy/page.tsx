import type { Metadata } from "next";
import { PublicShell } from "@/components/public-shell";

export const metadata: Metadata = { title: "Privacy notice" };

const sections = [
  {
    title: "What we collect",
    body: [
      "Your name, date of birth, email address, phone number, church, Area and Zone.",
      "A photo ID, so we can confirm who you are, and the consent letter from your parents or guardians.",
      "Your Pastor’s answers to a short introduction questionnaire.",
      "Messages between you and your counsellor, and a record of each step in your process.",
    ],
  },
  {
    title: "Who can see it",
    body: [
      "The marriage counsellors responsible for your Area or Zone, and the Central Marriage Counsellor when a case is escalated.",
      "Your Pastor sees your name and reference so they can introduce you. They do not see your documents.",
      "The other person in a proposal never sees your documents or private details. Only shared milestones are visible to both of you.",
      "Church leadership may see totals, such as how many proposals are in progress, but not your details.",
    ],
  },
  {
    title: "How we protect it",
    body: [
      "Documents are stored securely and opened only by authorised staff.",
      "Every time staff open, approve or change something in your case, it is recorded with their name and the time.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "We keep your profile so you don’t need to register again for a future proposal. Retention periods will be set by the church before launch.",
      "You can ask the department office to see the information we hold about you, or to correct it.",
    ],
  },
];

export default function Privacy() {
  return (
    <PublicShell>
      <article className="mx-auto max-w-[720px] px-4 pt-12 sm:px-6 lg:pt-16">
        <p className="inline-flex rounded-full bg-wait-soft px-3 py-1 text-[12.5px] font-medium text-wait">
          Draft for church approval
        </p>
        <h1 className="t-h1 mt-5">Privacy notice</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-2">
          The Family Development Department collects only what it needs to guide you through the
          church’s processes. This notice explains what that is and who can see it.
        </p>
        {sections.map((s) => (
          <section key={s.title} className="mt-10">
            <h2 className="t-h2">{s.title}</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-[15.5px] leading-relaxed text-ink-2 marker:text-faint">
              {s.body.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        ))}
        <p className="mt-12 border-t border-line pt-6 text-[14px] text-muted">
          Questions about your information? Write to family@example.org.
        </p>
      </article>
    </PublicShell>
  );
}
