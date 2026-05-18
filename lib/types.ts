export type ContactStatus = "lead" | "prospect" | "customer" | "churned";
export type DealStage = "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type ActivityType =
  | "email"
  | "call"
  | "meeting"
  | "note"
  | "deal_created"
  | "deal_updated"
  | "contact_created"
  | "task_completed";

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
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  website?: string;
  industry: string;
  size?: string;
  employees?: number;
  revenue: number;
  phone: string;
  email?: string;
  address: string;
  notes: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  companyId: string;
  companyName: string;
  stage: DealStage;
  value: number;
  currency: string;
  probability: number;
  closeDate: string;
  notes: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  contactId?: string;
  contactName?: string;
  dealId?: string;
  dealName?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  contactId?: string;
  contactName?: string;
  dealId?: string;
  dealName?: string;
  createdAt: string;
}

export interface CRMStore {
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  tasks: Task[];
  activities: Activity[];
}
