"use client";

import clsx from "clsx";
import { ChevronRight, Eye, HeartHandshake, Lock, Sprout } from "lucide-react";
import { useState } from "react";
import { Field, Select, Textarea } from "@/components/form";
import { Modal } from "@/components/modal";
import { useToast } from "@/components/toast";
import { Avatar, Button, Card, StatusPill, type Tone } from "@/components/ui";
import { currentStaff } from "@/lib/staff-directory";

type Status = "New" | "Contacted" | "Scheduled" | "Closed";
const statusTone: Record<Status, Tone> = { New: "action", Contacted: "wait", Scheduled: "info", Closed: "neutral" };

interface Request {
  id: string;
  ref: string;
  type: "Couple counselling" | "Bereavement support";
  name: string;
  received: string;
  status: Status;
  assigned: string | null;
  contact: string;
  availability: string;
  topic: string;
  details: string;
}

const initial: Request[] = [
  {
    id: "r31",
    ref: "SR-26-031",
    type: "Couple counselling",
    name: "Chinedu and Amaka Okeke",
    received: "Today, 08:12",
    status: "New",
    assigned: null,
    contact: "Phone, +234 803 555 0201",
    availability: "Weekday evenings after 18:00",
    topic: "Communication",
    details: "Married six years. We’d like help talking things through without arguing, especially about money and our children’s schooling.",
  },
  {
    id: "r30",
    ref: "SR-26-030",
    type: "Bereavement support",
    name: "Mrs. Rita Nwachukwu",
    received: "Yesterday, 19:40",
    status: "New",
    assigned: null,
    contact: "WhatsApp, +234 806 555 0222",
    availability: "Any morning",
    topic: "Loss of a husband",
    details: "My husband passed away three weeks ago after a short illness. I have two teenage children and would value someone to talk to, and help knowing what support the church can offer.",
  },
  {
    id: "r29",
    ref: "SR-26-029",
    type: "Couple counselling",
    name: "Seun and Folake Ade",
    received: "11 Oct",
    status: "Scheduled",
    assigned: "Sis. Ngozi Okafor",
    contact: "Email, seun.ade@example.com",
    availability: "Saturdays",
    topic: "Routine check-in",
    details: "First anniversary coming up. We’d like a routine check-in session.",
  },
  {
    id: "r27",
    ref: "SR-26-027",
    type: "Bereavement support",
    name: "Bro. Kola Peters",
    received: "6 Oct",
    status: "Contacted",
    assigned: "Sis. Ngozi Okafor",
    contact: "Phone, +234 809 555 0233",
    availability: "Weekends",
    topic: "Loss of a parent",
    details: "My mother died last month. I’m the eldest and handling the arrangements, and finding it hard to cope.",
  },
];

export function SupportView() {
  const [requests, setRequests] = useState(initial);
  const [filter, setFilter] = useState<"all" | Request["type"]>("all");
  const [open, setOpen] = useState<Request | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<Status>("New");
  const [note, setNote] = useState("");
  const { toast, toastNode } = useToast();

  const list = requests.filter((r) => filter === "all" || r.type === filter);
  const restricted = (r: Request) => r.type === "Bereavement support" && !revealed.has(r.id);

  return (
    <div className="mx-auto max-w-[1000px]">
      <h1 className="t-h1">Support requests</h1>
      <p className="mt-2 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-2">
        Requests from married couples and from members who are grieving, in Lagos Area. Bereavement details stay hidden
        until you open them.
      </p>

      <div role="tablist" aria-label="Filter requests" className="mt-7 flex flex-wrap gap-1.5">
        {(["all", "Couple counselling", "Bereavement support"] as const).map((f) => (
          <button
            key={f}
            role="tab"
            type="button"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={clsx("h-8 rounded-full px-3.5 text-[13px] font-medium transition-colors", filter === f ? "bg-ink text-white" : "text-ink-2 ring-1 ring-line hover:bg-sunken")}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      <Card className="mt-4 overflow-hidden">
        <ul className="divide-y divide-line/80">
          {list.map((r) => {
            const Icon = r.type === "Couple counselling" ? HeartHandshake : Sprout;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(r);
                    setStatus(r.status);
                    setNote("");
                  }}
                  className="group flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 text-left transition-colors hover:bg-frame/70 sm:px-6"
                >
                  <span className={clsx("flex size-10 shrink-0 items-center justify-center rounded-full", r.type === "Couple counselling" ? "bg-lilac-soft text-[#5b4aa6]" : "bg-peach-soft text-[#a4472a]")}>
                    <Icon className="size-[18px]" aria-hidden />
                  </span>
                  <span className="min-w-[180px] flex-1">
                    <span className="block text-[14.5px] font-medium">{r.name}</span>
                    <span className="block text-[12.5px] text-muted">
                      {r.type}
                      {r.type === "Couple counselling" ? `, ${r.topic.toLowerCase()}` : ""}. <span className="tabular-nums">{r.ref}</span>
                    </span>
                  </span>
                  <span className="w-28 text-[13px] text-ink-2">{r.received}</span>
                  <span className="w-36 truncate text-[13px] text-muted">{r.assigned ?? "Unassigned"}</span>
                  <StatusPill tone={statusTone[r.status]}>{r.status}</StatusPill>
                  <ChevronRight className="hidden size-4 text-faint group-hover:text-ink sm:block" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <Modal
        open={!!open}
        onClose={() => setOpen(null)}
        size="lg"
        title={open?.name ?? ""}
        description={open && <>{open.type}, received {open.received}. Reference {open.ref}.</>}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (!open) return;
                setRequests((rs) => rs.map((r) => (r.id === open.id ? { ...r, status, assigned: r.assigned ?? currentStaff.name } : r)));
                toast(`${open.ref} updated.`);
                setOpen(null);
              }}
            >
              Save
            </Button>
          </>
        }
      >
        {open && (
          <div className="space-y-5">
            <dl className="grid gap-4 text-[14px] sm:grid-cols-2">
              <div>
                <dt className="text-[12.5px] text-muted">Preferred contact</dt>
                <dd>{open.contact}</dd>
              </div>
              <div>
                <dt className="text-[12.5px] text-muted">Good times to reach them</dt>
                <dd>{open.availability}</dd>
              </div>
              <div>
                <dt className="text-[12.5px] text-muted">Assigned to</dt>
                <dd className="flex items-center gap-2">
                  {open.assigned ? (
                    <>
                      <Avatar name={open.assigned} size={22} />
                      {open.assigned}
                    </>
                  ) : (
                    "No one yet. Saving assigns it to you."
                  )}
                </dd>
              </div>
            </dl>

            {restricted(open) ? (
              <div className="rounded-[14px] bg-sunken/80 p-4">
                <p className="flex items-center gap-2 text-[14px] font-medium">
                  <Lock className="size-4" aria-hidden />
                  Details are confidential
                </p>
                <p className="mt-1 text-[13.5px] text-ink-2">Opening them is recorded with your name and the time.</p>
                <Button size="sm" variant="secondary" className="mt-3" onClick={() => setRevealed((s) => new Set(s).add(open.id))}>
                  <Eye className="size-3.5" aria-hidden />
                  Show details
                </Button>
              </div>
            ) : (
              <div className="rounded-[14px] bg-sunken/70 p-4">
                <p className="text-[12.5px] text-muted">{open.topic}</p>
                <p className="mt-1 text-[14.5px] leading-relaxed">{open.details}</p>
              </div>
            )}

            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
                {(Object.keys(statusTone) as Status[]).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Note for the team" optional hint="Counsellors only.">
              <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
            </Field>
          </div>
        )}
      </Modal>
      {toastNode}
    </div>
  );
}
