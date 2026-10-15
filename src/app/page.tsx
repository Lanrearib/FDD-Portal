import { ArrowUpRight, BookOpen, Headphones, HeartHandshake, ImageIcon, Plus, Sprout } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { RingsMark } from "@/components/brand";
import { JourneyPath, type StageView } from "@/components/journey-path";
import { PublicShell } from "@/components/public-shell";
import { Avatar, ButtonLink, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: { absolute: "Family Development Department" },
};

const heroStages: StageView[] = [
  { key: "a", title: "Create your profile", state: "done", status: "Completed", detail: "Email verified" },
  { key: "b", title: "Verify your identity", state: "done", status: "Completed", detail: "Passport checked" },
  { key: "c", title: "Pastor's introduction", state: "waiting", status: "Pending Pastor", detail: "Link sent to Pastor Grace Bello" },
  { key: "d", title: "Meet your counsellor", state: "locked", status: "Not Started", lockReason: "Opens after your Pastor's introduction." },
];

const marriageSteps = [
  { who: "Brother", text: "Prays it through and approaches his Pastor" },
  { who: "Brother", text: "His Pastor introduces him to the department" },
  { who: "Brother", text: "Uploads a consent letter from his parents" },
  { who: "Brother", text: "Formally shares his intention with the sister" },
  { who: "Sister", text: "Prays it through and approaches her own Pastor" },
  { who: "Sister", text: "Her Pastor introduces her; she uploads her consent letter" },
  { who: "Sister", text: "Formally shares her response with the brother" },
  { who: "Both", text: "Counselling and the church's next steps" },
];

const resources = [
  { icon: BookOpen, kind: "Reading plan", title: "Preparing for marriage", meta: "21 days, with study notes" },
  { icon: Headphones, kind: "Audio teaching", title: "Communication in the home", meta: "6 sessions, 25 minutes each" },
  { icon: Sprout, kind: "Guide", title: "The first year of marriage", meta: "A short guide for newly married couples" },
  { icon: BookOpen, kind: "Booklet", title: "Grief and hope", meta: "For families who have lost a loved one" },
];

const faqs = [
  {
    q: "Who can start the marriage process?",
    a: "Brothers and sisters who are members of the church and have prayed through their decision. Each person registers separately and is introduced by their own Pastor.",
  },
  {
    q: "Does registering mean I'm approved?",
    a: "No. Registering opens your record. You're validated only after your email, your identity and your Pastor's introduction have all been confirmed.",
  },
  {
    q: "What will I need?",
    a: "An email address, a valid photo ID, the name of your Pastor (you'll pick them from our directory) and, later, a consent letter from your parents or guardians.",
  },
  {
    q: "Who can see my information?",
    a: "Only the counsellors responsible for your Area or Zone, and the central office when needed. The other person in a proposal never sees your documents or private details.",
  },
];

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:mx-0">

      <Card className="relative p-6 sm:p-7">
        <JourneyPath stages={heroStages} title="Your journey" />
      </Card>

      <div className="animate-rise absolute -bottom-6 left-4 flex max-w-[300px] items-center gap-3 rounded-full bg-surface py-2 pr-5 pl-2 shadow-pop ring-1 ring-line/70 sm:-left-8">
        <Avatar name="Sis. Ngozi Okafor" size={36} />
        <p className="text-[13px] leading-snug">
          <span className="font-semibold">Sis. Ngozi</span> verified your identity
        </p>
      </div>
    </div>
  );
}

function PhotoSlot({ label, className }: { label: string; className?: string }) {
  return (
    <figure
      className={`relative overflow-hidden rounded-panel bg-sunken ${className ?? ""}`}
    >
      <RingsMark size={160} className="absolute -right-8 -bottom-10 opacity-[0.07]" />
      <figcaption className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-surface/80 px-2.5 py-1 text-[12px] text-ink-2 backdrop-blur">
        <ImageIcon className="size-3.5" aria-hidden />
        {label}
      </figcaption>
    </figure>
  );
}

export default function Landing() {
  return (
    <PublicShell>
      {/* Hero */}
      <section className="mx-auto grid max-w-[1200px] items-center gap-14 overflow-x-clip px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-20 lg:pb-24">
        <div>
          <h1 className="t-display max-w-[14ch]">Walking with families through every season</h1>
          <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-ink-2">
            The Family Development Department guides brothers and sisters through the church’s
            marriage process, supports married couples, and stands with families in grief.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/start" size="lg">
              Start the marriage process
            </ButtonLink>
            <ButtonLink href="/counselling" size="lg" variant="secondary">
              Request counselling
            </ButtonLink>
          </div>
          <p className="mt-5 text-[14px] text-muted">
            Already registered?{" "}
            <Link href="/login" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              Sign in to your portal
            </Link>
          </p>
        </div>
        <HeroVisual />
      </section>

      {/* Services */}
      <section id="marriage" aria-labelledby="services-heading" className="mx-auto max-w-[1200px] scroll-mt-24 px-4 sm:px-6">
        <h2 id="services-heading" className="t-h1 max-w-[20ch]">
          How the department can help
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-[46ch]">
                <h3 className="t-h2">The marriage process</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                  A guided path that follows the church’s procedure. The brother and the sister each
                  register on their own, and each is introduced by their own Pastor.
                </p>
              </div>
              <ButtonLink href="/start">Start the process</ButtonLink>
            </div>

            <ol className="mt-7 grid gap-x-8 gap-y-1 sm:grid-cols-2">
              {marriageSteps.map((s, i) => (
                <li key={s.text} className="flex gap-3.5 border-t border-line/80 py-3.5">
                  <span className="mt-px flex size-7 shrink-0 items-center justify-center rounded-full bg-sunken text-[12.5px] font-semibold tabular-nums">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12.5px] text-muted">{s.who}</span>
                    <span className="block text-[14.5px] leading-snug">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-5 rounded-[14px] bg-sunken/70 p-4 text-[13.5px] leading-relaxed text-ink-2">
              Registering opens your record; it isn’t approval to proceed. Each stage unlocks only
              when the one before it has been completed and, where needed, reviewed by a counsellor.
            </p>
          </Card>

          <div className="grid gap-5">
            <Card className="flex flex-col p-6 sm:p-7">
              <span className="flex size-10 items-center justify-center rounded-full bg-lilac-soft text-[#5b4aa6]">
                <HeartHandshake className="size-5" aria-hidden />
              </span>
              <h3 className="t-h2 mt-4">Counselling for married couples</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                For couples who want support through a difficult season, or a routine check-in. Tell
                us a little and a counsellor will contact you.
              </p>
              <Link
                href="/counselling"
                className="mt-auto inline-flex items-center gap-1 pt-5 text-[14px] font-medium underline decoration-line-strong underline-offset-4 hover:decoration-ink"
              >
                Request counselling
              </Link>
            </Card>
            <Card className="flex flex-col p-6 sm:p-7">
              <span className="flex size-10 items-center justify-center rounded-full bg-peach-soft text-[#a4472a]">
                <Sprout className="size-5" aria-hidden />
              </span>
              <h3 className="t-h2 mt-4">Bereavement support</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                If you have lost someone, we would like to stand with you. Requests are confidential
                and seen only by the people who will help.
              </p>
              <Link
                href="/bereavement"
                className="mt-auto inline-flex items-center gap-1 pt-5 text-[14px] font-medium underline decoration-line-strong underline-offset-4 hover:decoration-ink"
              >
                Ask for support
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Scripture */}
      <section aria-label="Scripture" className="mx-auto mt-24 max-w-[1200px] px-4 sm:px-6">
        <figure className="relative overflow-hidden rounded-panel bg-ink px-6 py-14 text-white sm:px-14 sm:py-20">
          <RingsMark size={340} className="absolute -top-16 -right-16 opacity-25" />
          <blockquote className="relative max-w-[30ch] text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.15] font-semibold tracking-[-0.025em]">
            “Except the Lord build the house, they labour in vain that build it.”
          </blockquote>
          <figcaption className="relative mt-6 text-[15px] text-white/70">Psalm 127:1</figcaption>
        </figure>
      </section>

      {/* Resources */}
      <section id="resources" aria-labelledby="resources-heading" className="mx-auto mt-24 grid max-w-[1200px] scroll-mt-24 gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <h2 id="resources-heading" className="t-h1">
            Resources for the journey
          </h2>
          <p className="mt-3 max-w-[40ch] text-[15.5px] leading-relaxed text-ink-2">
            Teaching and reading approved by the department, for those preparing for marriage, the
            married, and the grieving.
          </p>
          <blockquote className="mt-8 border-l-2 border-peach pl-4 text-[15px] leading-relaxed text-ink-2">
            “The Lord is nigh unto them that are of a broken heart.”
            <footer className="mt-1 text-[13px] text-muted">Psalm 34:18</footer>
          </blockquote>
        </div>
        <ul className="divide-y divide-line/80 rounded-card bg-surface shadow-card ring-1 ring-line/70">
          {resources.map((r) => {
            const Icon = r.icon;
            return (
              <li key={r.title}>
                <a href="#" className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-frame/70 sm:px-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sunken text-ink-2">
                    <Icon className="size-[18px]" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] text-muted">{r.kind}</span>
                    <span className="block text-[15px] font-medium">{r.title}</span>
                    <span className="block text-[13px] text-muted">{r.meta}</span>
                  </span>
                  <ArrowUpRight className="size-4 text-faint transition-colors group-hover:text-ink" aria-hidden />
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Photos */}
      <section aria-label="Photos from the department" className="mx-auto mt-24 grid max-w-[1200px] gap-4 px-4 sm:grid-cols-3 sm:px-6">
        <PhotoSlot label="Church-approved photo" className="aspect-[3/2]" />
        <PhotoSlot label="Church-approved photo" className="aspect-[3/2]" />
        <PhotoSlot label="Church-approved photo" className="aspect-[3/2]" />
      </section>

      {/* Questions */}
      <section aria-labelledby="faq-heading" className="mx-auto mt-24 grid max-w-[1200px] gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <h2 id="faq-heading" className="t-h1">
            Before you begin
          </h2>
          <p className="mt-3 max-w-[40ch] text-[15.5px] leading-relaxed text-ink-2">
            Can’t find your answer? Write to the department office and we’ll reply within two
            working days.
          </p>
        </div>
        <div className="divide-y divide-line/80 border-y border-line/80">
          {faqs.map((f) => (
            <details key={f.q} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="size-5 shrink-0 text-muted transition-transform group-open:rotate-45" aria-hidden />
              </summary>
              <p className="max-w-[62ch] pb-5 text-[15px] leading-relaxed text-ink-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
