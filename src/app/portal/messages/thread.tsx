"use client";

import clsx from "clsx";
import { Info, Send } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Avatar, Button, Card } from "@/components/ui";
import type { Persona } from "@/lib/portal-data";

export function Thread({ persona }: { persona: Persona }) {
  const [messages, setMessages] = useState(persona.messages);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLLIElement>(null);
  const id = useId();
  const firstUnread = messages.length - persona.unread;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  return (
    <Card className="mt-7 flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line/80 px-5 py-4 sm:px-6">
        <Avatar name={persona.counsellor.name} size={40} />
        <div>
          <p className="text-[15px] font-semibold">{persona.counsellor.name}</p>
          <p className="text-[12.5px] text-muted">Marriage counsellor, {persona.zone}</p>
        </div>
      </div>

      <ol className="space-y-5 px-5 py-6 sm:px-6" aria-label="Messages">
        {messages.map((m, i) => (
          <li key={m.id}>
            {i === firstUnread && persona.unread > 0 && (
              <p className="mb-5 flex items-center gap-3 text-[12px] font-medium text-[#a4472a]">
                <span className="h-px flex-1 bg-peach/50" />
                New
                <span className="h-px flex-1 bg-peach/50" />
              </p>
            )}
            {m.from === "system" ? (
              <p className="mx-auto flex max-w-[44ch] items-start justify-center gap-2 text-center text-[13px] text-muted">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                <span>
                  {m.body} <span className="text-faint">{m.when}</span>
                </span>
              </p>
            ) : (
              <div className={clsx("flex gap-3", m.from === "candidate" && "flex-row-reverse")}>
                <Avatar name={m.author} size={32} />
                <div className={clsx("max-w-[78%]", m.from === "candidate" && "text-right")}>
                  <div
                    className={clsx(
                      "inline-block rounded-[18px] px-4 py-2.5 text-left text-[14.5px] leading-relaxed",
                      m.from === "candidate" ? "rounded-tr-[6px] bg-ink text-white" : "rounded-tl-[6px] bg-sunken",
                    )}
                  >
                    {m.body}
                  </div>
                  <p className="mt-1 text-[12px] text-muted">
                    {m.from === "candidate" ? "You" : m.author}, {m.when}
                  </p>
                </div>
              </div>
            )}
          </li>
        ))}
        <li ref={endRef} aria-hidden />
      </ol>

      <form
        className="border-t border-line/80 bg-frame/50 p-4 sm:px-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          setMessages((m) => [...m, { id: `c${Date.now()}`, from: "candidate", author: persona.name, body: draft.trim(), when: "Just now" }]);
          setDraft("");
        }}
      >
        <label htmlFor={id} className="sr-only">
          Write to {persona.counsellor.name}
        </label>
        <div className="flex items-end gap-2 rounded-[18px] bg-surface p-2 ring-1 ring-line-strong focus-within:ring-2 focus-within:ring-ink">
          <textarea
            id={id}
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) e.currentTarget.form?.requestSubmit();
            }}
            placeholder={`Write to ${persona.counsellor.name}`}
            className="min-h-11 flex-1 resize-none bg-transparent px-2 py-1.5 text-[14.5px] placeholder:text-faint focus:outline-none"
          />
          <Button type="submit" size="icon" disabled={!draft.trim()} aria-label="Send message">
            <Send className="size-4" aria-hidden />
          </Button>
        </div>
        <p className="mt-2 text-[12px] text-muted">Your counsellor gets an email. Replies usually arrive within two working days.</p>
      </form>
    </Card>
  );
}
