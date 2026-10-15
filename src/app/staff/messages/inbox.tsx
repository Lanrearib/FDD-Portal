"use client";

import clsx from "clsx";
import { ArrowUpRight, ChevronLeft, Search, Send } from "lucide-react";
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { Avatar, Button, Card } from "@/components/ui";
import { currentStaff } from "@/lib/staff-directory";

interface Msg {
  id: string;
  from: "staff" | "candidate";
  body: string;
  when: string;
}

interface Conversation {
  id: string;
  name: string;
  caseId: string;
  stage: string;
  unread: number;
  messages: Msg[];
}

const initial: Conversation[] = [
  {
    id: "c2",
    name: "Daniel Okoro",
    caseId: "c2",
    stage: "Parental consent letter",
    unread: 1,
    messages: [
      { id: "1", from: "staff", body: "Hello Daniel, thank you for your consent letter. It needs to be dated before I can accept it. Please upload a dated copy when you can.", when: "8 Oct, 14:02" },
      { id: "2", from: "candidate", body: "My parents have now signed and dated it. Thank you for your patience.", when: "Today, 09:43" },
    ],
  },
  {
    id: "c3",
    name: "Funke Adebayo",
    caseId: "c3",
    stage: "First appointment",
    unread: 1,
    messages: [{ id: "1", from: "candidate", body: "None of the open times work for me, so I’ve sent my preferred times. Thank you.", when: "Yesterday, 18:21" }],
  },
  {
    id: "c5",
    name: "Tunde Bakare",
    caseId: "c5",
    stage: "Parental consent letter",
    unread: 1,
    messages: [
      { id: "1", from: "staff", body: "Thank you for sending your consent letter. It needs your parents’ signatures and the date it was written. A photo of the signed page is fine.", when: "14 Oct, 16:20" },
      { id: "2", from: "candidate", body: "Thank you. My parents are travelling back on Saturday. Is it all right if I upload it on Sunday?", when: "Yesterday, 21:05" },
    ],
  },
  {
    id: "c10",
    name: "Zainab Yusuf",
    caseId: "c10",
    stage: "Response to the proposal",
    unread: 0,
    messages: [{ id: "1", from: "staff", body: "Ibrahim has linked his proposal to yours. There’s no rush to respond. If you’d like to talk anything through first, I’m here.", when: "12 Oct, 17:30" }],
  },
  {
    id: "c12",
    name: "Femi Adeola",
    caseId: "c12",
    stage: "Verify identity",
    unread: 0,
    messages: [{ id: "1", from: "staff", body: "Welcome, Femi. Start by verifying your identity, and write to me here if anything is unclear.", when: "Today, 10:20" }],
  },
];

export function Inbox() {
  const [convos, setConvos] = useState(initial);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const inputId = useId();
  const active = convos.find((c) => c.id === activeId) ?? null;

  const list = useMemo(() => convos.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase())), [convos, query]);

  const openConvo = (id: string) => {
    setActiveId(id);
    setDraft("");
    setConvos((cs) => cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  return (
    <div className="mx-auto max-w-[1100px]">
      <h1 className="t-h1">Messages</h1>
      <p className="mt-2 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-2">Conversations with candidates in Ikeja Zone. Each message is also emailed and kept on the case.</p>

      <Card className="mt-7 grid min-h-[560px] overflow-hidden md:grid-cols-[320px_1fr]">
        {/* List */}
        <div className={clsx("border-line/80 md:border-r", active && "hidden md:block")}>
          <div className="border-b border-line/80 p-3">
            <label className="relative block">
              <span className="sr-only">Search conversations</span>
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name…" className="h-10 w-full rounded-full bg-frame pr-4 pl-10 text-[14px] ring-1 ring-line placeholder:text-faint focus:bg-surface focus:ring-ink focus:outline-none" />
            </label>
          </div>
          <ul>
            {list.map((c) => {
              const last = c.messages[c.messages.length - 1];
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => openConvo(c.id)}
                    aria-current={c.id === activeId ? "true" : undefined}
                    className={clsx("flex w-full gap-3 border-b border-line/60 px-4 py-3.5 text-left transition-colors", c.id === activeId ? "bg-sunken" : "hover:bg-frame")}
                  >
                    <Avatar name={c.name} size={40} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className={clsx("truncate text-[14.5px]", c.unread ? "font-semibold" : "font-medium")}>{c.name}</span>
                        <span className="shrink-0 text-[12px] text-muted">{last.when.split(",")[0]}</span>
                      </span>
                      <span className={clsx("mt-0.5 line-clamp-2 text-[13px] leading-snug", c.unread ? "text-ink" : "text-muted")}>
                        {last.from === "staff" && "You: "}
                        {last.body}
                      </span>
                    </span>
                    {c.unread > 0 && (
                      <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-white">
                        {c.unread}
                        <span className="sr-only"> unread</span>
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Thread */}
        <div className={clsx("flex min-w-0 flex-col", !active && "hidden md:flex")}>
          {!active ? (
            <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
              <p className="text-[15px] font-medium">Choose a conversation</p>
              <p className="mt-1 text-[13.5px] text-muted">Three have new messages.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-line/80 px-4 py-3 sm:px-5">
                <button type="button" onClick={() => setActiveId(null)} className="flex size-9 items-center justify-center rounded-full hover:bg-sunken md:hidden" aria-label="Back to conversations">
                  <ChevronLeft className="size-5" aria-hidden />
                </button>
                <Avatar name={active.name} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold">{active.name}</p>
                  <p className="truncate text-[12.5px] text-muted">Currently at: {active.stage}</p>
                </div>
                <Link href={`/staff/candidates/${active.caseId}`} className="flex shrink-0 items-center gap-1 text-[13px] font-medium text-ink-2 hover:text-ink">
                  Open case
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </Link>
              </div>
              <ol className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5" aria-label={`Conversation with ${active.name}`}>
                {active.messages.map((m) => (
                  <li key={m.id} className={clsx("flex gap-3", m.from === "staff" && "flex-row-reverse")}>
                    <Avatar name={m.from === "staff" ? currentStaff.name : active.name} size={30} />
                    <div className={clsx("max-w-[78%]", m.from === "staff" && "text-right")}>
                      <div className={clsx("inline-block rounded-[16px] px-4 py-2.5 text-left text-[14px] leading-relaxed", m.from === "staff" ? "rounded-tr-[6px] bg-ink text-white" : "rounded-tl-[6px] bg-sunken")}>{m.body}</div>
                      <p className="mt-1 text-[12px] text-muted">
                        {m.from === "staff" ? "You" : active.name.split(" ")[0]}, {m.when}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <form
                className="border-t border-line/80 p-3 sm:p-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!draft.trim()) return;
                  setConvos((cs) => cs.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, { id: `${Date.now()}`, from: "staff", body: draft.trim(), when: "Just now" }] } : c)));
                  setDraft("");
                }}
              >
                <label htmlFor={inputId} className="sr-only">
                  Reply to {active.name}
                </label>
                <div className="flex items-end gap-2 rounded-[18px] bg-surface p-2 ring-1 ring-line-strong focus-within:ring-2 focus-within:ring-ink">
                  <textarea id={inputId} rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`Reply to ${active.name.split(" ")[0]}`} className="min-h-11 flex-1 resize-none bg-transparent px-2 py-1.5 text-[14.5px] placeholder:text-faint focus:outline-none" />
                  <Button type="submit" size="icon" disabled={!draft.trim()} aria-label="Send reply">
                    <Send className="size-4" aria-hidden />
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
