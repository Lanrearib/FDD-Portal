import type { StageState } from "@/components/journey-path";
import type { Tone } from "@/components/ui";

/* Mock data for design review: Ikeja Zone, seen by its local counsellor. */

export type WaitingOn = "You" | "Candidate" | "Pastor" | "Sister";

export interface CandidateRow {
  id: string;
  name: string;
  ref: string;
  journey: "Brother" | "Sister";
  stages: StageState[];
  stageIndex: number;
  stageName: string;
  status: string;
  statusTone: Tone;
  waitingOn: WaitingOn;
  pastor: string;
  lastActivity: string;
  overdue?: string;
  tags: ("needs_you" | "overdue" | "pastor" | "counselling")[];
}

const B = (s: string): StageState[] =>
  [...s].map((c) => ({ d: "done", a: "action", r: "returned", w: "waiting", l: "locked" })[c] as StageState);

export const candidates: CandidateRow[] = [
  {
    id: "c1",
    name: "Chiamaka Eze",
    ref: "FD-3M8T2W",
    journey: "Sister",
    stages: B("dawllll"),
    stageIndex: 1,
    stageName: "Verify identity",
    status: "Pending Counsellor Review",
    statusTone: "action",
    waitingOn: "You",
    pastor: "Pastor Grace Bello",
    lastActivity: "2 hours ago",
    tags: ["needs_you"],
  },
  {
    id: "c2",
    name: "Daniel Okoro",
    ref: "FD-9Q4H7L",
    journey: "Brother",
    stages: B("ddddalll"),
    stageIndex: 4,
    stageName: "Parental consent letter",
    status: "Pending Counsellor Review",
    statusTone: "action",
    waitingOn: "You",
    pastor: "Pastor Samuel Adeyemi",
    lastActivity: "5 hours ago",
    tags: ["needs_you"],
  },
  {
    id: "c3",
    name: "Funke Adebayo",
    ref: "FD-2X6N8R",
    journey: "Sister",
    stages: B("dddalll"),
    stageIndex: 3,
    stageName: "Meet your counsellor",
    status: "Appointment Requested",
    statusTone: "action",
    waitingOn: "You",
    pastor: "Pastor Grace Bello",
    lastActivity: "Yesterday",
    tags: ["needs_you"],
  },
  {
    id: "c4",
    name: "Emeka Nwosu",
    ref: "FD-5T1K9P",
    journey: "Brother",
    stages: B("ddwlllll"),
    stageIndex: 2,
    stageName: "Pastor's introduction",
    status: "Pending Pastor",
    statusTone: "wait",
    waitingOn: "Pastor",
    pastor: "Pastor John Ojo",
    lastActivity: "9 days ago",
    overdue: "9 days",
    tags: ["overdue", "pastor"],
  },
  {
    id: "c5",
    name: "Tunde Bakare",
    ref: "FD-7K3P9Q",
    journey: "Brother",
    stages: B("dddwrlll"),
    stageIndex: 4,
    stageName: "Parental consent letter",
    status: "Returned for Correction",
    statusTone: "bad",
    waitingOn: "Candidate",
    pastor: "Pastor Samuel Adeyemi",
    lastActivity: "Yesterday",
    tags: [],
  },
  {
    id: "c6",
    name: "Ifeoma Chukwu",
    ref: "FD-8W3D5M",
    journey: "Sister",
    stages: B("ddrllll"),
    stageIndex: 2,
    stageName: "Pastor's introduction",
    status: "Further Information Required",
    statusTone: "bad",
    waitingOn: "You",
    pastor: "Pastor Michael Ade (Zonal)",
    lastActivity: "3 days ago",
    tags: ["needs_you", "pastor"],
  },
  {
    id: "c7",
    name: "Kunle Ajayi",
    ref: "FD-4R7B2Y",
    journey: "Brother",
    stages: B("dddddddw"),
    stageIndex: 7,
    stageName: "Counselling, session 2 of 5",
    status: "In Progress",
    statusTone: "info",
    waitingOn: "You",
    pastor: "Pastor Samuel Adeyemi",
    lastActivity: "4 days ago",
    tags: ["counselling"],
  },
  {
    id: "c8",
    name: "Bisi Martins",
    ref: "FD-6J9C4V",
    journey: "Sister",
    stages: B("ddddddw"),
    stageIndex: 6,
    stageName: "Counselling, session 2 of 5",
    status: "In Progress",
    statusTone: "info",
    waitingOn: "You",
    pastor: "Pastor Grace Bello",
    lastActivity: "4 days ago",
    tags: ["counselling"],
  },
  {
    id: "c9",
    name: "Segun Afolabi",
    ref: "FD-1L5F8Z",
    journey: "Brother",
    stages: B("alllllll"),
    stageIndex: 0,
    stageName: "Create account",
    status: "OTP Pending",
    statusTone: "wait",
    waitingOn: "Candidate",
    pastor: "Pastor John Ojo",
    lastActivity: "6 days ago",
    overdue: "6 days",
    tags: ["overdue"],
  },
  {
    id: "c10",
    name: "Zainab Yusuf",
    ref: "FD-3H2G6S",
    journey: "Sister",
    stages: B("dddddal"),
    stageIndex: 5,
    stageName: "Respond to the proposal",
    status: "Awaiting Candidate",
    statusTone: "wait",
    waitingOn: "Candidate",
    pastor: "Pastor Michael Ade",
    lastActivity: "2 days ago",
    tags: [],
  },
  {
    id: "c11",
    name: "Olumide Bankole",
    ref: "FD-7P8M1N",
    journey: "Brother",
    stages: B("ddwlllll"),
    stageIndex: 2,
    stageName: "Pastor's introduction",
    status: "Pending Pastor",
    statusTone: "wait",
    waitingOn: "Pastor",
    pastor: "Pastor Grace Bello",
    lastActivity: "8 days ago",
    overdue: "8 days",
    tags: ["overdue", "pastor"],
  },
  {
    id: "c12",
    name: "Femi Adeola",
    ref: "FD-8N2K4R",
    journey: "Brother",
    stages: B("dwwlllll"),
    stageIndex: 1,
    stageName: "Verify identity",
    status: "Awaiting Candidate",
    statusTone: "wait",
    waitingOn: "Candidate",
    pastor: "Pastor Grace Bello",
    lastActivity: "Today",
    tags: [],
  },
];

export const metrics: {
  label: string;
  value: number;
  note?: string;
  tone?: Tone;
  href: string;
}[] = [
  { label: "New registrations", value: 4, note: "This week", href: "/staff/candidates?status=registered" },
  { label: "Pending email or ID checks", value: 3, href: "/staff/candidates?stage=verification" },
  { label: "Pending Pastor assessments", value: 5, note: "2 overdue", tone: "bad", href: "/staff/candidates?stage=pastor" },
  { label: "Missing consent letters", value: 4, href: "/staff/candidates?stage=consent" },
  { label: "Awaiting your review", value: 4, note: "Oldest 1 day", href: "/staff/candidates?filter=needs_you" },
  { label: "Overdue actions", value: 3, note: "Oldest 9 days", tone: "bad", href: "/staff/candidates?filter=overdue" },
  { label: "Active counselling", value: 7, note: "3 couples", href: "/staff/cases?status=active" },
  { label: "Completed", value: 12, note: "This year", href: "/staff/cases?status=completed" },
];
