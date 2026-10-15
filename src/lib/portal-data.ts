/*
  Candidate portal mock data: four personas covering the main journey states.
  In production these views are derived from workflow events (PRD §6.4: progress
  comes from recorded events and approvals, never from the candidate ticking boxes).
*/

import type { StageView } from "@/components/journey-path";
import type { Tone } from "@/components/ui";

export type PersonaId = "new" | "tunde" | "daniel" | "zainab" | "kunle";

export interface NextAction {
  tone: Tone;
  status: string;
  due?: string;
  title: string;
  body: string;
  quote?: { text: string; author: string; when: string };
  primary: { label: string; href: string; icon: "upload" | "reply" | "calendar" | "heart" | "id" };
  secondary?: { label: string; href: string };
  footnote?: string;
}

export interface Check {
  label: string;
  meta: string;
  tone: Tone;
  state: "done" | "pending" | "action";
}

export interface AppointmentView {
  status: "required" | "requested" | "scheduled" | "completed";
  kind: string;
  day?: string; // "23"
  month?: string; // "Oct"
  weekday?: string; // "Thu"
  dateLabel?: string; // "Thu 23 Oct"
  time?: string;
  mode?: string;
  location?: string;
  with: string;
  note?: string;
}

export interface Update {
  icon: "alert" | "calendar" | "file" | "shield" | "mail" | "heart" | "check";
  tone: "bad" | "info" | "ok" | "neutral";
  title: string;
  body: string;
  when: string;
}

export interface Message {
  id: string;
  from: "counsellor" | "candidate" | "system";
  author: string;
  body: string;
  when: string;
}

export interface DocVersion {
  version: number;
  fileName: string;
  uploaded: string;
  status: "Submitted" | "Under Review" | "Accepted" | "Re-upload Required";
  note?: string;
}

export interface PastProposal {
  ref: string;
  started: string;
  closed: string;
  outcome: string;
  tone: Tone;
  summary: string;
}

export interface Session {
  title: string;
  description: string;
  status: "completed" | "scheduled" | "not_scheduled";
  when?: string;
  where?: string;
  note?: string;
}

export interface Persona {
  id: PersonaId;
  name: string;
  firstName: string;
  gender: "brother" | "sister";
  profileRef: string;
  proposalRef: string;
  email: string;
  phone: string;
  dob: string;
  church: string;
  zone: string;
  area: string;
  registered: string;
  profileConfirmed: string;
  overallStatus: { label: string; tone: Tone };
  counsellor: { name: string; office: string; address: string };
  pastor: { name: string; church: string; status: string; tone: Tone };
  stages: StageView[];
  currentStage: number;
  summary: string;
  next: NextAction;
  checks: Check[];
  appointment: AppointmentView | null;
  identity: { status: "not_started" | "submitted" | "verified" | "rejected"; docType?: string; when?: string; note?: string };
  consent: {
    status: "locked" | "not_uploaded" | "submitted" | "under_review" | "accepted" | "reupload_required";
    lockReason?: string;
    due?: string;
    returnNote?: { text: string; author: string; when: string };
    versions: DocVersion[];
  };
  updates: Update[];
  messages: Message[];
  unread: number;
  proposal:
    | { kind: "locked"; reason: string }
    | { kind: "share_intention"; code: string }
    | { kind: "awaiting_sister"; code: string; sharedOn: string }
    | { kind: "respond"; partnerFirstName: string; code: string; sharedOn: string; caseRef: string }
    | { kind: "active"; partnerFirstName: string; caseRef: string; acceptedOn: string };
  history: PastProposal[];
  sessions?: Session[];
}

const counsellor = {
  name: "Sis. Ngozi Okafor",
  office: "Ikeja Zone Family Office",
  address: "14 Allen Avenue, Ikeja",
};

/* ---------------- Femi: just registered ---------------- */

const femi: Persona = {
  id: "new",
  name: "Femi Adeola",
  firstName: "Femi",
  gender: "brother",
  profileRef: "FD-8N2K4R",
  proposalRef: "APP-26-0431",
  email: "femi.adeola@example.com",
  phone: "+234 803 555 0178",
  dob: "2 June 1997",
  church: "Ogba",
  zone: "Ikeja Zone",
  area: "Lagos Area",
  registered: "15 Oct 2026",
  profileConfirmed: "15 Oct 2026",
  overallStatus: { label: "Identity Verification Pending", tone: "wait" },
  counsellor,
  pastor: { name: "Pastor Grace Bello", church: "Ogba", status: "Link sent today", tone: "wait" },
  currentStage: 1,
  summary: "Stage 2 of 8: Verify your identity",
  stages: [
    { key: "account", title: "Create your account", state: "done", status: "Completed", detail: "Email verified today", href: "/portal/profile" },
    { key: "identity", title: "Verify your identity", state: "action", status: "Awaiting Candidate", detail: "Upload a photo ID", href: "/portal/identity" },
    { key: "pastor", title: "Pastor's introduction", state: "waiting", status: "Pending Pastor", detail: "Link sent to Pastor Grace Bello today" },
    { key: "appointment", title: "Meet your counsellor", state: "locked", status: "Not Started", lockReason: "Opens when your identity and your Pastor’s introduction are confirmed." },
    { key: "consent", title: "Parental consent letter", state: "locked", status: "Not Started", lockReason: "Opens after your Pastor’s introduction." },
    { key: "intention", title: "Share your intention with the sister", state: "locked", status: "Not Started", lockReason: "Opens when your consent letter is accepted and your first appointment is complete." },
    { key: "response", title: "The sister's response", state: "locked", status: "Not Started", lockReason: "Opens after you confirm you have shared your intention." },
    { key: "counselling", title: "Counselling and church guidelines", state: "locked", status: "Not Started", lockReason: "Opens once the sister accepts the proposal." },
  ],
  next: {
    tone: "action",
    status: "Awaiting Candidate",
    title: "Verify your identity",
    body: "Upload a clear photo of your passport, national ID card, driver’s licence or voter’s card. A counsellor checks it, usually within two working days.",
    primary: { label: "Upload your ID", href: "/portal/identity", icon: "id" },
    secondary: { label: "What counts as valid ID?", href: "/portal/identity" },
    footnote: "Your Pastor’s introduction happens at the same time, so you don’t need to wait for it.",
  },
  checks: [
    { label: "Email address", meta: "Verified today", tone: "ok", state: "done" },
    { label: "Identity", meta: "Not started", tone: "action", state: "action" },
    { label: "Pastor Grace Bello", meta: "Ogba, introduction link sent today", tone: "wait", state: "pending" },
  ],
  appointment: null,
  identity: { status: "not_started" },
  consent: { status: "locked", lockReason: "Opens after your Pastor’s introduction.", versions: [] },
  updates: [
    { icon: "mail", tone: "neutral", title: "Introduction link sent to your Pastor", body: "Pastor Grace Bello has a private link to introduce you.", when: "Today, 10:16" },
    { icon: "check", tone: "ok", title: "Email verified", body: "femi.adeola@example.com", when: "Today, 10:15" },
    { icon: "shield", tone: "neutral", title: "Profile created", body: "Your reference is FD-8N2K4R.", when: "Today, 10:12" },
  ],
  messages: [
    {
      id: "m1",
      from: "counsellor",
      author: "Sis. Ngozi Okafor",
      body: "Welcome, Femi. I’m the marriage counsellor for Ikeja Zone and I’ll walk with you through each stage. Start by verifying your identity, and write to me here if anything is unclear.",
      when: "Today, 10:20",
    },
  ],
  unread: 1,
  proposal: { kind: "locked", reason: "You can share your intention once your consent letter is accepted and your first appointment is complete." },
  history: [],
};

/* ---------------- Tunde: consent letter returned ---------------- */

const tunde: Persona = {
  id: "tunde",
  name: "Tunde Bakare",
  firstName: "Tunde",
  gender: "brother",
  profileRef: "FD-7K3P9Q",
  proposalRef: "APP-26-0418",
  email: "tunde.bakare@example.com",
  phone: "+234 802 555 0133",
  dob: "18 January 1995",
  church: "Ikeja Central",
  zone: "Ikeja Zone",
  area: "Lagos Area",
  registered: "27 Sep 2026",
  profileConfirmed: "27 Sep 2026",
  overallStatus: { label: "Validated", tone: "ok" },
  counsellor,
  pastor: { name: "Pastor Samuel Adeyemi", church: "Ikeja Central", status: "Confirmed 2 Oct", tone: "ok" },
  currentStage: 4,
  summary: "Stage 5 of 8: Parental consent letter",
  stages: [
    { key: "account", title: "Create your account", state: "done", status: "Completed", detail: "Email verified on 28 Sep", href: "/portal/profile" },
    { key: "identity", title: "Verify your identity", state: "done", status: "Completed", detail: "National ID card verified on 30 Sep", href: "/portal/identity" },
    { key: "pastor", title: "Pastor's introduction", state: "done", status: "Completed", detail: "Pastor Samuel Adeyemi confirmed you on 2 Oct" },
    { key: "appointment", title: "Meet your counsellor", state: "waiting", status: "Appointment Scheduled", detail: "Thu 23 Oct at 10:00 with Sis. Ngozi Okafor", href: "/portal/appointment" },
    { key: "consent", title: "Parental consent letter", state: "returned", status: "Returned for Correction", detail: "Signature missing. Upload a new letter by Tue 21 Oct.", href: "/portal/documents" },
    { key: "intention", title: "Share your intention with the sister", state: "locked", status: "Not Started", lockReason: "Opens when your consent letter is accepted and your first appointment is complete." },
    { key: "response", title: "The sister's response", state: "locked", status: "Not Started", lockReason: "Opens after you confirm you have shared your intention." },
    { key: "counselling", title: "Counselling and church guidelines", state: "locked", status: "Not Started", lockReason: "Opens once the sister accepts the proposal." },
  ],
  next: {
    tone: "bad",
    status: "Returned for Correction",
    due: "Tue 21 Oct",
    title: "Upload a new parental consent letter",
    body: "Your counsellor reviewed the letter you uploaded on 6 Oct and needs a corrected copy before your intention can be shared.",
    quote: {
      text: "Thank you for sending this. The letter needs your parents’ signatures and the date it was written. A photo of the signed page is fine.",
      author: "Sis. Ngozi Okafor",
      when: "14 Oct",
    },
    primary: { label: "Upload new letter", href: "/portal/documents", icon: "upload" },
    secondary: { label: "Ask a question", href: "/portal/messages" },
    footnote: "PDF, JPG or PNG, up to 5 MB",
  },
  checks: [
    { label: "Email address", meta: "Verified 28 Sep", tone: "ok", state: "done" },
    { label: "Identity", meta: "Verified 30 Sep", tone: "ok", state: "done" },
    { label: "Pastor Samuel Adeyemi", meta: "Ikeja Central, confirmed 2 Oct", tone: "ok", state: "done" },
  ],
  appointment: {
    status: "scheduled",
    kind: "First appointment",
    day: "23",
    month: "Oct",
    weekday: "Thu",
    dateLabel: "Thursday 23 October",
    time: "10:00 to 10:45",
    mode: "In person",
    location: "Ikeja Zone Family Office, 14 Allen Avenue",
    with: "Sis. Ngozi Okafor",
    note: "Bring your photo ID. The session is about 45 minutes.",
  },
  identity: { status: "verified", docType: "National ID card", when: "30 Sep" },
  consent: {
    status: "reupload_required",
    due: "Tue 21 Oct",
    returnNote: {
      text: "Thank you for sending this. The letter needs your parents’ signatures and the date it was written. A photo of the signed page is fine.",
      author: "Sis. Ngozi Okafor",
      when: "14 Oct",
    },
    versions: [
      { version: 1, fileName: "consent-letter-bakare.pdf", uploaded: "6 Oct, 19:42", status: "Re-upload Required", note: "Signature and date missing." },
    ],
  },
  updates: [
    { icon: "alert", tone: "bad", title: "Consent letter returned", body: "Sis. Ngozi Okafor asked for a signed and dated copy.", when: "Tue 14 Oct, 16:20" },
    { icon: "calendar", tone: "info", title: "Appointment confirmed", body: "Thu 23 Oct at 10:00, Ikeja Zone Family Office.", when: "Fri 10 Oct, 11:05" },
    { icon: "file", tone: "neutral", title: "You uploaded your consent letter", body: "consent-letter-bakare.pdf, version 1", when: "Mon 6 Oct, 19:42" },
    { icon: "shield", tone: "ok", title: "Pastor’s introduction received", body: "Pastor Samuel Adeyemi confirmed your membership.", when: "Thu 2 Oct, 08:15" },
  ],
  messages: [
    { id: "m1", from: "counsellor", author: "Sis. Ngozi Okafor", body: "Welcome, Tunde. I’m the marriage counsellor for Ikeja Zone. Write to me here whenever you have a question.", when: "27 Sep, 18:40" },
    { id: "m2", from: "system", author: "Portal", body: "Your appointment is confirmed for Thursday 23 October at 10:00.", when: "10 Oct, 11:05" },
    { id: "m3", from: "counsellor", author: "Sis. Ngozi Okafor", body: "Thank you for sending your consent letter. It needs your parents’ signatures and the date it was written. A photo of the signed page is fine.", when: "14 Oct, 16:20" },
    { id: "m4", from: "counsellor", author: "Sis. Ngozi Okafor", body: "Also, please bring your photo ID to our appointment on the 23rd.", when: "14 Oct, 16:22" },
  ],
  unread: 2,
  proposal: { kind: "locked", reason: "You can share your intention once your consent letter is accepted and your first appointment is complete." },
  history: [],
};

/* ---------------- Daniel: ready to share his intention ---------------- */

const daniel: Persona = {
  id: "daniel",
  name: "Daniel Okoro",
  firstName: "Daniel",
  gender: "brother",
  profileRef: "FD-9Q4H7L",
  proposalRef: "APP-26-0402",
  email: "daniel.okoro@example.com",
  phone: "+234 803 555 0142",
  dob: "21 February 1997",
  church: "Ikeja Central",
  zone: "Ikeja Zone",
  area: "Lagos Area",
  registered: "22 Sep 2026",
  profileConfirmed: "22 Sep 2026",
  overallStatus: { label: "Validated", tone: "ok" },
  counsellor,
  pastor: { name: "Pastor Samuel Adeyemi", church: "Ikeja Central", status: "Confirmed 25 Sep", tone: "ok" },
  currentStage: 5,
  summary: "Stage 6 of 8: Share your intention",
  stages: [
    { key: "account", title: "Create your account", state: "done", status: "Completed", detail: "Email verified on 22 Sep", href: "/portal/profile" },
    { key: "identity", title: "Verify your identity", state: "done", status: "Completed", detail: "Passport verified on 24 Sep", href: "/portal/identity" },
    { key: "pastor", title: "Pastor's introduction", state: "done", status: "Completed", detail: "Pastor Samuel Adeyemi confirmed you on 25 Sep" },
    { key: "appointment", title: "Meet your counsellor", state: "done", status: "Completed", detail: "Held 9 Oct", href: "/portal/appointment" },
    { key: "consent", title: "Parental consent letter", state: "done", status: "Completed", detail: "Version 2 accepted today", href: "/portal/documents" },
    { key: "intention", title: "Share your intention with the sister", state: "action", status: "Awaiting Candidate", detail: "Share your code and confirm", href: "/portal/proposal" },
    { key: "response", title: "The sister's response", state: "locked", status: "Not Started", lockReason: "Opens after you confirm you have shared your intention." },
    { key: "counselling", title: "Counselling and church guidelines", state: "locked", status: "Not Started", lockReason: "Opens once the sister accepts the proposal." },
  ],
  next: {
    tone: "action",
    status: "Awaiting Candidate",
    title: "Formally share your intention with the sister",
    body: "Your checks and consent letter are complete. Speak with the sister as the church guides, give her your proposal code, then confirm here that you have done so.",
    primary: { label: "Get your proposal code", href: "/portal/proposal", icon: "heart" },
    secondary: { label: "Ask your counsellor first", href: "/portal/messages" },
  },
  checks: [
    { label: "Email address", meta: "Verified 22 Sep", tone: "ok", state: "done" },
    { label: "Identity", meta: "Verified 24 Sep", tone: "ok", state: "done" },
    { label: "Pastor Samuel Adeyemi", meta: "Ikeja Central, confirmed 25 Sep", tone: "ok", state: "done" },
  ],
  appointment: {
    status: "completed",
    kind: "First appointment",
    day: "9",
    month: "Oct",
    weekday: "Thu",
    dateLabel: "Thursday 9 October",
    time: "11:00 to 11:45",
    mode: "In person",
    location: "Ikeja Zone Family Office",
    with: "Sis. Ngozi Okafor",
  },
  identity: { status: "verified", docType: "International passport", when: "24 Sep" },
  consent: {
    status: "accepted",
    versions: [
      { version: 1, fileName: "consent-letter-okoro.jpg", uploaded: "4 Oct, 20:15", status: "Re-upload Required", note: "Not dated." },
      { version: 2, fileName: "consent-letter-okoro-v2.pdf", uploaded: "Today, 09:41", status: "Accepted" },
    ],
  },
  updates: [
    { icon: "check", tone: "ok", title: "Consent letter accepted", body: "Version 2, reviewed by Sis. Ngozi Okafor.", when: "Today, 14:05" },
    { icon: "file", tone: "neutral", title: "You uploaded your consent letter", body: "consent-letter-okoro-v2.pdf, version 2", when: "Today, 09:41" },
    { icon: "calendar", tone: "ok", title: "First appointment completed", body: "With Sis. Ngozi Okafor.", when: "Thu 9 Oct, 11:50" },
  ],
  messages: [
    { id: "m1", from: "counsellor", author: "Sis. Ngozi Okafor", body: "Hello Daniel, thank you for your consent letter. It needs to be dated before I can accept it. Please upload a dated copy when you can.", when: "8 Oct, 14:02" },
    { id: "m2", from: "candidate", author: "Daniel Okoro", body: "My parents have now signed and dated it. Thank you for your patience.", when: "Today, 09:43" },
    { id: "m3", from: "system", author: "Portal", body: "Your consent letter has been accepted.", when: "Today, 14:05" },
  ],
  unread: 1,
  proposal: { kind: "share_intention", code: "R4D-9TX" },
  history: [],
};

/* ---------------- Zainab: sister, ready to respond ---------------- */

const zainab: Persona = {
  id: "zainab",
  name: "Zainab Yusuf",
  firstName: "Zainab",
  gender: "sister",
  profileRef: "FD-3H2G6S",
  proposalRef: "APP-26-0397",
  email: "zainab.yusuf@example.com",
  phone: "+234 809 555 0116",
  dob: "9 November 1996",
  church: "Ikeja Central",
  zone: "Ikeja Zone",
  area: "Lagos Area",
  registered: "14 Mar 2025",
  profileConfirmed: "22 Sep 2026",
  overallStatus: { label: "Validated", tone: "ok" },
  counsellor,
  pastor: { name: "Pastor Michael Ade", church: "Ikeja Central", status: "Confirmed 26 Sep", tone: "ok" },
  currentStage: 5,
  summary: "Stage 6 of 7: Respond to the proposal",
  stages: [
    { key: "account", title: "Create your account", state: "done", status: "Completed", detail: "Profile reviewed on 22 Sep", href: "/portal/profile" },
    { key: "identity", title: "Verify your identity", state: "done", status: "Completed", detail: "Passport verified, carried over from your profile", href: "/portal/identity" },
    { key: "pastor", title: "Pastor's introduction", state: "done", status: "Completed", detail: "Pastor Michael Ade confirmed you on 26 Sep" },
    { key: "appointment", title: "Meet your counsellor", state: "done", status: "Completed", detail: "Held 7 Oct", href: "/portal/appointment" },
    { key: "consent", title: "Parental consent letter", state: "done", status: "Completed", detail: "Accepted 11 Oct", href: "/portal/documents" },
    { key: "response", title: "Respond to the proposal", state: "action", status: "Awaiting Candidate", detail: "Ibrahim shared his intention on 12 Oct", href: "/portal/proposal" },
    { key: "counselling", title: "Counselling and church guidelines", state: "locked", status: "Not Started", lockReason: "Opens if you accept the proposal." },
  ],
  next: {
    tone: "action",
    status: "Awaiting Candidate",
    title: "Respond to Ibrahim’s proposal",
    body: "Ibrahim formally shared his intention with you on 12 Oct. Your checks are complete, so you can now record your response. Take the time you need to pray it through.",
    primary: { label: "Record your response", href: "/portal/proposal", icon: "heart" },
    secondary: { label: "Talk to your counsellor", href: "/portal/messages" },
    footnote: "Your response is final for this proposal and is shared with Ibrahim through the department.",
  },
  checks: [
    { label: "Email address", meta: "Verified, profile reviewed 22 Sep", tone: "ok", state: "done" },
    { label: "Identity", meta: "Passport, verified March 2025", tone: "ok", state: "done" },
    { label: "Pastor Michael Ade", meta: "Ikeja Central, confirmed 26 Sep", tone: "ok", state: "done" },
  ],
  appointment: {
    status: "completed",
    kind: "First appointment",
    day: "7",
    month: "Oct",
    weekday: "Tue",
    dateLabel: "Tuesday 7 October",
    time: "14:00 to 14:45",
    mode: "Video call",
    with: "Sis. Ngozi Okafor",
  },
  identity: { status: "verified", docType: "International passport", when: "March 2025", note: "Carried over from your profile" },
  consent: {
    status: "accepted",
    versions: [{ version: 1, fileName: "consent-letter-yusuf.pdf", uploaded: "9 Oct, 08:30", status: "Accepted" }],
  },
  updates: [
    { icon: "heart", tone: "info", title: "A proposal is waiting for your response", body: "Ibrahim shared his intention and linked his proposal with code K7Q-4MZ.", when: "Sun 12 Oct, 17:02" },
    { icon: "check", tone: "ok", title: "Consent letter accepted", body: "Reviewed by Sis. Ngozi Okafor.", when: "Sat 11 Oct, 10:14" },
    { icon: "calendar", tone: "ok", title: "First appointment completed", body: "Video call with Sis. Ngozi Okafor.", when: "Tue 7 Oct, 14:50" },
    { icon: "shield", tone: "ok", title: "Pastor’s introduction received", body: "Pastor Michael Ade confirmed your membership.", when: "Fri 26 Sep, 09:30" },
  ],
  messages: [
    { id: "m1", from: "counsellor", author: "Sis. Ngozi Okafor", body: "Welcome back, Zainab. Your new proposal has its own reference, APP-26-0397. Nothing from your earlier proposal carries into this one.", when: "22 Sep, 12:00" },
    { id: "m2", from: "system", author: "Portal", body: "Your consent letter has been accepted.", when: "11 Oct, 10:14" },
    { id: "m3", from: "counsellor", author: "Sis. Ngozi Okafor", body: "Ibrahim has linked his proposal to yours. There’s no rush to respond. If you’d like to talk anything through first, I’m here.", when: "12 Oct, 17:30" },
  ],
  unread: 1,
  proposal: { kind: "respond", partnerFirstName: "Ibrahim", code: "K7Q-4MZ", sharedOn: "Sunday 12 October", caseRef: "PC-26-0118" },
  history: [
    {
      ref: "APP-25-0212",
      started: "March 2025",
      closed: "May 2025",
      outcome: "Closed: you declined",
      tone: "neutral",
      summary: "This proposal was closed when you declined it. It stays in your history, and nothing from it carried into your current proposal.",
    },
  ],
};

/* ---------------- Kunle: in counselling ---------------- */

const kunle: Persona = {
  id: "kunle",
  name: "Kunle Ajayi",
  firstName: "Kunle",
  gender: "brother",
  profileRef: "FD-4R7B2Y",
  proposalRef: "APP-26-0350",
  email: "kunle.ajayi@example.com",
  phone: "+234 805 555 0124",
  dob: "4 August 1993",
  church: "Ikeja Central",
  zone: "Ikeja Zone",
  area: "Lagos Area",
  registered: "4 Aug 2026",
  profileConfirmed: "4 Aug 2026",
  overallStatus: { label: "In Progress", tone: "info" },
  counsellor,
  pastor: { name: "Pastor Samuel Adeyemi", church: "Ikeja Central", status: "Confirmed 8 Aug", tone: "ok" },
  currentStage: 7,
  summary: "Stage 8 of 8: Counselling, session 2 of 5",
  stages: [
    { key: "account", title: "Create your account", state: "done", status: "Completed", detail: "Email verified on 4 Aug", href: "/portal/profile" },
    { key: "identity", title: "Verify your identity", state: "done", status: "Completed", detail: "Driver’s licence verified on 6 Aug", href: "/portal/identity" },
    { key: "pastor", title: "Pastor's introduction", state: "done", status: "Completed", detail: "Pastor Samuel Adeyemi confirmed you on 8 Aug" },
    { key: "appointment", title: "Meet your counsellor", state: "done", status: "Completed", detail: "Held 21 Aug", href: "/portal/appointment" },
    { key: "consent", title: "Parental consent letter", state: "done", status: "Completed", detail: "Accepted 25 Aug", href: "/portal/documents" },
    { key: "intention", title: "Share your intention with the sister", state: "done", status: "Completed", detail: "Confirmed 30 Aug", href: "/portal/proposal" },
    { key: "response", title: "The sister's response", state: "done", status: "Completed", detail: "Bisi accepted on 19 Sep", href: "/portal/proposal" },
    { key: "counselling", title: "Counselling and church guidelines", state: "waiting", status: "In Progress", detail: "Session 2 of 5 on Thu 16 Oct", href: "/portal/counselling" },
  ],
  next: {
    tone: "info",
    status: "Scheduled",
    title: "Counselling session 2: Communication and conflict",
    body: "Tomorrow, Thursday 16 October at 11:00, at the Ikeja Zone Family Office with Bisi and Sis. Ngozi Okafor.",
    primary: { label: "View your counselling plan", href: "/portal/counselling", icon: "calendar" },
    secondary: { label: "Message your counsellor", href: "/portal/messages" },
    footnote: "Both of you need to attend each session for it to count.",
  },
  checks: [
    { label: "Email address", meta: "Verified 4 Aug", tone: "ok", state: "done" },
    { label: "Identity", meta: "Verified 6 Aug", tone: "ok", state: "done" },
    { label: "Pastor Samuel Adeyemi", meta: "Ikeja Central, confirmed 8 Aug", tone: "ok", state: "done" },
  ],
  appointment: {
    status: "scheduled",
    kind: "Counselling session 2",
    day: "16",
    month: "Oct",
    weekday: "Thu",
    dateLabel: "Thursday 16 October",
    time: "11:00 to 12:15",
    mode: "In person",
    location: "Ikeja Zone Family Office, 14 Allen Avenue",
    with: "Sis. Ngozi Okafor",
  },
  identity: { status: "verified", docType: "Driver’s licence", when: "6 Aug" },
  consent: {
    status: "accepted",
    versions: [{ version: 1, fileName: "consent-ajayi.pdf", uploaded: "22 Aug, 21:10", status: "Accepted" }],
  },
  updates: [
    { icon: "calendar", tone: "info", title: "Session 2 confirmed", body: "Thu 16 Oct at 11:00, Ikeja Zone Family Office.", when: "Mon 6 Oct, 09:00" },
    { icon: "check", tone: "ok", title: "Session 1 signed off", body: "Foundations of a Christian marriage.", when: "Thu 2 Oct, 13:10" },
    { icon: "heart", tone: "ok", title: "Bisi accepted your proposal", body: "Counselling has begun.", when: "Fri 19 Sep, 18:45" },
  ],
  messages: [
    { id: "m1", from: "counsellor", author: "Sis. Ngozi Okafor", body: "Congratulations to you both. Our counselling plan has five sessions. I’ll confirm each date here.", when: "19 Sep, 19:00" },
    { id: "m2", from: "system", author: "Portal", body: "Session 2 is confirmed for Thursday 16 October at 11:00.", when: "6 Oct, 09:00" },
  ],
  unread: 0,
  proposal: { kind: "active", partnerFirstName: "Bisi", caseRef: "PC-26-0102", acceptedOn: "19 September" },
  history: [],
  sessions: [
    { title: "Foundations of a Christian marriage", description: "Covenant, roles and expectations.", status: "completed", when: "Thu 2 Oct, 11:00", note: "Signed off by Sis. Ngozi Okafor. Both attended." },
    { title: "Communication and conflict", description: "Listening well and resolving disagreements.", status: "scheduled", when: "Thu 16 Oct, 11:00", where: "Ikeja Zone Family Office" },
    { title: "Finances and stewardship", description: "Budgeting, giving and shared decisions.", status: "not_scheduled" },
    { title: "Family, in-laws and expectations", description: "Building a new household with both families.", status: "not_scheduled" },
    { title: "Final review and sign-off", description: "Your counsellor confirms the plan is complete.", status: "not_scheduled" },
  ],
};

export const personas: Record<PersonaId, Persona> = { new: femi, tunde, daniel, zainab, kunle };
export const personaIds = Object.keys(personas) as PersonaId[];
