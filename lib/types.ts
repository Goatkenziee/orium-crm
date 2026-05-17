export type ContactStatus = "lead" | "prospect" | "customer" | "churned";
export type DealStage = "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type ActivityType =
  | "email"
  | "call"
  | "meeting"
  | "note"
  | "deal_won"
  | "deal_lost"
  | "contact_added"
  | "task_done"
  | "deal_updated"
  | "deal_created"
  | "contact_created"
  | "task_completed";

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  companyId?: string;
  title?: string;
  status: ContactStatus;
  tags: string[];
  value: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  employees: number;
  revenue: number;
  notes?: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  contactId?: string;
  contactName?: string;
  companyId?: string;
  companyName?: string;
  stage: DealStage;
  value: number;
  currency?: string;
  probability: number;
  closeDate?: string;
  notes?: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  contactId?: string;
  contactName?: string;
  dealId?: string;
  dealName?: string;
  assignedTo?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
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
