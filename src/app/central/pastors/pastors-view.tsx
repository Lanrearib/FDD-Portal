"use client";

import clsx from "clsx";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Checkbox, Field, Input, Select } from "@/components/form";
import { Modal } from "@/components/modal";
import { useToast } from "@/components/toast";
import { Avatar, Button, Card, StatusPill } from "@/components/ui";
import { areas, branches, branchById, pastors as initialPastors, zoneById, zones } from "@/lib/reference";
import type { Pastor } from "@/lib/types";

export function PastorsView() {
  const [list, setList] = useState<Pastor[]>(initialPastors);
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("all");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [editing, setEditing] = useState<Pastor | "new" | null>(null);
  const [toggling, setToggling] = useState<Pastor | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", branchId: "", zonal: false });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const { toast, toastNode } = useToast();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((p) => {
      const z = zoneById(p.zoneId);
      return (
        (area === "all" || z?.areaId === area) &&
        (status === "all" || (status === "active") === p.active) &&
        (!q || p.name.toLowerCase().includes(q) || branchById(p.branchId)?.name.toLowerCase().includes(q) || p.email.includes(q))
      );
    });
  }, [list, query, area, status]);

  const open = (p: Pastor | "new") => {
    setForm(p === "new" ? { name: "", email: "", phone: "", branchId: "", zonal: false } : { name: p.name, email: p.email, phone: p.phone, branchId: p.branchId, zonal: p.isZonalPastor });
    setErrors({});
    setEditing(p);
  };

  const formZone = branches.find((b) => b.id === form.branchId)?.zoneId;
  const currentZonal = list.find((p) => p.zoneId === formZone && p.isZonalPastor && (editing === "new" || p.id !== editing?.id));

  const save = () => {
    const e: Record<string, string> = {};
    if (!/^Pastor\s+\S+/.test(form.name.trim())) e.name = "Start with “Pastor”, then their name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Introduction links go to this address, so it must be valid.";
    else if (list.some((p) => p.email === form.email.trim() && (editing === "new" || p.id !== editing?.id))) e.email = "Another Pastor already uses this email.";
    if (!form.branchId) e.branchId = "Choose their church.";
    setErrors(e);
    if (Object.keys(e).length) return;
    const zoneId = formZone!;
    setList((l) => {
      let next = l.map((p) => (form.zonal && p.zoneId === zoneId && p.isZonalPastor ? { ...p, isZonalPastor: false } : p));
      if (editing === "new") next = [...next, { id: `p${Date.now()}`, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), branchId: form.branchId, zoneId, isZonalPastor: form.zonal, active: true }];
      else next = next.map((p) => (p.id === (editing as Pastor).id ? { ...p, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), branchId: form.branchId, zoneId, isZonalPastor: form.zonal } : p));
      return next;
    });
    toast(editing === "new" ? `${form.name.trim()} added to the directory.` : "Changes saved.");
    setEditing(null);
  };

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="t-h1">Pastor directory</h1>
          <p className="mt-2 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-2">
            Candidates can only choose Pastors from this list. Inactive Pastors are hidden from them, and each Zone has one
            Zonal Pastor who can stand in.
          </p>
        </div>
        <Button onClick={() => open("new")}>
          <Plus className="size-4" aria-hidden />
          Add Pastor
        </Button>
      </div>

      <Card className="mt-8 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 sm:px-6">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">Search Pastors</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, church or email…" className="h-10 w-full rounded-full bg-frame pr-4 pl-10 text-[14px] ring-1 ring-line placeholder:text-faint focus:bg-surface focus:ring-ink focus:outline-none" />
          </label>
          <select aria-label="Area" value={area} onChange={(e) => setArea(e.target.value)} className="h-10 rounded-full bg-frame px-3.5 text-[14px] ring-1 ring-line focus:ring-ink focus:outline-none">
            <option value="all">All Areas</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="h-10 rounded-full bg-frame px-3.5 text-[14px] ring-1 ring-line focus:ring-ink focus:outline-none">
            <option value="all">Active and inactive</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </select>
        </div>
        <ul className="divide-y divide-line/80 border-t border-line/80">
          {visible.map((p) => {
            const z = zoneById(p.zoneId);
            return (
              <li key={p.id} className={clsx("flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 sm:px-6", !p.active && "bg-frame/50")}>
                <Avatar name={p.name} size={36} className={clsx(!p.active && "opacity-50")} />
                <div className="min-w-[200px] flex-1">
                  <p className={clsx("text-[14.5px] font-medium", !p.active && "text-muted")}>{p.name}</p>
                  <p className="text-[12.5px] text-muted">{p.email}</p>
                </div>
                <div className="w-[200px] text-[13px]">
                  <p>{branchById(p.branchId)?.name}</p>
                  <p className="text-muted">{z?.name}</p>
                </div>
                <div className="flex w-[190px] flex-wrap gap-1.5">
                  {p.isZonalPastor && <StatusPill tone="info">Zonal Pastor</StatusPill>}
                  <StatusPill tone={p.active ? "ok" : "neutral"}>{p.active ? "Active" : "Inactive"}</StatusPill>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => open(p)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setToggling(p)}>
                    {p.active ? "Deactivate" : "Reactivate"}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
        {visible.length === 0 && <p className="px-6 py-10 text-center text-[14px] text-muted">No Pastors match. Try a different name or Area.</p>}
      </Card>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Add a Pastor" : "Edit Pastor"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing === "new" ? "Add Pastor" : "Save changes"}</Button>
          </>
        }
      >
        <div className="space-y-5">
          <Field label="Name" error={errors.name}>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Pastor Samuel Adeyemi" />
          </Field>
          <Field label="Email" hint="Introduction links are sent here." error={errors.email}>
            <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </Field>
          <Field label="Phone" optional>
            <Input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </Field>
          <Field label="Church" error={errors.branchId}>
            <Select value={form.branchId} onChange={(e) => setForm((f) => ({ ...f, branchId: e.target.value }))}>
              <option value="">Choose their church</option>
              {zones.map((z) => (
                <optgroup key={z.id} label={z.name}>
                  {branches.filter((b) => b.zoneId === z.id).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          </Field>
          <Checkbox
            checked={form.zonal}
            onChange={(v) => setForm((f) => ({ ...f, zonal: v }))}
            label="Zonal Pastor for this Zone"
            description={
              form.zonal && currentZonal
                ? `${currentZonal.name} is the Zonal Pastor now. Saving makes this Pastor the Zonal Pastor instead.`
                : "Can stand in when a candidate’s own Pastor is unavailable."
            }
          />
        </div>
      </Modal>

      <Modal
        open={!!toggling}
        onClose={() => setToggling(null)}
        title={toggling?.active ? `Deactivate ${toggling?.name}?` : `Reactivate ${toggling?.name}?`}
        description={
          toggling?.active
            ? "Candidates won’t be able to choose them. Introductions they’ve already submitted stay on record; any open links should be reassigned."
            : "Candidates will be able to choose them again."
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setToggling(null)}>
              Cancel
            </Button>
            <Button
              variant={toggling?.active ? "danger" : "primary"}
              onClick={() => {
                setList((l) => l.map((p) => (p.id === toggling!.id ? { ...p, active: !p.active, isZonalPastor: p.active ? false : p.isZonalPastor } : p)));
                toast(toggling!.active ? `${toggling!.name} deactivated.` : `${toggling!.name} reactivated.`);
                setToggling(null);
              }}
            >
              {toggling?.active ? "Deactivate" : "Reactivate"}
            </Button>
          </>
        }
      >
        {toggling?.active && toggling.isZonalPastor && (
          <p className="rounded-[14px] bg-wait-soft p-3.5 text-[14px] text-wait">
            They’re the Zonal Pastor for {zoneById(toggling.zoneId)?.name}. Choose a new Zonal Pastor afterwards, or candidates there won’t have a fallback.
          </p>
        )}
      </Modal>
      {toastNode}
    </div>
  );
}
