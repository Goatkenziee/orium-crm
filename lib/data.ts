import type { Contact, Deal, Task, Company, Activity } from "./types";

export const SEED_CONTACTS: Contact[] = [
  { id: "c1", firstName: "Sarah", lastName: "Chen", email: "sarah.chen@techflow.com", phone: "+1 415 555 0101", company: "TechFlow Inc", companyId: "co1", title: "CTO", status: "customer", tags: ["enterprise", "tech"], notes: "Key decision maker. Very responsive.", value: 85000, createdAt: "2024-01-15T10:00:00Z", updatedAt: "2024-03-20T14:30:00Z" },
  { id: "c2", firstName: "Marcus", lastName: "Webb", email: "m.webb@growthco.io", phone: "+1 312 555 0202", company: "GrowthCo", companyId: "co2", title: "VP Sales", status: "prospect", tags: ["startup"], notes: "Interested in enterprise plan.", value: 32000, createdAt: "2024-02-01T09:00:00Z", updatedAt: "2024-03-18T11:00:00Z" },
  { id: "c3", firstName: "Elena", lastName: "Rossi", email: "elena@innovatech.eu", phone: "+44 20 555 0303", company: "InnovaTech EU", companyId: "co3", title: "CEO", status: "customer", tags: ["enterprise", "international"], notes: "Expanding to US market.", value: 120000, createdAt: "2024-01-20T08:00:00Z", updatedAt: "2024-03-22T16:00:00Z" },
  { id: "c4", firstName: "James", lastName: "Liu", email: "jliu@databridge.com", phone: "+1 628 555 0404", company: "DataBridge", companyId: "co4", title: "Head of Engineering", status: "lead", tags: ["tech"], notes: "Came via referral from Sarah.", value: 0, createdAt: "2024-03-01T11:00:00Z", updatedAt: "2024-03-25T09:00:00Z" },
  { id: "c5", firstName: "Priya", lastName: "Nair", email: "priya@scaleup.ai", phone: "+1 650 555 0505", company: "ScaleUp AI", companyId: "co5", title: "Founder", status: "prospect", tags: ["ai", "startup"], notes: "Demo scheduled next week.", value: 45000, createdAt: "2024-02-15T14:00:00Z", updatedAt: "2024-03-19T13:00:00Z" },
  { id: "c6", firstName: "Daniel", lastName: "Ortega", email: "d.ortega@cloudvault.net", phone: "+1 213 555 0606", company: "CloudVault", companyId: "co6", title: "COO", status: "churned", tags: ["cloud"], notes: "Contract ended Q1. Possible win-back.", value: 0, createdAt: "2023-06-01T09:00:00Z", updatedAt: "2024-03-01T10:00:00Z" },
];

export const SEED_DEALS: Deal[] = [
  { id: "d1", title: "TechFlow Enterprise License", contactId: "c1", contactName: "Sarah Chen", company: "TechFlow Inc", value: 85000, stage: "closed_won", probability: 100, expectedClose: "2024-03-15", createdAt: "2024-01-15T10:00:00Z", updatedAt: "2024-03-15T12:00:00Z", notes: "Annual license. Auto-renews." },
  { id: "d2", title: "GrowthCo Sales Suite", contactId: "c2", contactName: "Marcus Webb", company: "GrowthCo", value: 32000, stage: "proposal", probability: 60, expectedClose: "2024-04-30", createdAt: "2024-02-01T09:00:00Z", updatedAt: "2024-03-20T11:00:00Z", notes: "Sent proposal v2." },
  { id: "d3", title: "InnovaTech Global Expansion", contactId: "c3", contactName: "Elena Rossi", company: "InnovaTech EU", value: 120000, stage: "negotiation", probability: 80, expectedClose: "2024-04-15", createdAt: "2024-01-20T08:00:00Z", updatedAt: "2024-03-22T16:00:00Z", notes: "Legal review in progress." },
  { id: "d4", title: "DataBridge Integration", contactId: "c4", contactName: "James Liu", company: "DataBridge", value: 28000, stage: "qualification", probability: 40, expectedClose: "2024-05-30", createdAt: "2024-03-01T11:00:00Z", updatedAt: "2024-03-25T09:00:00Z", notes: "Technical evaluation phase." },
  { id: "d5", title: "ScaleUp AI Platform", contactId: "c5", contactName: "Priya Nair", company: "ScaleUp AI", value: 45000, stage: "prospecting", probability: 20, expectedClose: "2024-06-30", createdAt: "2024-02-15T14:00:00Z", updatedAt: "2024-03-19T13:00:00Z", notes: "Initial interest confirmed." },
  { id: "d6", title: "CloudVault Win-Back", contactId: "c6", contactName: "Daniel Ortega", company: "CloudVault", value: 55000, stage: "prospecting", probability: 15, expectedClose: "2024-07-31", createdAt: "2024-03-10T09:00:00Z", updatedAt: "2024-03-18T10:00:00Z", notes: "Reaching out after churn." },
];

export const SEED_TASKS: Task[] = [
  { id: "t1", title: "Follow up with Elena re: legal review", description: "Check if legal team approved contract terms", contactId: "c3", dealId: "d3", priority: "high", status: "todo", dueDate: "2024-03-27", createdAt: "2024-03-22T16:00:00Z", updatedAt: "2024-03-22T16:00:00Z", assignee: "Alexander" },
  { id: "t2", title: "Send updated proposal to GrowthCo", description: "Include revised pricing based on headcount", contactId: "c2", dealId: "d2", priority: "high", status: "in_progress", dueDate: "2024-03-26", createdAt: "2024-03-20T11:00:00Z", updatedAt: "2024-03-21T09:00:00Z", assignee: "Alexander" },
  { id: "t3", title: "Schedule DataBridge technical demo", description: "Coordinate with engineering team", contactId: "c4", dealId: "d4", priority: "medium", status: "todo", dueDate: "2024-03-28", createdAt: "2024-03-25T09:00:00Z", updatedAt: "2024-03-25T09:00:00Z", assignee: "Alexander" },
  { id: "t4", title: "Q1 Revenue report", description: "Prepare board presentation", priority: "medium", status: "in_progress", dueDate: "2024-03-31", createdAt: "2024-03-01T09:00:00Z", updatedAt: "2024-03-20T14:00:00Z", assignee: "Alexander" },
  { id: "t5", title: "Priya Nair discovery call", description: "Qualify ScaleUp AI requirements", contactId: "c5", dealId: "d5", priority: "medium", status: "done", dueDate: "2024-03-20", createdAt: "2024-03-15T10:00:00Z", updatedAt: "2024-03-20T16:00:00Z", assignee: "Alexander" },
  { id: "t6", title: "CloudVault win-back email sequence", description: "Draft personalised re-engagement emails", contactId: "c6", priority: "low", status: "todo", dueDate: "2024-04-05", createdAt: "2024-03-10T09:00:00Z", updatedAt: "2024-03-10T09:00:00Z", assignee: "Alexander" },
];

export const SEED_COMPANIES: Company[] = [
  { id: "co1", name: "TechFlow Inc", industry: "Software", website: "https://techflow.com", phone: "+1 415 555 0100", email: "info@techflow.com", address: "101 Market St, San Francisco, CA", employees: "201-500", revenue: 42000000, notes: "", createdAt: "2024-01-15T10:00:00Z", updatedAt: "2024-03-20T14:00:00Z" },
  { id: "co2", name: "GrowthCo", industry: "Marketing", website: "https://growthco.io", phone: "+1 312 555 0200", email: "hello@growthco.io", address: "200 N Michigan Ave, Chicago, IL", employees: "51-200", revenue: 8500000, notes: "", createdAt: "2024-02-01T09:00:00Z", updatedAt: "2024-03-18T11:00:00Z" },
  { id: "co3", name: "InnovaTech EU", industry: "Technology", website: "https://innovatech.eu", phone: "+44 20 555 0300", email: "contact@innovatech.eu", address: "15 Canary Wharf, London, UK", employees: "500+", revenue: 180000000, notes: "", createdAt: "2024-01-20T08:00:00Z", updatedAt: "2024-03-22T16:00:00Z" },
  { id: "co4", name: "DataBridge", industry: "Analytics", website: "https://databridge.com", phone: "+1 628 555 0400", email: "info@databridge.com", address: "525 Market St, San Francisco, CA", employees: "11-50", revenue: 3200000, notes: "", createdAt: "2024-03-01T11:00:00Z", updatedAt: "2024-03-25T09:00:00Z" },
  { id: "co5", name: "ScaleUp AI", industry: "Artificial Intelligence", website: "https://scaleup.ai", phone: "+1 650 555 0500", email: "team@scaleup.ai", address: "2600 El Camino Real, Palo Alto, CA", employees: "1-10", revenue: 1100000, notes: "", createdAt: "2024-02-15T14:00:00Z", updatedAt: "2024-03-19T13:00:00Z" },
  { id: "co6", name: "CloudVault", industry: "Cloud Infrastructure", website: "https://cloudvault.net", phone: "+1 213 555 0600", email: "ops@cloudvault.net", address: "633 W 5th St, Los Angeles, CA", employees: "201-500", revenue: 28000000, notes: "", createdAt: "2023-06-01T09:00:00Z", updatedAt: "2024-03-01T10:00:00Z" },
];

export const SEED_ACTIVITIES: Activity[] = [
  { id: "a1", type: "call", title: "Discovery call with Sarah Chen", description: "Discussed enterprise needs and Q2 roadmap", contactId: "c1", contactName: "Sarah Chen", createdAt: "2024-03-22T14:00:00Z", duration: 45 },
  { id: "a2", type: "email", title: "Proposal sent to Marcus Webb", description: "GrowthCo pricing proposal v2", contactId: "c2", dealId: "d2", contactName: "Marcus Webb", createdAt: "2024-03-20T11:00:00Z" },
  { id: "a3", type: "meeting", title: "Contract negotiation – Elena Rossi", description: "Reviewed legal terms with InnovaTech team", contactId: "c3", dealId: "d3", contactName: "Elena Rossi", createdAt: "2024-03-19T10:00:00Z", duration: 90 },
  { id: "a4", type: "note", title: "James Liu referral noted", description: "Referred by Sarah Chen at TechFlow", contactId: "c4", contactName: "James Liu", createdAt: "2024-03-18T09:00:00Z" },
  { id: "a5", type: "call", title: "Discovery call – Priya Nair", description: "Confirmed AI platform requirements", contactId: "c5", dealId: "d5", contactName: "Priya Nair", createdAt: "2024-03-15T14:00:00Z", duration: 30 },
  { id: "a6", type: "email", title: "Win-back outreach to Daniel Ortega", description: "Sent personalised re-engagement email", contactId: "c6", contactName: "Daniel Ortega", createdAt: "2024-03-10T09:00:00Z" },
];

export const MONTHLY_REVENUE = [
  { month: "Oct", revenue: 62000 },
  { month: "Nov", revenue: 75000 },
  { month: "Dec", revenue: 91000 },
  { month: "Jan", revenue: 58000 },
  { month: "Feb", revenue: 83000 },
  { month: "Mar", revenue: 105000 },
];
