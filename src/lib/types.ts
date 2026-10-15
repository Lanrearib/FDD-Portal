/*
  Domain types mirroring PRD §15 (Data Entities).
  These are the contract a future backend should satisfy; the prototype
  fills them from mock data held in client state.
*/

export type ID = string;
export type ISODate = string;

export type Gender = "brother" | "sister";

export interface Area {
  id: ID;
  name: string;
  region: "West Africa" | "Central Africa";
}

export interface Zone {
  id: ID;
  areaId: ID;
  name: string;
}

export interface Branch {
  id: ID;
  zoneId: ID;
  name: string;
}

export interface Pastor {
  id: ID;
  name: string;
  email: string;
  phone: string;
  branchId: ID;
  zoneId: ID;
  /** Designated Zonal Pastor — eligible as the fallback for their zone. */
  isZonalPastor: boolean;
  active: boolean;
}

export type StaffRole = "central" | "counsellor" | "admin" | "leadership";

export interface Staff {
  id: ID;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  /** For counsellors: "area" or "zone" level. */
  level?: "area" | "zone";
  active: boolean;
}

export interface CounsellorAssignment {
  id: ID;
  staffId: ID;
  areaId: ID;
  /** Null means the whole area. */
  zoneId: ID | null;
  active: boolean;
  effectiveFrom: ISODate;
}

export type IdentityStatus = "not_started" | "submitted" | "verified" | "rejected";

export interface Candidate {
  id: ID;
  /** Persistent profile reference — never changes across proposals. */
  ref: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: ISODate;
  branchId: ID;
  areaId: ID;
  zoneId: ID;
  emailVerifiedAt: ISODate | null;
  identity: {
    status: IdentityStatus;
    docType?: string;
    fileName?: string;
    submittedAt?: ISODate;
    reviewedAt?: ISODate;
    reviewNote?: string;
  };
  profileConfirmedAt: ISODate;
  profileVersion: number;
  createdAt: ISODate;
}

export type JourneyStatus = "active" | "on_hold" | "closed" | "withdrawn" | "completed";

/** One candidate's run through a single proposal attempt. */
export interface Journey {
  id: ID;
  ref: string;
  candidateId: ID;
  pastorId: ID;
  /** Set when the Zonal Pastor fallback was used. */
  fallback?: { originalPastorId: ID; reason: string };
  status: JourneyStatus;
  holdReason?: string;
  closedOutcome?: string;
  counsellorId: ID | null;
  routedTo: "local" | "central";
  areaId: ID;
  zoneId: ID;
  intentionConfirmedAt?: ISODate;
  createdAt: ISODate;
  lastActivityAt: ISODate;
}

export type YesNo = "yes" | "no";
export type Certify = "yes" | "no" | "unable";
export type AssessmentStatus = "sent" | "opened" | "submitted" | "expired" | "revoked";
export type AssessmentOutcome = "confirmed" | "declined" | "needs_info";

export interface PastorAssessment {
  id: ID;
  journeyId: ID;
  pastorId: ID;
  token: string;
  status: AssessmentStatus;
  sentAt: ISODate;
  expiresAt: ISODate;
  openedAt?: ISODate;
  remindersSent: number;
  lastReminderAt?: ISODate;
  response?: {
    knowsCandidate: YesNo;
    churchRole: string;
    certifiesMember: Certify;
    knownDuration: string;
    comments: string;
    submittedAt: ISODate;
  };
  outcome?: AssessmentOutcome;
}

export type ConsentStatus = "submitted" | "under_review" | "accepted" | "reupload_required";

export interface ConsentDocument {
  id: ID;
  journeyId: ID;
  fileName: string;
  fileSize: number;
  version: number;
  status: ConsentStatus;
  uploadedAt: ISODate;
  reviewedAt?: ISODate;
  reviewerId?: ID;
  reviewNote?: string;
}

export type AppointmentStatus =
  | "requested"
  | "scheduled"
  | "rescheduled"
  | "completed"
  | "cancelled"
  | "no_show";

export type AppointmentMode = "in_person" | "phone" | "video";

export interface Appointment {
  id: ID;
  journeyId: ID;
  counsellorId: ID | null;
  status: AppointmentStatus;
  preferredSlots: ISODate[];
  preferredMode: AppointmentMode;
  candidateNote?: string;
  scheduledAt?: ISODate;
  mode?: AppointmentMode;
  location?: string;
  helpRequested?: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface AvailabilitySlot {
  id: ID;
  counsellorId: ID;
  startsAt: ISODate;
  mode: AppointmentMode;
  location: string;
  bookedBy?: ID; // appointment id
}

export type CaseStatus =
  | "awaiting_sister"
  | "awaiting_response"
  | "active"
  | "on_hold"
  | "rejected_by_sister"
  | "completed"
  | "withdrawn";

export interface ProposalCase {
  id: ID;
  ref: string;
  /** Code the brother shares when he formally communicates his intention. */
  code: string;
  brotherJourneyId: ID;
  sisterJourneyId: ID | null;
  status: CaseStatus;
  linkedAt?: ISODate;
  linkedBy?: "code" | ID;
  respondedAt?: ISODate;
  closedAt?: ISODate;
  closeReason?: string;
  createdAt: ISODate;
}

export type SessionStatus = "planned" | "completed" | "missed";

export interface CounsellingSession {
  id: ID;
  caseId: ID;
  milestoneId: ID;
  date: ISODate;
  status: SessionStatus;
  attendance: "both" | "brother" | "sister" | "none";
  signedOffBy?: ID;
  notes?: string;
}

export interface Milestone {
  id: ID;
  title: string;
  description: string;
}

export interface Message {
  id: ID;
  journeyId: ID;
  from: "staff" | "candidate" | "system";
  staffId?: ID;
  body: string;
  createdAt: ISODate;
  readAt?: ISODate;
}

export interface InternalNote {
  id: ID;
  journeyId: ID;
  staffId: ID;
  body: string;
  createdAt: ISODate;
}

export interface RouteChange {
  id: ID;
  journeyId: ID;
  fromStaffId: ID | null;
  toStaffId: ID | null;
  reason: string;
  byStaffId: ID | "system";
  createdAt: ISODate;
}

export interface Notification {
  id: ID;
  recipient: string;
  recipientEmail: string;
  channel: "email" | "sms";
  template: string;
  subject: string;
  body: string;
  relatedJourneyId?: ID;
  status: "delivered" | "sent" | "failed";
  sentAt: ISODate;
}

export type ActorType = "candidate" | "staff" | "pastor" | "system";

export interface AuditEvent {
  id: ID;
  actorType: ActorType;
  actorName: string;
  action: string;
  target: string;
  journeyId?: ID;
  caseId?: ID;
  reason?: string;
  createdAt: ISODate;
}

export interface StageOverride {
  id: ID;
  journeyId: ID;
  stage: StageKey;
  reason: string;
  byStaffId: ID;
  createdAt: ISODate;
}

export type SupportType = "couple_counselling" | "bereavement";

export interface SupportRequest {
  id: ID;
  ref: string;
  type: SupportType;
  name: string;
  email: string;
  phone: string;
  preferredContact: "phone" | "email" | "whatsapp";
  areaId: ID;
  topic: string;
  details: string;
  availability: string;
  status: "new" | "contacted" | "scheduled" | "closed";
  assignedStaffId: ID | null;
  createdAt: ISODate;
}

export interface Settings {
  pastorLinkExpiryDays: number;
  pastorEmailCode: boolean;
  reminderIntervalDays: number;
  maxAutoReminders: number;
  overdueAfterDays: number;
  freshPastorAssessmentPerProposal: boolean;
  reuseConsentLetter: boolean;
  consentMaxMb: number;
}

export type StageKey =
  | "account"
  | "identity"
  | "pastor"
  | "appointment"
  | "consent"
  | "intention"
  | "response"
  | "counselling";
