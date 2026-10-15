/*
  Mock case records for the counsellor's case view. Each candidate has a decision
  panel matching the stage that currently needs attention.
*/

import type { StageState, StageView } from "@/components/journey-path";
import type { Tone } from "@/components/ui";

export interface CaseEvent {
  id: string;
  when: string;
  actor: string;
  actorType: "candidate" | "staff" | "pastor" | "system";
  action: string;
  detail?: string;
}

export interface Session {
  id: string;
  title: string;
  status: "completed" | "scheduled" | "not_scheduled";
  when?: string;
  attendance?: string;
  /** Scheduled for a future date: its outcome can't be recorded yet. */
  upcoming?: boolean;
}

export type Panel =
  | {
      kind: "identity_review";
      docType: string;
      files: string[];
      uploaded: string;
      onDocument: { name: string; dob: string; expires: string };
      onProfile: { name: string; dob: string };
    }
  | {
      kind: "consent_review";
      fileName: string;
      fileSize: string;
      uploaded: string;
      version: number;
      candidateNote?: string;
      previous: { version: number; uploaded: string; reason: string }[];
    }
  | {
      kind: "appointment_request";
      requested: string;
      preferred: { date: string; part: string }[];
      mode: string;
      note?: string;
    }
  | {
      kind: "pastor_pending";
      pastor: string;
      pastorEmail: string;
      sent: string;
      expires: string;
      opened?: string;
      reminders: number;
      /** Date of each reminder already sent, oldest first. */
      reminderDates: string[];
      overdueDays: number;
    }
  | {
      kind: "pastor_unconfirmed";
      pastor: string;
      standingInFor?: { name: string; reason: string };
      submitted: string;
      answers: { q: string; a: string }[];
      comments: string;
    }
  | { kind: "counselling"; partner: string; caseRef: string; sessions: Session[] }
  | { kind: "otp_pending"; email: string; registered: string; codesSent: number }
  | {
      kind: "waiting";
      waitingOn: "Candidate" | "Pastor";
      title: string;
      body: string;
      since: string;
      reminderTask?: string;
      reminderNote?: string;
    };

export interface CaseRecord {
  id: string;
  name: string;
  firstName: string;
  journey: "Brother" | "Sister";
  profileRef: string;
  proposalRef: string;
  validation: { label: string; tone: Tone };
  zone: string;
  area: string;
  registered: string;
  pastor: string;
  profile: { label: string; value: string }[];
  stages: StageView[];
  panel: Panel;
  pastorIntro?: { name: string; branch: string; submitted: string; answers: { q: string; a: string }[]; comments: string };
  appointment?: { status: string; tone: Tone; when: string; where: string; note?: string };
  proposalCase?: { ref: string; label: string; href: string };
  routing: { when: string; text: string }[];
  notes: { id: string; author: string; when: string; body: string }[];
  messages: { id: string; from: "staff" | "candidate"; author: string; when: string; body: string }[];
  history: CaseEvent[];
}

/* ---------- builders ---------- */

const titles = {
  Brother: ["Account and email", "Identity", "Pastor's introduction", "First appointment", "Parental consent letter", "Intention shared with the sister", "Sister's response", "Counselling"],
  Sister: ["Account and email", "Identity", "Pastor's introduction", "First appointment", "Parental consent letter", "Response to the proposal", "Counselling"],
};
const keys = {
  Brother: ["account", "identity", "pastor", "appointment", "consent", "intention", "response", "counselling"],
  Sister: ["account", "identity", "pastor", "appointment", "consent", "response", "counselling"],
};

const S = (c: string) => ({ d: "done", a: "action", r: "returned", w: "waiting", l: "locked" })[c] as StageState;

/** Build the stage list from a compact state string plus per-stage detail. */
function stages(
  journey: "Brother" | "Sister",
  code: string,
  detail: Record<number, { status?: string; detail?: string; tone?: Tone }> = {},
): StageView[] {
  return [...code].map((c, i) => {
    const state = S(c);
    const d = detail[i] ?? {};
    return {
      key: keys[journey][i],
      title: titles[journey][i],
      state,
      status: d.status ?? (state === "done" ? "Completed" : "Not Started"),
      detail: d.detail,
      tone: d.tone,
      lockReason: state === "locked" ? "Opens when the earlier stages are complete." : undefined,
    };
  });
}

function profile(name: string, extra: { phone: string; age: number; church: string }) {
  const email = `${name.toLowerCase().replace(/[^a-z ]/g, "").split(" ").join(".")}@example.com`;
  return [
    { label: "Email", value: email },
    { label: "Phone", value: extra.phone },
    { label: "Age", value: String(extra.age) },
    { label: "Church", value: extra.church },
    { label: "Area and zone", value: "Lagos Area, Ikeja Zone" },
  ];
}

const ngozi = "Sis. Ngozi Okafor";
const routing = (when: string) => [
  { when, text: "Routed to Ikeja Zone from the candidate’s church" },
  { when, text: `Assigned to ${ngozi}` },
];

const confirmedIntro = (name: string, branch: string, submitted: string, role: string, years: string, comments: string) => ({
  name,
  branch,
  submitted,
  answers: [
    { q: "Do you know this candidate?", a: "Yes" },
    { q: "What does the candidate do in the church?", a: role },
    { q: "Can you certify that the candidate is a member of this church?", a: "Yes" },
    { q: "How long have you known the candidate?", a: years },
  ],
  comments,
});

/* ---------- records ---------- */

const records: CaseRecord[] = [
  {
    id: "c1",
    name: "Chiamaka Eze",
    firstName: "Chiamaka",
    journey: "Sister",
    profileRef: "FD-3M8T2W",
    proposalRef: "APP-26-0428",
    validation: { label: "Identity Verification Pending", tone: "wait" },
    zone: "Ikeja Zone",
    area: "Lagos Area",
    registered: "13 Oct 2026",
    pastor: "Pastor Grace Bello",
    profile: profile("Chiamaka Eze", { phone: "+234 806 555 0190", age: 28, church: "Ogba" }),
    stages: stages("Sister", "dawllll", {
      0: { detail: "Verified 13 Oct" },
      1: { status: "Pending Counsellor Review", detail: "National ID card uploaded today" },
      2: { status: "Pending Pastor", detail: "Link sent to Pastor Grace Bello on 13 Oct" },
    }),
    panel: {
      kind: "identity_review",
      docType: "National ID card",
      files: ["id-front.jpg", "id-back.jpg"],
      uploaded: "Today, 12:40",
      onDocument: { name: "EZE, CHIAMAKA ADA", dob: "03 FEB 1998", expires: "11 JUN 2031" },
      onProfile: { name: "Chiamaka Eze", dob: "3 February 1998" },
    },
    routing: routing("13 Oct"),
    notes: [],
    messages: [{ id: "m1", from: "staff", author: ngozi, when: "13 Oct, 17:00", body: "Welcome, Chiamaka. Start by verifying your identity, and write to me here if anything is unclear." }],
    history: [
      { id: "h3", when: "Today, 12:40", actor: "Chiamaka Eze", actorType: "candidate", action: "Uploaded identity document", detail: "National ID card, front and back." },
      { id: "h2", when: "13 Oct, 16:31", actor: "System", actorType: "system", action: "Sent introduction link to Pastor Grace Bello" },
      { id: "h1", when: "13 Oct, 16:30", actor: "Chiamaka Eze", actorType: "candidate", action: "Registered and verified email" },
    ],
  },
  {
    id: "c2",
    name: "Daniel Okoro",
    firstName: "Daniel",
    journey: "Brother",
    profileRef: "FD-9Q4H7L",
    proposalRef: "APP-26-0402",
    validation: { label: "Validated", tone: "ok" },
    zone: "Ikeja Zone",
    area: "Lagos Area",
    registered: "22 Sep 2026",
    pastor: "Pastor Samuel Adeyemi",
    profile: profile("Daniel Okoro", { phone: "+234 803 555 0142", age: 29, church: "Ikeja Central" }),
    stages: stages("Brother", "ddddalll", {
      0: { detail: "Verified 22 Sep" },
      1: { detail: "Passport verified 24 Sep" },
      2: { detail: "Pastor Samuel Adeyemi, 25 Sep" },
      3: { detail: "Held 9 Oct" },
      4: { status: "Pending Counsellor Review", detail: "Version 2 uploaded today" },
    }),
    panel: {
      kind: "consent_review",
      fileName: "consent-letter-okoro-v2.pdf",
      fileSize: "412 KB, 1 page",
      uploaded: "Today, 09:41",
      version: 2,
      candidateNote: "My parents have now signed and dated it. Thank you for your patience.",
      previous: [{ version: 1, uploaded: "4 Oct", reason: "The letter was not dated." }],
    },
    pastorIntro: confirmedIntro("Pastor Samuel Adeyemi", "Ikeja Central", "25 Sep, 09:12", "Leads the ushering unit and sings in the choir.", "More than 5 years", "Daniel is faithful and dependable. He has served in the ushering unit since 2021 and attends the young adults’ fellowship."),
    appointment: { status: "Completed", tone: "ok", when: "Thu 9 Oct, 11:00", where: "In person, Ikeja Zone Family Office", note: "Introductory session held. Next step explained." },
    routing: routing("22 Sep"),
    notes: [{ id: "n1", author: ngozi, when: "9 Oct", body: "First appointment went well. Daniel understands the process and is ready to share his intention once the consent letter is in order." }],
    messages: [
      { id: "m1", from: "staff", author: ngozi, when: "8 Oct, 14:02", body: "Hello Daniel, thank you for your consent letter. It needs to be dated before I can accept it. Please upload a dated copy when you can." },
      { id: "m2", from: "candidate", author: "Daniel Okoro", when: "Today, 09:43", body: "My parents have now signed and dated it. Thank you for your patience." },
    ],
    history: [
      { id: "h9", when: "Today, 09:41", actor: "Daniel Okoro", actorType: "candidate", action: "Uploaded consent letter, version 2" },
      { id: "h8", when: "9 Oct, 11:50", actor: ngozi, actorType: "staff", action: "Marked first appointment completed" },
      { id: "h7", when: "8 Oct, 14:00", actor: ngozi, actorType: "staff", action: "Returned consent letter, version 1", detail: "Reason: the letter was not dated." },
      { id: "h6", when: "4 Oct, 20:15", actor: "Daniel Okoro", actorType: "candidate", action: "Uploaded consent letter, version 1" },
      { id: "h4", when: "25 Sep, 09:12", actor: "Pastor Samuel Adeyemi", actorType: "pastor", action: "Submitted introduction", detail: "Confirmed membership." },
      { id: "h3", when: "24 Sep, 16:05", actor: ngozi, actorType: "staff", action: "Verified identity document", detail: "International passport." },
      { id: "h1", when: "22 Sep, 18:30", actor: "Daniel Okoro", actorType: "candidate", action: "Registered and verified email" },
    ],
  },
  {
    id: "c3",
    name: "Funke Adebayo",
    firstName: "Funke",
    journey: "Sister",
    profileRef: "FD-2X6N8R",
    proposalRef: "APP-26-0409",
    validation: { label: "Validated", tone: "ok" },
    zone: "Ikeja Zone",
    area: "Lagos Area",
    registered: "26 Sep 2026",
    pastor: "Pastor Grace Bello",
    profile: profile("Funke Adebayo", { phone: "+234 807 555 0151", age: 27, church: "Ogba" }),
    stages: stages("Sister", "dddalll", {
      0: { detail: "Verified 26 Sep" },
      1: { detail: "Driver’s licence verified 29 Sep" },
      2: { detail: "Pastor Grace Bello, 1 Oct" },
      3: { status: "Appointment Requested", detail: "3 preferred times sent yesterday" },
    }),
    panel: {
      kind: "appointment_request",
      requested: "Yesterday, 18:20",
      preferred: [
        { date: "Mon 20 Oct", part: "Morning" },
        { date: "Tue 21 Oct", part: "Afternoon" },
        { date: "Fri 24 Oct", part: "Morning" },
      ],
      mode: "In person",
      note: "I work weekdays until 4pm except Mondays and Fridays.",
    },
    pastorIntro: confirmedIntro("Pastor Grace Bello", "Ogba", "1 Oct, 07:40", "Sunday school teacher for the children’s church.", "3 to 5 years", "A gentle and committed sister."),
    routing: routing("26 Sep"),
    notes: [],
    messages: [{ id: "m1", from: "candidate", author: "Funke Adebayo", when: "Yesterday, 18:21", body: "None of the open times work for me, so I’ve sent my preferred times. Thank you." }],
    history: [
      { id: "h3", when: "Yesterday, 18:20", actor: "Funke Adebayo", actorType: "candidate", action: "Requested an appointment", detail: "3 preferred times, in person." },
      { id: "h2", when: "1 Oct, 07:40", actor: "Pastor Grace Bello", actorType: "pastor", action: "Submitted introduction", detail: "Confirmed membership." },
      { id: "h1", when: "26 Sep, 20:02", actor: "Funke Adebayo", actorType: "candidate", action: "Registered and verified email" },
    ],
  },
  {
    id: "c4",
    name: "Emeka Nwosu",
    firstName: "Emeka",
    journey: "Brother",
    profileRef: "FD-5T1K9P",
    proposalRef: "APP-26-0384",
    validation: { label: "Pastor Assessment Pending", tone: "wait" },
    zone: "Ikeja Zone",
    area: "Lagos Area",
    registered: "6 Oct 2026",
    pastor: "Pastor John Ojo",
    profile: profile("Emeka Nwosu", { phone: "+234 808 555 0163", age: 31, church: "Maryland" }),
    stages: stages("Brother", "ddwlllll", {
      0: { detail: "Verified 6 Oct" },
      1: { detail: "Passport verified 7 Oct" },
      2: { status: "Pending Pastor", detail: "Overdue by 9 days" },
    }),
    panel: { kind: "pastor_pending", pastor: "Pastor John Ojo", pastorEmail: "j.ojo@example.org", sent: "6 Oct", expires: "20 Oct", reminders: 2, reminderDates: ["9 Oct", "13 Oct"], overdueDays: 9 },
    routing: routing("6 Oct"),
    notes: [{ id: "n1", author: ngozi, when: "13 Oct", body: "Called the Maryland church office; Pastor Ojo is travelling until the 18th." }],
    messages: [],
    history: [
      { id: "h4", when: "13 Oct, 09:00", actor: "System", actorType: "system", action: "Sent automatic reminder to Pastor John Ojo", detail: "Reminder 2 of 3." },
      { id: "h3", when: "9 Oct, 09:00", actor: "System", actorType: "system", action: "Sent automatic reminder to Pastor John Ojo", detail: "Reminder 1 of 3." },
      { id: "h2", when: "6 Oct, 21:11", actor: "System", actorType: "system", action: "Sent introduction link to Pastor John Ojo" },
      { id: "h1", when: "6 Oct, 21:10", actor: "Emeka Nwosu", actorType: "candidate", action: "Registered and verified email" },
    ],
  },
  {
    id: "c5",
    name: "Tunde Bakare",
    firstName: "Tunde",
    journey: "Brother",
    profileRef: "FD-7K3P9Q",
    proposalRef: "APP-26-0418",
    validation: { label: "Validated", tone: "ok" },
    zone: "Ikeja Zone",
    area: "Lagos Area",
    registered: "27 Sep 2026",
    pastor: "Pastor Samuel Adeyemi",
    profile: profile("Tunde Bakare", { phone: "+234 802 555 0133", age: 31, church: "Ikeja Central" }),
    stages: stages("Brother", "dddwrlll", {
      0: { detail: "Verified 28 Sep" },
      1: { detail: "National ID card verified 30 Sep" },
      2: { detail: "Pastor Samuel Adeyemi, 2 Oct" },
      3: { status: "Appointment Scheduled", detail: "Thu 23 Oct, 10:00" },
      4: { status: "Returned for Correction", detail: "Due Tue 21 Oct" },
    }),
    panel: {
      kind: "waiting",
      waitingOn: "Candidate",
      title: "Waiting for a corrected consent letter",
      body: "You returned version 1 on 14 Oct because the signatures and date were missing. Tunde has until Tue 21 Oct.",
      since: "14 Oct",
      reminderTask: "Upload a corrected parental consent letter",
      reminderNote: "No reminders sent yet. An automatic reminder goes on 17 Oct if nothing arrives.",
    },
    pastorIntro: confirmedIntro("Pastor Samuel Adeyemi", "Ikeja Central", "2 Oct, 08:15", "Member of the media unit.", "3 to 5 years", "Tunde is reliable and well liked."),
    appointment: { status: "Scheduled", tone: "info", when: "Thu 23 Oct, 10:00", where: "In person, Ikeja Zone Family Office" },
    routing: routing("27 Sep"),
    notes: [],
    messages: [
      { id: "m1", from: "staff", author: ngozi, when: "14 Oct, 16:20", body: "Thank you for sending your consent letter. It needs your parents’ signatures and the date it was written. A photo of the signed page is fine." },
    ],
    history: [
      { id: "h5", when: "14 Oct, 16:20", actor: ngozi, actorType: "staff", action: "Returned consent letter, version 1", detail: "Reason: missing signature and date." },
      { id: "h4", when: "10 Oct, 11:05", actor: ngozi, actorType: "staff", action: "Confirmed appointment for Thu 23 Oct, 10:00" },
      { id: "h3", when: "6 Oct, 19:42", actor: "Tunde Bakare", actorType: "candidate", action: "Uploaded consent letter, version 1" },
      { id: "h2", when: "2 Oct, 08:15", actor: "Pastor Samuel Adeyemi", actorType: "pastor", action: "Submitted introduction", detail: "Confirmed membership." },
      { id: "h1", when: "27 Sep, 18:35", actor: "Tunde Bakare", actorType: "candidate", action: "Registered and verified email" },
    ],
  },
  {
    id: "c6",
    name: "Ifeoma Chukwu",
    firstName: "Ifeoma",
    journey: "Sister",
    profileRef: "FD-8W3D5M",
    proposalRef: "APP-26-0391",
    validation: { label: "Further Information Required", tone: "bad" },
    zone: "Ikeja Zone",
    area: "Lagos Area",
    registered: "8 Oct 2026",
    pastor: "Pastor Michael Ade (Zonal, standing in)",
    profile: profile("Ifeoma Chukwu", { phone: "+234 809 555 0177", age: 26, church: "Ogba" }),
    stages: stages("Sister", "ddrllll", {
      0: { detail: "Verified 8 Oct" },
      1: { detail: "Passport verified 9 Oct" },
      2: { status: "Further Information Required", detail: "Zonal Pastor unable to confirm" },
    }),
    panel: {
      kind: "pastor_unconfirmed",
      pastor: "Pastor Michael Ade",
      standingInFor: { name: "Pastor Daniel Oke", reason: "Recently transferred" },
      submitted: "12 Oct, 16:05",
      answers: [
        { q: "Do you know this candidate?", a: "No" },
        { q: "Can you certify that the candidate is a member of this church?", a: "Unable to confirm" },
        { q: "How long have you known the candidate?", a: "Not given" },
      ],
      comments: "I’m standing in as Zonal Pastor. I don’t know Ifeoma personally. Her Pastor, Pastor Daniel Oke, transferred to Abuja in August and would be able to confirm.",
    },
    routing: routing("8 Oct"),
    notes: [],
    messages: [],
    history: [
      { id: "h3", when: "12 Oct, 16:05", actor: "Pastor Michael Ade", actorType: "pastor", action: "Submitted introduction", detail: "Unable to confirm membership." },
      { id: "h2", when: "8 Oct, 12:21", actor: "System", actorType: "system", action: "Sent introduction link to Pastor Michael Ade", detail: "Zonal Pastor standing in for Pastor Daniel Oke. Reason given: recently transferred." },
      { id: "h1", when: "8 Oct, 12:20", actor: "Ifeoma Chukwu", actorType: "candidate", action: "Registered and verified email" },
    ],
  },
  {
    id: "c7",
    name: "Kunle Ajayi",
    firstName: "Kunle",
    journey: "Brother",
    profileRef: "FD-4R7B2Y",
    proposalRef: "APP-26-0350",
    validation: { label: "In Progress", tone: "info" },
    zone: "Ikeja Zone",
    area: "Lagos Area",
    registered: "4 Aug 2026",
    pastor: "Pastor Samuel Adeyemi",
    profile: profile("Kunle Ajayi", { phone: "+234 805 555 0124", age: 33, church: "Ikeja Central" }),
    stages: stages("Brother", "dddddddw", {
      5: { detail: "Confirmed 30 Aug" },
      6: { detail: "Bisi accepted 19 Sep" },
      7: { status: "In Progress", detail: "Session 2 of 5 tomorrow" },
    }),
    panel: {
      kind: "counselling",
      partner: "Bisi Martins",
      caseRef: "PC-26-0102",
      sessions: [
        { id: "s1", title: "Foundations of a Christian marriage", status: "completed", when: "Thu 2 Oct, 11:00", attendance: "Both attended, signed off" },
        { id: "s2", title: "Communication and conflict", status: "scheduled", when: "Thu 16 Oct, 11:00", upcoming: true },
        { id: "s3", title: "Finances and stewardship", status: "not_scheduled" },
        { id: "s4", title: "Family, in-laws and expectations", status: "not_scheduled" },
        { id: "s5", title: "Final review and sign-off", status: "not_scheduled" },
      ],
    },
    pastorIntro: confirmedIntro("Pastor Samuel Adeyemi", "Ikeja Central", "8 Aug, 10:00", "Choir director.", "More than 5 years", "Kunle has been a steady leader in the choir."),
    proposalCase: { ref: "PC-26-0102", label: "With Bisi Martins, in counselling", href: "/staff/cases/pc-0102" },
    routing: routing("4 Aug"),
    notes: [{ id: "n1", author: ngozi, when: "2 Oct", body: "Session 1 went well. Both engaged and open." }],
    messages: [],
    history: [
      { id: "h3", when: "2 Oct, 13:10", actor: ngozi, actorType: "staff", action: "Signed off session 1", detail: "Both attended." },
      { id: "h2", when: "19 Sep, 18:45", actor: "Bisi Martins", actorType: "candidate", action: "Accepted the proposal" },
      { id: "h1", when: "30 Aug, 20:00", actor: "Kunle Ajayi", actorType: "candidate", action: "Confirmed he shared his intention" },
    ],
  },
  {
    id: "c9",
    name: "Segun Afolabi",
    firstName: "Segun",
    journey: "Brother",
    profileRef: "FD-1L5F8Z",
    proposalRef: "APP-26-0412",
    validation: { label: "OTP Pending", tone: "wait" },
    zone: "Ikeja Zone",
    area: "Lagos Area",
    registered: "9 Oct 2026",
    pastor: "Pastor John Ojo",
    profile: profile("Segun Afolabi", { phone: "+234 810 555 0109", age: 30, church: "Maryland" }),
    stages: stages("Brother", "alllllll", { 0: { status: "OTP Pending", detail: "Email not verified for 6 days" } }),
    panel: { kind: "otp_pending", email: "segun.afolabi@exmaple.com", registered: "9 Oct", codesSent: 3 },
    routing: routing("9 Oct"),
    notes: [],
    messages: [],
    history: [
      { id: "h2", when: "11 Oct, 08:00", actor: "System", actorType: "system", action: "Resent verification code", detail: "3 codes sent in total." },
      { id: "h1", when: "9 Oct, 22:47", actor: "Segun Afolabi", actorType: "candidate", action: "Started registration" },
    ],
  },
  {
    id: "c10",
    name: "Zainab Yusuf",
    firstName: "Zainab",
    journey: "Sister",
    profileRef: "FD-3H2G6S",
    proposalRef: "APP-26-0397",
    validation: { label: "Validated", tone: "ok" },
    zone: "Ikeja Zone",
    area: "Lagos Area",
    registered: "14 Mar 2025",
    pastor: "Pastor Michael Ade",
    profile: profile("Zainab Yusuf", { phone: "+234 809 555 0116", age: 29, church: "Ikeja Central" }),
    stages: stages("Sister", "dddddwl", { 5: { status: "Awaiting Candidate", detail: "Proposal from Ibrahim since 12 Oct" } }),
    panel: {
      kind: "waiting",
      waitingOn: "Candidate",
      title: "Waiting for Zainab’s response",
      body: "Ibrahim shared his intention on 12 Oct and linked his proposal (PC-26-0118). Zainab’s checks are complete. There’s no deadline; she may take time to pray it through.",
      since: "12 Oct",
      reminderTask: "Respond to the proposal",
      reminderNote: "Gentle reminders only. None sent yet.",
    },
    pastorIntro: confirmedIntro("Pastor Michael Ade", "Ikeja Central", "26 Sep, 09:30", "Leads the prayer unit.", "More than 5 years", ""),
    appointment: { status: "Completed", tone: "ok", when: "Tue 7 Oct, 14:00", where: "Video call" },
    proposalCase: { ref: "PC-26-0118", label: "With Ibrahim (Garki Zone), awaiting her response", href: "/staff/cases/pc-0118" },
    routing: routing("22 Sep"),
    notes: [{ id: "n1", author: ngozi, when: "22 Sep", body: "Returning candidate. Earlier proposal PC-25-0044 closed in May 2025 (declined by sister). New case is independent." }],
    messages: [{ id: "m1", from: "staff", author: ngozi, when: "12 Oct, 17:30", body: "Ibrahim has linked his proposal to yours. There’s no rush to respond. If you’d like to talk anything through first, I’m here." }],
    history: [
      { id: "h3", when: "12 Oct, 17:02", actor: "System", actorType: "system", action: "Linked to proposal case PC-26-0118", detail: "By proposal code K7Q-4MZ." },
      { id: "h2", when: "11 Oct, 10:14", actor: ngozi, actorType: "staff", action: "Accepted consent letter" },
      { id: "h1", when: "22 Sep, 11:58", actor: "Zainab Yusuf", actorType: "candidate", action: "Started a new proposal", detail: "Signed in to her existing profile and reviewed it." },
    ],
  },
  {
    id: "c11",
    name: "Olumide Bankole",
    firstName: "Olumide",
    journey: "Brother",
    profileRef: "FD-7P8M1N",
    proposalRef: "APP-26-0389",
    validation: { label: "Pastor Assessment Pending", tone: "wait" },
    zone: "Ikeja Zone",
    area: "Lagos Area",
    registered: "7 Oct 2026",
    pastor: "Pastor Grace Bello",
    profile: profile("Olumide Bankole", { phone: "+234 811 555 0187", age: 28, church: "Ogba" }),
    stages: stages("Brother", "ddwlllll", { 2: { status: "Pending Pastor", detail: "Opened 8 Oct, not submitted" } }),
    panel: { kind: "pastor_pending", pastor: "Pastor Grace Bello", pastorEmail: "g.bello@example.org", sent: "7 Oct", expires: "21 Oct", opened: "8 Oct, 07:12", reminders: 1, reminderDates: ["11 Oct"], overdueDays: 8 },
    routing: routing("7 Oct"),
    notes: [],
    messages: [],
    history: [
      { id: "h3", when: "11 Oct, 09:00", actor: "System", actorType: "system", action: "Sent automatic reminder to Pastor Grace Bello", detail: "Reminder 1 of 3." },
      { id: "h2", when: "8 Oct, 07:12", actor: "Pastor Grace Bello", actorType: "pastor", action: "Opened the introduction link", detail: "Verified her email. Not yet submitted." },
      { id: "h1", when: "7 Oct, 19:05", actor: "Olumide Bankole", actorType: "candidate", action: "Registered and verified email" },
    ],
  },
  {
    id: "c12",
    name: "Femi Adeola",
    firstName: "Femi",
    journey: "Brother",
    profileRef: "FD-8N2K4R",
    proposalRef: "APP-26-0431",
    validation: { label: "Identity Verification Pending", tone: "wait" },
    zone: "Ikeja Zone",
    area: "Lagos Area",
    registered: "15 Oct 2026",
    pastor: "Pastor Grace Bello",
    profile: profile("Femi Adeola", { phone: "+234 803 555 0178", age: 29, church: "Ogba" }),
    stages: stages("Brother", "dwwlllll", {
      0: { detail: "Verified today" },
      1: { status: "Awaiting Candidate", detail: "No ID uploaded yet" },
      2: { status: "Pending Pastor", detail: "Link sent today" },
    }),
    panel: {
      kind: "waiting",
      waitingOn: "Candidate",
      title: "New registration",
      body: "Femi registered today. He needs to upload a photo ID, and Pastor Grace Bello has his introduction link.",
      since: "Today",
      reminderTask: "Upload a photo ID",
      reminderNote: "Automatic reminders start 3 days after registration.",
    },
    routing: routing("Today"),
    notes: [],
    messages: [{ id: "m1", from: "staff", author: ngozi, when: "Today, 10:20", body: "Welcome, Femi. Start by verifying your identity, and write to me here if anything is unclear." }],
    history: [
      { id: "h2", when: "Today, 10:16", actor: "System", actorType: "system", action: "Sent introduction link to Pastor Grace Bello" },
      { id: "h1", when: "Today, 10:15", actor: "Femi Adeola", actorType: "candidate", action: "Registered and verified email" },
    ],
  },
];

// Bisi shares Kunle's counselling case.
const kunle = records.find((r) => r.id === "c7")!;
records.push({
  ...kunle,
  id: "c8",
  name: "Bisi Martins",
  firstName: "Bisi",
  journey: "Sister",
  profileRef: "FD-6J9C4V",
  proposalRef: "APP-26-0366",
  pastor: "Pastor Grace Bello",
  profile: profile("Bisi Martins", { phone: "+234 806 555 0144", age: 30, church: "Ogba" }),
  stages: stages("Sister", "ddddddw", { 5: { detail: "Accepted 19 Sep" }, 6: { status: "In Progress", detail: "Session 2 of 5 tomorrow" } }),
  panel: { ...(kunle.panel as Extract<Panel, { kind: "counselling" }>), partner: "Kunle Ajayi" },
  pastorIntro: confirmedIntro("Pastor Grace Bello", "Ogba", "10 Sep, 08:00", "Usher and youth leader.", "3 to 5 years", ""),
  proposalCase: { ref: "PC-26-0102", label: "With Kunle Ajayi, in counselling", href: "/staff/cases/pc-0102" },
});

export function findCase(id: string) {
  return records.find((r) => r.id === id);
}
