export type ContactStatus = "lead" | "prospect" | "customer" | "churned";
export type DealStage = "prospecting" | "qualification" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done";
export type ActivityType = "call" | "email" | "meeting" | "note" | "contact_created" | "deal_created";

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  companyId: string;
  title: string;
  status: ContactStatus;
  tags: string[];
  notes: string;
  value?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  company: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedClose: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  contactId?: string;
  dealId?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignee: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  employees: string;
  revenue: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  contactId?: string;
  dealId?: string;
  contactName?: string;
  createdAt: string;
  duration?: number;
}
