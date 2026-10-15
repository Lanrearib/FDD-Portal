/*
  Pastor assessment links (PRD §7). Each link carries an unpredictable token tied to
  exactly one candidate and one assessment. The prototype uses readable demo tokens.
*/

export type LinkState = "open" | "submitted" | "expired" | "replaced";

export interface AssessmentLink {
  token: string;
  state: LinkState;
  candidate: { name: string; firstName: string; ref: string; gender: "brother" | "sister"; church: string };
  pastor: { name: string; email: string; church: string };
  counsellor: string;
  sentOn: string;
  expiresOn: string;
  submitted?: {
    on: string;
    answers: { q: string; a: string }[];
  };
}

const links: AssessmentLink[] = [
  {
    token: "demo",
    state: "open",
    candidate: { name: "Femi Adeola", firstName: "Femi", ref: "FD-8N2K4R", gender: "brother", church: "Ogba" },
    pastor: { name: "Pastor Grace Bello", email: "g.bello@example.org", church: "Ogba" },
    counsellor: "Sis. Ngozi Okafor",
    sentOn: "15 October 2026",
    expiresOn: "29 October 2026",
  },
  {
    token: "submitted",
    state: "submitted",
    candidate: { name: "Daniel Okoro", firstName: "Daniel", ref: "FD-9Q4H7L", gender: "brother", church: "Ikeja Central" },
    pastor: { name: "Pastor Samuel Adeyemi", email: "s.adeyemi@example.org", church: "Ikeja Central" },
    counsellor: "Sis. Ngozi Okafor",
    sentOn: "22 September 2026",
    expiresOn: "6 October 2026",
    submitted: {
      on: "25 September 2026 at 09:12",
      answers: [
        { q: "Do you know this candidate?", a: "Yes" },
        { q: "What does the candidate do in the church?", a: "Leads the ushering unit and sings in the choir." },
        { q: "Can you certify that the candidate is a member of this church?", a: "Yes" },
        { q: "How long have you known the candidate?", a: "More than 5 years" },
        { q: "Comments for the counsellor", a: "Daniel is faithful and dependable. He has served in the ushering unit since 2021." },
      ],
    },
  },
  {
    token: "expired",
    state: "expired",
    candidate: { name: "Emeka Nwosu", firstName: "Emeka", ref: "FD-5T1K9P", gender: "brother", church: "Maryland" },
    pastor: { name: "Pastor John Ojo", email: "j.ojo@example.org", church: "Maryland" },
    counsellor: "Sis. Ngozi Okafor",
    sentOn: "22 September 2026",
    expiresOn: "6 October 2026",
  },
  {
    token: "replaced",
    state: "replaced",
    candidate: { name: "Olumide Bankole", firstName: "Olumide", ref: "FD-7P8M1N", gender: "brother", church: "Ogba" },
    pastor: { name: "Pastor Grace Bello", email: "g.bello@example.org", church: "Ogba" },
    counsellor: "Sis. Ngozi Okafor",
    sentOn: "1 October 2026",
    expiresOn: "15 October 2026",
  },
];

export function findAssessment(token: string) {
  return links.find((l) => l.token === token);
}
