import { Contact, Company, Deal, Task, Activity } from "./types";

export const SEED_CONTACTS: Contact[] = [
  { id: "c1", firstName: "Sarah", lastName: "Johnson", email: "sarah@techcorp.com", phone: "+1-555-0101", company: "TechCorp Inc", title: "VP of Engineering", status: "customer", tags: ["enterprise", "vip"], createdAt: "2026-01-10T09:00:00Z" },
  { id: "c2", firstName: "Michael", lastName: "Chen", email: "m.chen@acme.io", phone: "+1-555-0102", company: "Acme Solutions", title: "CTO", status: "prospect", tags: ["startup"], createdAt: "2026-02-14T10:30:00Z" },
  { id: "c3", firstName: "Elena", lastName: "Rodriguez", email: "elena@ventures.co", phone: "+1-555-0103", company: "Ventures Co", title: "CEO", status: "lead", tags: ["partner"], createdAt: "2026-03-01T08:00:00Z" },
  { id: "c4", firstName: "James", lastName: "Park", email: "jpark@globalsoft.com", phone: "+1-555-0104", company: "GlobalSoft", title: "Product Manager", status: "customer", tags: ["smb"], createdAt: "2026-03-15T14:00:00Z" },
  { id: "c5", firstName: "Priya", lastName: "Sharma", email: "priya@dataspark.ai", phone: "+1-555-0105", company: "DataSpark AI", title: "Head of Sales", status: "prospect", tags: ["ai", "saas"], createdAt: "2026-04-01T11:00:00Z" },
];

export const SEED_COMPANIES: Company[] = [
  { id: "co1", name: "TechCorp Inc", industry: "Software", website: "techcorp.com", employees: 500, revenue: 25000000, country: "USA", createdAt: "2026-01-05T09:00:00Z" },
  { id: "co2", name: "Acme Solutions", industry: "Consulting", website: "acme.io", employees: 120, revenue: 8000000, country: "USA", createdAt: "2026-02-10T10:00:00Z" },
  { id: "co3", name: "DataSpark AI", industry: "AI / ML", website: "dataspark.ai", employees: 45, revenue: 3500000, country: "Canada", createdAt: "2026-03-20T09:00:00Z" },
];

export const SEED_DEALS: Deal[] = [
  { id: "d1", title: "TechCorp Enterprise License", contactId: "c1", companyId: "co1", stage: "negotiation", value: 120000, probability: 75, closeDate: "2026-06-30", notes: "Annual enterprise deal. Legal reviewing contract.", createdAt: "2026-02-01T09:00:00Z" },
  { id: "d2", title: "Acme CRM Implementation", contactId: "c2", companyId: "co2", stage: "proposal", value: 45000, probability: 50, closeDate: "2026-07-15", notes: "Sent proposal, waiting for board approval.", createdAt: "2026-03-10T10:00:00Z" },
  { id: "d3", title: "DataSpark Pilot Program", contactId: "c5", companyId: "co3", stage: "qualification", value: 18000, probability: 30, closeDate: "2026-08-01", notes: "Initial discovery call completed.", createdAt: "2026-04-05T11:00:00Z" },
  { id: "d4", title: "GlobalSoft Support Package", contactId: "c4", companyId: "", stage: "closed_won", value: 24000, probability: 100, closeDate: "2026-05-01", notes: "Signed and onboarded.", createdAt: "2026-01-20T09:00:00Z" },
];

export const SEED_TASKS: Task[] = [
  { id: "t1", title: "Follow up with Sarah on contract terms", description: "Review redlines and schedule legal call", contactId: "c1", dealId: "d1", priority: "high", status: "todo", dueDate: "2026-05-20", createdAt: "2026-05-15T09:00:00Z" },
  { id: "t2", title: "Send proposal to Michael Chen", description: "Finalize pricing deck and email", contactId: "c2", dealId: "d2", priority: "medium", status: "in_progress", dueDate: "2026-05-22", createdAt: "2026-05-14T10:00:00Z" },
  { id: "t3", title: "Schedule discovery call with Elena", description: "Set up intro call to understand pain points", contactId: "c3", priority: "medium", status: "todo", dueDate: "2026-05-25", createdAt: "2026-05-13T11:00:00Z" },
  { id: "t4", title: "Send onboarding kit to James", description: "Email welcome pack and documentation links", contactId: "c4", dealId: "d4", priority: "low", status: "done", dueDate: "2026-05-10", createdAt: "2026-05-08T09:00:00Z" },
];

export const SEED_ACTIVITIES: Activity[] = [
  { id: "a1", type: "call", title: "Discovery call with Sarah Johnson", description: "30-min call. Discussed contract terms and timeline.", contactId: "c1", dealId: "d1", createdAt: "2026-05-14T14:00:00Z" },
  { id: "a2", type: "email", title: "Sent proposal to Michael Chen", description: "Sent 12-page proposal with pricing options.", contactId: "c2", dealId: "d2", createdAt: "2026-05-13T11:30:00Z" },
  { id: "a3", type: "meeting", title: "Onboarding kickoff with James Park", description: "1-hour kickoff session. Setup completed.", contactId: "c4", dealId: "d4", createdAt: "2026-05-10T15:00:00Z" },
  { id: "a4", type: "note", title: "Note: Priya interested in custom integrations", description: "Flagged for engineering team to prepare technical scope.", contactId: "c5", dealId: "d3", createdAt: "2026-05-12T09:00:00Z" },
];
