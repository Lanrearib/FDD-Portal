/*
  Reference data for the prototype: the Area/Zone hierarchy, church branches and
  the approved Pastor directory (PRD §6.3, §11.4). A backend would serve these;
  the shapes match src/lib/types.ts.
*/

import type { Area, Branch, Pastor, Zone } from "./types";

export const areas: Area[] = [
  { id: "lagos", name: "Lagos Area", region: "West Africa" },
  { id: "abuja", name: "Abuja Area", region: "West Africa" },
  { id: "accra", name: "Accra Area", region: "West Africa" },
  { id: "douala", name: "Douala Area", region: "Central Africa" },
];

export const zones: Zone[] = [
  { id: "ikeja", areaId: "lagos", name: "Ikeja Zone" },
  { id: "lekki", areaId: "lagos", name: "Lekki Zone" },
  { id: "surulere", areaId: "lagos", name: "Surulere Zone" },
  { id: "garki", areaId: "abuja", name: "Garki Zone" },
  { id: "wuse", areaId: "abuja", name: "Wuse Zone" },
  { id: "osu", areaId: "accra", name: "Osu Zone" },
  { id: "tema", areaId: "accra", name: "Tema Zone" },
  { id: "bonanjo", areaId: "douala", name: "Bonanjo Zone" },
  { id: "akwa", areaId: "douala", name: "Akwa Zone" },
];

export const branches: Branch[] = [
  { id: "ikeja-central", zoneId: "ikeja", name: "Ikeja Central" },
  { id: "ogba", zoneId: "ikeja", name: "Ogba" },
  { id: "maryland", zoneId: "ikeja", name: "Maryland" },
  { id: "lekki-phase-1", zoneId: "lekki", name: "Lekki Phase 1" },
  { id: "ajah", zoneId: "lekki", name: "Ajah" },
  { id: "surulere-main", zoneId: "surulere", name: "Surulere" },
  { id: "yaba", zoneId: "surulere", name: "Yaba" },
  { id: "garki-2", zoneId: "garki", name: "Garki II" },
  { id: "area-11", zoneId: "garki", name: "Area 11" },
  { id: "wuse-2", zoneId: "wuse", name: "Wuse II" },
  { id: "osu-oxford", zoneId: "osu", name: "Osu" },
  { id: "labone", zoneId: "osu", name: "Labone" },
  { id: "tema-comm-1", zoneId: "tema", name: "Tema Community 1" },
  { id: "bonanjo-main", zoneId: "bonanjo", name: "Bonanjo" },
  { id: "akwa-main", zoneId: "akwa", name: "Akwa" },
];

export const pastors: Pastor[] = [
  // Ikeja Zone
  { id: "p-adeyemi", name: "Pastor Samuel Adeyemi", email: "s.adeyemi@example.org", phone: "+234 802 000 1101", branchId: "ikeja-central", zoneId: "ikeja", isZonalPastor: false, active: true },
  { id: "p-bello", name: "Pastor Grace Bello", email: "g.bello@example.org", phone: "+234 802 000 1102", branchId: "ogba", zoneId: "ikeja", isZonalPastor: false, active: true },
  { id: "p-ojo", name: "Pastor John Ojo", email: "j.ojo@example.org", phone: "+234 802 000 1103", branchId: "maryland", zoneId: "ikeja", isZonalPastor: false, active: true },
  { id: "p-ade", name: "Pastor Michael Ade", email: "m.ade@example.org", phone: "+234 802 000 1100", branchId: "ikeja-central", zoneId: "ikeja", isZonalPastor: true, active: true },
  { id: "p-oke", name: "Pastor Daniel Oke", email: "d.oke@example.org", phone: "+234 802 000 1104", branchId: "ogba", zoneId: "ikeja", isZonalPastor: false, active: false },
  // Lekki Zone
  { id: "p-coker", name: "Pastor Tolu Coker", email: "t.coker@example.org", phone: "+234 803 000 2201", branchId: "lekki-phase-1", zoneId: "lekki", isZonalPastor: true, active: true },
  { id: "p-eze", name: "Pastor Chidi Eze", email: "c.eze@example.org", phone: "+234 803 000 2202", branchId: "ajah", zoneId: "lekki", isZonalPastor: false, active: true },
  // Surulere Zone
  { id: "p-lawal", name: "Pastor Kemi Lawal", email: "k.lawal@example.org", phone: "+234 804 000 3301", branchId: "surulere-main", zoneId: "surulere", isZonalPastor: true, active: true },
  { id: "p-oni", name: "Pastor Femi Oni", email: "f.oni@example.org", phone: "+234 804 000 3302", branchId: "yaba", zoneId: "surulere", isZonalPastor: false, active: true },
  // Abuja
  { id: "p-musa", name: "Pastor Ibrahim Musa", email: "i.musa@example.org", phone: "+234 805 000 4401", branchId: "garki-2", zoneId: "garki", isZonalPastor: true, active: true },
  { id: "p-okafor", name: "Pastor Joy Okafor", email: "j.okafor@example.org", phone: "+234 805 000 4402", branchId: "area-11", zoneId: "garki", isZonalPastor: false, active: true },
  { id: "p-danjuma", name: "Pastor Paul Danjuma", email: "p.danjuma@example.org", phone: "+234 805 000 4501", branchId: "wuse-2", zoneId: "wuse", isZonalPastor: true, active: true },
  // Accra
  { id: "p-mensah", name: "Pastor Kwame Mensah", email: "k.mensah@example.org", phone: "+233 24 000 5501", branchId: "osu-oxford", zoneId: "osu", isZonalPastor: true, active: true },
  { id: "p-owusu", name: "Pastor Abena Owusu", email: "a.owusu@example.org", phone: "+233 24 000 5502", branchId: "labone", zoneId: "osu", isZonalPastor: false, active: true },
  { id: "p-asante", name: "Pastor Kofi Asante", email: "k.asante@example.org", phone: "+233 24 000 5601", branchId: "tema-comm-1", zoneId: "tema", isZonalPastor: true, active: true },
  // Douala
  { id: "p-ndongo", name: "Pastor Jean Ndongo", email: "j.ndongo@example.org", phone: "+237 6 70 00 6601", branchId: "bonanjo-main", zoneId: "bonanjo", isZonalPastor: true, active: true },
  { id: "p-ekane", name: "Pastor Marie Ekane", email: "m.ekane@example.org", phone: "+237 6 70 00 6701", branchId: "akwa-main", zoneId: "akwa", isZonalPastor: true, active: true },
];

export const zonesIn = (areaId: string) => zones.filter((z) => z.areaId === areaId);
export const branchesIn = (zoneId: string) => branches.filter((b) => b.zoneId === zoneId);
export const areaById = (id: string) => areas.find((a) => a.id === id);
export const zoneById = (id: string) => zones.find((z) => z.id === id);
export const branchById = (id: string) => branches.find((b) => b.id === id);
export const pastorById = (id: string) => pastors.find((p) => p.id === id);
/** Only active Pastors may be selected (FR-13). */
export const activePastors = () => pastors.filter((p) => p.active);
export const zonalPastorFor = (zoneId: string) =>
  pastors.find((p) => p.zoneId === zoneId && p.isZonalPastor && p.active);

export function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  return `${user.slice(0, 1)}${"•".repeat(Math.max(2, user.length - 2))}${user.slice(-1)}@${domain}`;
}
