/* Mock data for the Central Marriage Counsellor’s oversight views (PRD §11.4). */

export interface AreaSummary {
  area: string;
  region: string;
  active: number;
  pendingPastor: number;
  overdue: number;
  unassigned: number;
  counsellors: number;
}

export const areaSummaries: AreaSummary[] = [
  { area: "Lagos Area", region: "West Africa", active: 53, pendingPastor: 11, overdue: 3, unassigned: 0, counsellors: 3 },
  { area: "Abuja Area", region: "West Africa", active: 21, pendingPastor: 4, overdue: 1, unassigned: 0, counsellors: 1 },
  { area: "Accra Area", region: "West Africa", active: 11, pendingPastor: 3, overdue: 1, unassigned: 2, counsellors: 1 },
  { area: "Douala Area", region: "Central Africa", active: 7, pendingPastor: 2, overdue: 0, unassigned: 0, counsellors: 1 },
];

export interface ZoneCoverage {
  zone: string;
  area: string;
  counsellor: string | null;
  level: "Zonal" | "Area" | null;
  zonalPastor: string | null;
  active: number;
}

export const coverage: ZoneCoverage[] = [
  { zone: "Ikeja Zone", area: "Lagos Area", counsellor: "Sis. Ngozi Okafor", level: "Zonal", zonalPastor: "Pastor Michael Ade", active: 24 },
  { zone: "Lekki Zone", area: "Lagos Area", counsellor: "Bro. Femi Ogun", level: "Zonal", zonalPastor: "Pastor Tolu Coker", active: 17 },
  { zone: "Surulere Zone", area: "Lagos Area", counsellor: "Sis. Ada Nnaji", level: "Zonal", zonalPastor: "Pastor Kemi Lawal", active: 12 },
  { zone: "Garki Zone", area: "Abuja Area", counsellor: "Bro. Sani Ibrahim", level: "Area", zonalPastor: "Pastor Ibrahim Musa", active: 13 },
  { zone: "Wuse Zone", area: "Abuja Area", counsellor: "Bro. Sani Ibrahim", level: "Area", zonalPastor: "Pastor Paul Danjuma", active: 8 },
  { zone: "Osu Zone", area: "Accra Area", counsellor: "Sis. Akosua Boateng", level: "Zonal", zonalPastor: "Pastor Kwame Mensah", active: 9 },
  { zone: "Tema Zone", area: "Accra Area", counsellor: null, level: null, zonalPastor: "Pastor Kofi Asante", active: 2 },
  { zone: "Bonanjo Zone", area: "Douala Area", counsellor: "Bro. Paul Mbarga", level: "Area", zonalPastor: "Pastor Jean Ndongo", active: 4 },
  { zone: "Akwa Zone", area: "Douala Area", counsellor: "Bro. Paul Mbarga", level: "Area", zonalPastor: "Pastor Marie Ekane", active: 3 },
];

export interface UnassignedCase {
  id: string;
  name: string;
  journey: "Brother" | "Sister";
  zone: string;
  registered: string;
  waiting: string;
}

export const unassigned: UnassignedCase[] = [
  { id: "u1", name: "Esi Mensah", journey: "Sister", zone: "Tema Zone, Accra Area", registered: "13 Oct", waiting: "2 days" },
  { id: "u2", name: "Yaw Owusu", journey: "Brother", zone: "Tema Zone, Accra Area", registered: "14 Oct", waiting: "1 day" },
];

export interface Escalation {
  id: string;
  name: string;
  from: string;
  zone: string;
  when: string;
  reason: string;
}

export const escalations: Escalation[] = [
  {
    id: "e1",
    name: "Fola Bello",
    from: "Sis. Ada Nnaji",
    zone: "Surulere Zone",
    when: "Yesterday",
    reason: "The brother lives in Surulere but worships in Garki, Abuja. A central decision is needed on which counsellor leads.",
  },
  {
    id: "e2",
    name: "Chinonso Eze",
    from: "Bro. Femi Ogun",
    zone: "Lekki Zone",
    when: "13 Oct",
    reason: "The candidate has asked for a counsellor outside her Zone because of a family connection to the local counsellor.",
  },
];
