export type ContactStatus = "lead" | "prospect" | "customer" | "churned";
export type DealStage = "prospecting" | "qualification" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type ActivityType = "call" | "email" | "meeting" | "note" | "task";

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  status: ContactStatus;
  tags: string[];
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  employees: number;
  revenue: number;
  country: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  companyId: string;
  stage: DealStage;
  value: number;
  probability: number;
  closeDate: string;
  notes: string;
  createdAt: string;
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
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  contactId?: string;
  dealId?: string;
  createdAt: string;
}

export interface CRMState {
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  tasks: Task[];
  activities: Activity[];
}
