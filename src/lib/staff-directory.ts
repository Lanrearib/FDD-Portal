/* Counsellors and their Area/Zone scope (PRD §11.4). */

export interface Counsellor {
  id: string;
  name: string;
  role: "Central Marriage Counsellor" | "Area Marriage Counsellor" | "Zonal Marriage Counsellor";
  scope: string;
  email: string;
  active: boolean;
  caseload: number;
}

export const counsellors: Counsellor[] = [
  { id: "s-adeyemi", name: "Pastor Mrs. Funmi Adeyemi", role: "Central Marriage Counsellor", scope: "West and Central Africa", email: "f.adeyemi@example.org", active: true, caseload: 6 },
  { id: "s-okafor", name: "Sis. Ngozi Okafor", role: "Zonal Marriage Counsellor", scope: "Ikeja Zone, Lagos Area", email: "n.okafor@example.org", active: true, caseload: 24 },
  { id: "s-ogun", name: "Bro. Femi Ogun", role: "Zonal Marriage Counsellor", scope: "Lekki Zone, Lagos Area", email: "f.ogun@example.org", active: true, caseload: 17 },
  { id: "s-nnaji", name: "Sis. Ada Nnaji", role: "Zonal Marriage Counsellor", scope: "Surulere Zone, Lagos Area", email: "a.nnaji@example.org", active: true, caseload: 12 },
  { id: "s-ibrahim", name: "Bro. Sani Ibrahim", role: "Area Marriage Counsellor", scope: "Abuja Area", email: "s.ibrahim@example.org", active: true, caseload: 21 },
  { id: "s-boateng", name: "Sis. Akosua Boateng", role: "Zonal Marriage Counsellor", scope: "Osu Zone, Accra Area", email: "a.boateng@example.org", active: true, caseload: 9 },
  { id: "s-mbarga", name: "Bro. Paul Mbarga", role: "Area Marriage Counsellor", scope: "Douala Area", email: "p.mbarga@example.org", active: true, caseload: 7 },
];

export const currentStaff = { name: "Sis. Ngozi Okafor", subtitle: "Counsellor, Ikeja Zone" };

export const centralStaff = { name: "Pastor Mrs. Funmi Adeyemi", subtitle: "Central Marriage Counsellor" };
export const leadershipUser = { name: "Pastor Gbenga Oyelaran", subtitle: "Church leadership" };
