export type Plan = 'free' | 'season' | 'adviser';

export type ProgrammeStatus =
  'researching' | 'shortlisted' | 'applying' | 'submitted' | 'offer' | 'rejected' | 'dropped';

export type RequirementType =
  | 'transcript'
  | 'cv'
  | 'statement'
  | 'reference'
  | 'language_test'
  | 'gre'
  | 'portfolio'
  | 'interview'
  | 'fee';

export type DocumentStatus = 'missing' | 'draft' | 'ready';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  plan: Plan;
  createdAt: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
}

export interface Programme {
  id: string;
  universityId: string;
  name: string;
  degree: string;
  field: string;
  tuitionUsd: number;
  durationMonths: number;
  intake: string;
  deadline: string; // ISO date
  status: ProgrammeStatus;
  priority: 1 | 2 | 3;
}

export interface Requirement {
  id: string;
  programmeId: string;
  type: RequirementType;
  label: string;
  detail: string;
  required: boolean;
  documentId: string | null;
}

export interface Doc {
  id: string;
  name: string;
  type: RequirementType;
  status: DocumentStatus;
  updatedAt: string;
}

export interface Task {
  id: string;
  programmeId: string | null;
  title: string;
  due: string; // ISO date
  done: boolean;
  dependsOnId: string | null;
}

export interface Note {
  id: string;
  programmeId: string;
  body: string;
  createdAt: string;
}

export interface Adviser {
  id: string;
  name: string;
  email: string;
  shareToken: string;
}

export interface StatusRecord {
  id: string;
  programmeId: string;
  status: ProgrammeStatus;
  changedAt: string;
}

export interface Workspace {
  universities: University[];
  programmes: Programme[];
  requirements: Requirement[];
  documents: Doc[];
  tasks: Task[];
  notes: Note[];
  advisers: Adviser[];
  statusRecords: StatusRecord[];
}

export const PROGRAMME_STATUSES: ProgrammeStatus[] = [
  'researching',
  'shortlisted',
  'applying',
  'submitted',
  'offer',
  'rejected',
  'dropped',
];

export const REQUIREMENT_TYPES: RequirementType[] = [
  'transcript',
  'cv',
  'statement',
  'reference',
  'language_test',
  'gre',
  'portfolio',
  'interview',
  'fee',
];

export const REQUIREMENT_LABELS: Record<RequirementType, string> = {
  transcript: 'Transcript',
  cv: 'CV',
  statement: 'Personal statement',
  reference: 'Reference letter',
  language_test: 'Language test',
  gre: 'GRE / GMAT',
  portfolio: 'Portfolio',
  interview: 'Interview',
  fee: 'Application fee',
};

export const FREE_PLAN_PROGRAMME_LIMIT = 3;
