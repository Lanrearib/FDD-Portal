"use client";

import clsx from "clsx";
import { Check, CircleAlert, Download, FileSpreadsheet, Plus, TriangleAlert, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { Field, Input, Select, Textarea } from "@/components/form";
import { Modal } from "@/components/modal";
import { useToast } from "@/components/toast";
import { Avatar, Button, Card, StatusPill } from "@/components/ui";
import { coverage as initialCoverage } from "@/lib/central-data";
import { areas, zones } from "@/lib/reference";
import { counsellors as initialCounsellors, type Counsellor } from "@/lib/staff-directory";

const ROLES = ["Zonal Marriage Counsellor", "Area Marriage Counsellor"] as const;
const TEMPLATE = "name,email,role,area,zone\nSis. Example Name,example@example.org,Zonal Marriage Counsellor,Lagos Area,Ikeja Zone\n";
const SAMPLE = `name,email,role,area,zone
Bro. Kwesi Appiah,k.appiah@example.org,Zonal Marriage Counsellor,Accra Area,Tema Zone
Sis. Halima Bello,h.bello@example.org,Zonal Marriage Counsellor,Abuja Area,Wuse Zone
Bro. Tunde Ola,tunde.ola@example,Zonal Marriage Counsellor,Lagos Area,Surulere Zone
Sis. Grace Udo,g.udo@example.org,Zonal Marriage Counsellor,Lagos Area,Yaba Zone
,m.ade@example.org,Area Marriage Counsellor,Douala Area,
Sis. Halima Bello,h.bello@example.org,Zonal Marriage Counsellor,Abuja Area,Wuse Zone
Sis. Ngozi Okafor,n.okafor@example.org,Zonal Marriage Counsellor,Lagos Area,Ikeja Zone`;

interface Row {
  line: number;
  name: string;
  email: string;
  role: string;
  area: string;
  zone: string;
  errors: string[];
}

/** Validates every row before anything is committed (PRD §11.4 bulk upload rules). */
function parse(csv: string, existing: Counsellor[]): Row[] {
  const lines = csv.trim().split(/\r?\n/);
  const header = lines.shift()?.toLowerCase().replace(/\s/g, "");
  if (header !== "name,email,role,area,zone") return [{ line: 1, name: "", email: "", role: "", area: "", zone: "", errors: ["The first row must be the template headings: name, email, role, area, zone."] }];
  const seen = new Map<string, number>();
  return lines.map((l, i) => {
    const [name = "", email = "", role = "", area = "", zone = ""] = l.split(",").map((x) => x.trim());
    const line = i + 2;
    const errors: string[] = [];
    if (!name) errors.push("Name is missing");
    if (!email) errors.push("Email is missing");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push(`“${email}” isn’t a valid email address`);
    if (!ROLES.includes(role as (typeof ROLES)[number])) errors.push(`Role must be “${ROLES[0]}” or “${ROLES[1]}”`);
    const a = areas.find((x) => x.name.toLowerCase() === area.toLowerCase());
    if (!a) errors.push(`Unknown Area “${area || "blank"}”`);
    if (role === ROLES[0]) {
      const z = zones.find((x) => x.name.toLowerCase() === zone.toLowerCase());
      if (!z) errors.push(`Unknown Zone “${zone || "blank"}”`);
      else if (a && z.areaId !== a.id) errors.push(`${zone} isn’t in ${area}`);
    }
    const key = email.toLowerCase();
    if (key && seen.has(key)) errors.push(`Duplicate of row ${seen.get(key)}`);
    else if (key && existing.some((c) => c.email.toLowerCase() === key)) errors.push("Already in the directory");
    if (key && !seen.has(key)) seen.set(key, line);
    return { line, name, email, role, area, zone, errors };
  });
}

function download(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
  Object.assign(document.createElement("a"), { href: url, download: name }).click();
  URL.revokeObjectURL(url);
}

export function CounsellorsView() {
  const [list, setList] = useState(initialCounsellors);
  const [cov, setCov] = useState(initialCoverage);
  const [modal, setModal] = useState<null | "add" | "bulk" | { deactivate: Counsellor } | { assign: string }>(null);
  const [form, setForm] = useState({ name: "", email: "", role: ROLES[0] as string, area: "", zone: "", to: "", reason: "" });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [csv, setCsv] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  const { toast, toastNode } = useToast();

  const valid = useMemo(() => rows?.filter((r) => r.errors.length === 0) ?? [], [rows]);
  const invalid = useMemo(() => rows?.filter((r) => r.errors.length > 0) ?? [], [rows]);

  const openAdd = () => {
    setForm({ name: "", email: "", role: ROLES[0], area: "", zone: "", to: "", reason: "" });
    setErrors({});
    setModal("add");
  };

  const addCounsellor = (name: string, email: string, role: string, area: string, zone: string) => {
    const scope = role === ROLES[0] ? `${zone}, ${area}` : area;
    setList((l) => [...l, { id: `n${Date.now()}${Math.random()}`, name, email, role: role as Counsellor["role"], scope, active: true, caseload: 0 }]);
    setCov((c) =>
      c.map((z) =>
        (role === ROLES[0] ? z.zone === zone : z.area === area && !z.counsellor) ? { ...z, counsellor: name, level: role === ROLES[0] ? "Zonal" : "Area" } : z,
      ),
    );
  };

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="t-h1">Counsellors and Zones</h1>
          <p className="mt-2 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-2">
            New cases go to the counsellor assigned to the candidate’s Zone, or their Area if no Zonal counsellor is set. A Zone
            with neither is flagged, never routed to someone at random.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => { setCsv(""); setRows(null); setModal("bulk"); }}>
            <Upload className="size-4" aria-hidden />
            Bulk upload
          </Button>
          <Button onClick={openAdd}>
            <Plus className="size-4" aria-hidden />
            Add counsellor
          </Button>
        </div>
      </div>

      {/* Coverage */}
      <Card className="mt-8 overflow-hidden">
        <h2 className="px-5 pt-5 text-[15px] font-semibold sm:px-6">Coverage by Zone</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead className="border-y border-line/80 bg-frame/60 text-[12.5px] text-muted">
              <tr>
                <th scope="col" className="px-5 py-2.5 font-normal sm:px-6">Zone</th>
                <th scope="col" className="px-3 py-2.5 font-normal">Counsellor</th>
                <th scope="col" className="px-3 py-2.5 font-normal">Zonal Pastor</th>
                <th scope="col" className="px-5 py-2.5 text-right font-normal sm:px-6">Active cases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/80">
              {cov.map((z) => (
                <tr key={z.zone} className={clsx(!z.counsellor && "bg-bad-soft/30")}>
                  <th scope="row" className="px-5 py-3 font-medium sm:px-6">
                    {z.zone}
                    <span className="block text-[12.5px] font-normal text-muted">{z.area}</span>
                  </th>
                  <td className="px-3 py-3">
                    {z.counsellor ? (
                      <span className="flex items-center gap-2">
                        <Avatar name={z.counsellor} size={24} />
                        <span>
                          {z.counsellor}
                          {z.level === "Area" && <span className="block text-[12px] text-muted">Covers the whole Area</span>}
                        </span>
                      </span>
                    ) : (
                      <span className="flex flex-wrap items-center gap-2">
                        <StatusPill tone="bad">No counsellor</StatusPill>
                        <Button size="sm" variant="secondary" onClick={() => { setForm((f) => ({ ...f, to: "", reason: "" })); setErrors({}); setModal({ assign: z.zone }); }}>
                          Assign
                        </Button>
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-ink-2">{z.zonalPastor}</td>
                  <td className="px-5 py-3 text-right tabular-nums sm:px-6">{z.active}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Directory */}
      <Card className="mt-6 overflow-hidden">
        <h2 className="px-5 pt-5 text-[15px] font-semibold sm:px-6">
          Counsellors <span className="font-normal text-muted tabular-nums">{list.filter((c) => c.active).length} active</span>
        </h2>
        <ul className="mt-3 divide-y divide-line/80 border-t border-line/80">
          {list.map((c) => (
            <li key={c.id} className={clsx("flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 sm:px-6", !c.active && "opacity-55")}>
              <Avatar name={c.name} size={36} />
              <div className="min-w-[200px] flex-1">
                <p className="text-[14.5px] font-medium">{c.name}</p>
                <p className="text-[12.5px] text-muted">{c.email}</p>
              </div>
              <div className="w-[230px] text-[13px]">
                <p>{c.role}</p>
                <p className="text-muted">{c.scope}</p>
              </div>
              <p className="w-20 text-[13px] text-ink-2 tabular-nums">{c.caseload} cases</p>
              {c.role === "Central Marriage Counsellor" ? (
                <span className="w-28 text-right text-[12.5px] text-muted">You</span>
              ) : c.active ? (
                <Button size="sm" variant="ghost" className="w-28" onClick={() => { setForm((f) => ({ ...f, to: "", reason: "" })); setErrors({}); setModal({ deactivate: c }); }}>
                  Deactivate
                </Button>
              ) : (
                <span className="w-28 text-right">
                  <StatusPill tone="neutral">Inactive</StatusPill>
                </span>
              )}
            </li>
          ))}
        </ul>
      </Card>

      {/* Add counsellor */}
      <Modal
        open={modal === "add"}
        onClose={() => setModal(null)}
        title="Add a counsellor"
        description="They’ll get an email to set up their account. New cases in their Zone go to them from now on."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const rowErrors = parse(`name,email,role,area,zone\n${[form.name, form.email, form.role, areas.find((a) => a.id === form.area)?.name ?? "", zones.find((z) => z.id === form.zone)?.name ?? ""].join(",")}`, list)[0].errors;
                const e: Record<string, string> = {};
                if (!form.name.trim()) e.name = "Enter their name.";
                const emailError = rowErrors.find((x) => x.toLowerCase().includes("email") || x.includes("directory"));
                if (emailError) e.email = emailError;
                if (!form.area) e.area = "Choose an Area.";
                if (form.role === ROLES[0] && !form.zone) e.zone = "Choose a Zone.";
                setErrors(e);
                if (Object.keys(e).length) return;
                const area = areas.find((a) => a.id === form.area)!.name;
                const zone = zones.find((z) => z.id === form.zone)?.name ?? "";
                addCounsellor(form.name.trim(), form.email.trim(), form.role, area, zone);
                setModal(null);
                toast(`${form.name.trim()} added. Their invitation is on its way.`);
              }}
            >
              Add counsellor
            </Button>
          </>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" error={errors.name} className="sm:col-span-2">
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="For example, Sis. Grace Udo" />
          </Field>
          <Field label="Email" error={errors.email} className="sm:col-span-2">
            <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </Field>
          <Field label="Role" className="sm:col-span-2">
            <Select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value, zone: "" }))}>
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </Select>
          </Field>
          <Field label="Area" error={errors.area}>
            <Select value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value, zone: "" }))}>
              <option value="">Choose an Area</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </Field>
          {form.role === ROLES[0] && (
            <Field label="Zone" error={errors.zone}>
              <Select value={form.zone} disabled={!form.area} onChange={(e) => setForm((f) => ({ ...f, zone: e.target.value }))}>
                <option value="">{form.area ? "Choose a Zone" : "Choose an Area first"}</option>
                {zones.filter((z) => z.areaId === form.area).map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}
        </div>
      </Modal>

      {/* Bulk upload */}
      <Modal
        open={modal === "bulk"}
        onClose={() => setModal(null)}
        size="lg"
        title="Bulk upload counsellors"
        description="Upload the department’s spreadsheet template, saved as CSV. Every row is checked before anything changes."
        footer={
          rows ? (
            <>
              <Button variant="ghost" onClick={() => setRows(null)}>
                Back
              </Button>
              {invalid.length > 0 && (
                <Button
                  variant="secondary"
                  onClick={() => download("counsellor-upload-errors.csv", "line,name,email,errors\n" + invalid.map((r) => [r.line, r.name, r.email, `"${r.errors.join("; ")}"`].join(",")).join("\n"))}
                >
                  <Download className="size-4" aria-hidden />
                  Error report
                </Button>
              )}
              <Button
                disabled={valid.length === 0}
                onClick={() => {
                  valid.forEach((r) => addCounsellor(r.name, r.email, r.role, r.area, r.zone));
                  setModal(null);
                  toast(`${valid.length} counsellor${valid.length === 1 ? "" : "s"} imported. ${invalid.length} row${invalid.length === 1 ? " was" : "s were"} skipped.`);
                }}
              >
                Import {valid.length} valid row{valid.length === 1 ? "" : "s"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setModal(null)}>
                Cancel
              </Button>
              <Button disabled={!csv.trim()} onClick={() => setRows(parse(csv, list))}>
                Check rows
              </Button>
            </>
          )
        }
      >
        {!rows ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 rounded-[14px] bg-sunken/70 p-4">
              <FileSpreadsheet className="size-5 text-muted" aria-hidden />
              <p className="flex-1 text-[14px]">Columns: name, email, role, area, zone. Leave zone empty for Area counsellors.</p>
              <Button size="sm" variant="secondary" onClick={() => download("counsellor-template.csv", TEMPLATE)}>
                <Download className="size-3.5" aria-hidden />
                Template
              </Button>
            </div>
            <label className="block">
              <span className="text-[14px] font-medium">Choose a CSV file</span>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) setCsv(await f.text());
                }}
                className="mt-2 block w-full text-[14px] file:mr-3 file:h-9 file:rounded-full file:border-0 file:bg-ink file:px-4 file:text-[13px] file:font-medium file:text-white"
              />
            </label>
            <Field label="Or paste the rows" hint={<button type="button" className="underline underline-offset-4" onClick={() => setCsv(SAMPLE)}>Prototype: load a sample with some mistakes</button>}>
              <Textarea rows={7} value={csv} onChange={(e) => setCsv(e.target.value)} className="font-mono text-[12.5px]" placeholder={TEMPLATE} />
            </Field>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-2">
              <StatusPill tone="ok">{valid.length} ready to import</StatusPill>
              {invalid.length > 0 && <StatusPill tone="bad">{invalid.length} with problems</StatusPill>}
            </div>
            <ul className="mt-4 divide-y divide-line/80 rounded-[14px] ring-1 ring-line">
              {rows.map((r) => (
                <li key={r.line} className="flex gap-3 px-4 py-3 text-[13.5px]">
                  <span className={clsx("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full", r.errors.length ? "bg-bad-soft text-bad" : "bg-ok-soft text-ok")}>
                    {r.errors.length ? <CircleAlert className="size-3.5" aria-hidden /> : <Check className="size-3.5" strokeWidth={3} aria-hidden />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p>
                      <span className="text-muted tabular-nums">Row {r.line}:</span> <span className="font-medium">{r.name || "No name"}</span>{" "}
                      <span className="text-muted">{r.zone || r.area}</span>
                    </p>
                    {r.errors.length > 0 && <p className="mt-0.5 text-bad">{r.errors.join(". ")}.</p>}
                  </div>
                </li>
              ))}
            </ul>
            {invalid.length > 0 && <p className="mt-4 text-[13px] text-muted">Rows with problems won’t be imported. Fix them in the spreadsheet and upload them again.</p>}
          </div>
        )}
      </Modal>

      {/* Assign uncovered Zone */}
      {typeof modal === "object" && modal && "assign" in modal && (
        <Modal
          open
          onClose={() => setModal(null)}
          title={`Cover ${modal.assign}`}
          description="Choose a counsellor to take new cases in this Zone. Unassigned cases there move to them now."
          footer={
            <>
              <Button variant="ghost" onClick={() => setModal(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!form.to) return setErrors({ to: "Choose a counsellor." });
                  setCov((c) => c.map((z) => (z.zone === modal.assign ? { ...z, counsellor: form.to, level: "Zonal" } : z)));
                  toast(`${form.to} now covers ${modal.assign}.`);
                  setModal(null);
                }}
              >
                Assign
              </Button>
            </>
          }
        >
          <Field label="Counsellor" error={errors.to}>
            <Select value={form.to} onChange={(e) => { setForm((f) => ({ ...f, to: e.target.value })); setErrors({}); }}>
              <option value="">Choose one</option>
              {list.filter((c) => c.active).map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.scope})
                </option>
              ))}
            </Select>
          </Field>
        </Modal>
      )}

      {/* Deactivate */}
      {typeof modal === "object" && modal && "deactivate" in modal && (
        <Modal
          open
          onClose={() => setModal(null)}
          title={`Deactivate ${modal.deactivate.name}?`}
          description={`Their ${modal.deactivate.caseload} cases must move to another counsellor first. History, decisions and messages move with each case.`}
          footer={
            <>
              <Button variant="ghost" onClick={() => setModal(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  const e: Record<string, string> = {};
                  if (!form.to) e.to = "Choose who takes their cases.";
                  if (form.reason.trim().length < 10) e.reason = "A reason is required.";
                  setErrors(e);
                  if (Object.keys(e).length) return;
                  const who = modal.deactivate;
                  setList((l) => l.map((c) => (c.id === who.id ? { ...c, active: false, caseload: 0 } : c.name === form.to ? { ...c, caseload: c.caseload + who.caseload } : c)));
                  setCov((c) => c.map((z) => (z.counsellor === who.name ? { ...z, counsellor: form.to } : z)));
                  toast(`${who.name} deactivated. ${who.caseload} cases moved to ${form.to}.`);
                  setModal(null);
                }}
              >
                Move cases and deactivate
              </Button>
            </>
          }
        >
          <div className="space-y-5">
            <Field label="Move their cases to" error={errors.to}>
              <Select value={form.to} onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}>
                <option value="">Choose one</option>
                {list.filter((c) => c.active && c.id !== modal.deactivate.id).map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.caseload} cases)
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Reason" error={errors.reason}>
              <Textarea rows={3} value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} />
            </Field>
            <p className="flex gap-2 text-[13px] text-muted">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              Candidates are told their counsellor has changed.
            </p>
          </div>
        </Modal>
      )}
      {toastNode}
    </div>
  );
}
