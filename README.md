# Family Development Department Portal

A front-end prototype of the church’s Family Development portal, built from the PRD (v1.1): the
marriage process for brothers and sisters, the Pastor’s introduction link, the counsellor workspace,
central administration, and counselling and bereavement requests.

**This is front end only.** There is no server, database or real authentication. Screens run on
typed mock data shaped like the PRD’s data entities (`src/lib/types.ts`), so a backend can replace it.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Use the **compass button** (bottom corner) to jump to any screen or role.

| What | How |
|---|---|
| Any verification code | `246810` |
| Sign in | Any email and password |
| Switch candidate | `/portal/as/new`, `tunde`, `daniel`, `zainab` or `kunle` |
| Pastor link | `/assess/demo`, plus `submitted`, `expired` and `replaced` |

## Roles and where to find them

| Role | Start at | Highlights |
|---|---|---|
| Candidate | `/portal` | Journey tracker, ID and consent uploads, booking, sharing intention, responding, new proposals |
| Pastor | `/assess/demo` | Email code, questionnaire, declaration; no account needed |
| Zonal counsellor | `/staff` | Case view for every stage, reminders, holds, escalation, proposal cases, appointments, messages |
| Central counsellor | `/central` | Unassigned cases, escalations, Zone coverage, bulk upload, Pastor directory, settings, audit log |
| Church leadership | `/leadership` | Totals only, no names |

## Checks

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint
npm test            # Playwright: 54 end-to-end tests against a production build on port 3100
```

The first `npm test` needs a browser: `npx playwright install chromium`.

## Project layout

```
src/app/            Routes: public site, /portal, /assess, /staff, /central, /leadership
src/components/     Shared UI: shells, form kit, journey path, charts, modal, toast
src/lib/            Mock data, reference data (Areas, Zones, Pastors), domain types
e2e/                Playwright tests
```

## What the backend needs to provide

- Sessions and roles (candidate, Pastor link, counsellor, central counsellor, administrator, leadership)
  with Area/Zone scoping enforced on the server, not just in the interface.
- Workflow events from which journey stages are derived (PRD §6.4). The prototype’s actions only
  update the page you are on.
- Email, and optionally SMS, delivery for codes, links, reminders and templates; document storage; the audit log.

## Decisions still open (PRD §17)

These are shown with sensible defaults and should be confirmed by the church: the identity-check method,
whether Pastors must enter an email code, what happens on “Unable to confirm”, how candidates are linked
(the prototype uses a proposal code), what carries into a new proposal, retention periods and the
privacy notice wording.
