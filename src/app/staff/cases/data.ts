import type { StageState } from "@/components/journey-path";
import type { Tone } from "@/components/ui";

export interface Party {
  name: string;
  journey: "Brother" | "Sister";
  zone: string;
  /** Candidate page id when the person is in the counsellor’s scope. */
  candidateId?: string;
  managedBy?: string;
  validation: { label: string; tone: Tone };
  stages?: StageState[];
}

export interface Milestone {
  label: string;
  when?: string;
  state: "done" | "current" | "upcoming" | "stopped";
}

export interface ProposalCase {
  id: string;
  ref: string;
  status: { label: string; tone: Tone };
  stage: string;
  owner: string;
  created: string;
  lastActivity: string;
  code: string;
  brother: Party;
  sister: Party | null;
  linkedBy?: string;
  milestones: Milestone[];
  closure?: { on: string; outcome: string; stopped: string[]; restrictedNote: string; laterCase?: { ref: string; href: string } };
}

const B = (s: string): StageState[] => [...s].map((c) => ({ d: "done", a: "action", r: "returned", w: "waiting", l: "locked" })[c] as StageState);

export const cases: ProposalCase[] = [
  {
    id: "pc-0102",
    ref: "PC-26-0102",
    status: { label: "Active", tone: "info" },
    stage: "Counselling, session 2 of 5",
    owner: "Sis. Ngozi Okafor",
    created: "30 Aug 2026",
    lastActivity: "4 days ago",
    code: "M2P-7QA",
    linkedBy: "Proposal code, entered by Bisi on 2 Sep",
    brother: { name: "Kunle Ajayi", journey: "Brother", zone: "Ikeja Zone", candidateId: "c7", validation: { label: "Validated", tone: "ok" }, stages: B("dddddddw") },
    sister: { name: "Bisi Martins", journey: "Sister", zone: "Ikeja Zone", candidateId: "c8", validation: { label: "Validated", tone: "ok" }, stages: B("ddddddw") },
    milestones: [
      { label: "Kunle shared his intention", when: "30 Aug", state: "done" },
      { label: "Bisi linked the proposal", when: "2 Sep", state: "done" },
      { label: "Bisi accepted", when: "19 Sep", state: "done" },
      { label: "Counselling session 1 signed off", when: "2 Oct", state: "done" },
      { label: "Counselling session 2", when: "Thu 16 Oct", state: "current" },
      { label: "Sessions 3 to 5", state: "upcoming" },
      { label: "Final sign-off", state: "upcoming" },
    ],
  },
  {
    id: "pc-0118",
    ref: "PC-26-0118",
    status: { label: "Awaiting Response", tone: "wait" },
    stage: "Sister’s response",
    owner: "Sis. Ngozi Okafor",
    created: "10 Oct 2026",
    lastActivity: "3 days ago",
    code: "K7Q-4MZ",
    linkedBy: "Proposal code, entered by Zainab on 12 Oct",
    brother: { name: "Ibrahim D.", journey: "Brother", zone: "Garki Zone, Abuja Area", managedBy: "Bro. Sani Ibrahim", validation: { label: "Validated", tone: "ok" } },
    sister: { name: "Zainab Yusuf", journey: "Sister", zone: "Ikeja Zone", candidateId: "c10", validation: { label: "Validated", tone: "ok" }, stages: B("dddddwl") },
    milestones: [
      { label: "Ibrahim shared his intention", when: "10 Oct", state: "done" },
      { label: "Zainab linked the proposal", when: "12 Oct", state: "done" },
      { label: "Zainab’s response", state: "current" },
      { label: "Counselling", state: "upcoming" },
    ],
  },
  {
    id: "pc-0121",
    ref: "PC-26-0121",
    status: { label: "Awaiting Sister", tone: "neutral" },
    stage: "Waiting for the sister to link",
    owner: "Sis. Ngozi Okafor",
    created: "Today",
    lastActivity: "Today",
    code: "R4D-9TX",
    brother: { name: "Daniel Okoro", journey: "Brother", zone: "Ikeja Zone", candidateId: "c2", validation: { label: "Validated", tone: "ok" }, stages: B("ddddalll") },
    sister: null,
    milestones: [
      { label: "Daniel’s consent letter accepted", when: "Today", state: "done" },
      { label: "Daniel shares his intention", state: "current" },
      { label: "Sister links the proposal", state: "upcoming" },
      { label: "Sister’s response", state: "upcoming" },
    ],
  },
  {
    id: "pc-0044",
    ref: "PC-25-0044",
    status: { label: "Rejected by Sister", tone: "neutral" },
    stage: "Closed",
    owner: "Sis. Ngozi Okafor",
    created: "2 Apr 2025",
    lastActivity: "18 May 2025",
    code: "H3T-8WN",
    linkedBy: "Proposal code, entered by Zainab on 5 Apr 2025",
    brother: { name: "Chidi O.", journey: "Brother", zone: "Lekki Zone, Lagos Area", managedBy: "Bro. Femi Ogun", validation: { label: "Validated", tone: "ok" } },
    sister: { name: "Zainab Yusuf", journey: "Sister", zone: "Ikeja Zone", candidateId: "c10", validation: { label: "Validated", tone: "ok" } },
    milestones: [
      { label: "Chidi shared his intention", when: "2 Apr 2025", state: "done" },
      { label: "Zainab linked the proposal", when: "5 Apr 2025", state: "done" },
      { label: "Zainab declined", when: "18 May 2025", state: "done" },
      { label: "Counselling", state: "stopped" },
    ],
    closure: {
      on: "18 May 2025",
      outcome: "Rejected by Sister",
      stopped: ["All open tasks for this case were cancelled", "2 scheduled reminders were stopped", "Both candidates were told, using the department’s wording"],
      restrictedNote: "Zainab shared that she did not feel at peace about the proposal after prayer and counsel. No concerns about conduct were raised.",
      laterCase: { ref: "PC-26-0118", href: "/staff/cases/pc-0118" },
    },
  },
  {
    id: "pc-0071",
    ref: "PC-26-0071",
    status: { label: "Completed", tone: "ok" },
    stage: "All sessions signed off",
    owner: "Sis. Ngozi Okafor",
    created: "3 Jun 2026",
    lastActivity: "2 Oct",
    code: "Z8L-2CF",
    linkedBy: "Proposal code, entered by Kemi on 9 Jun",
    brother: { name: "Tobi Alade", journey: "Brother", zone: "Ikeja Zone", validation: { label: "Completed", tone: "ok" }, stages: B("dddddddd") },
    sister: { name: "Kemi Ojo", journey: "Sister", zone: "Ikeja Zone", validation: { label: "Completed", tone: "ok" }, stages: B("ddddddd") },
    milestones: [
      { label: "Tobi shared his intention", when: "3 Jun", state: "done" },
      { label: "Kemi accepted", when: "1 Jul", state: "done" },
      { label: "Five counselling sessions signed off", when: "2 Oct", state: "done" },
      { label: "Final sign-off", when: "2 Oct", state: "done" },
    ],
  },
];

export const findProposalCase = (id: string) => cases.find((c) => c.id === id);
