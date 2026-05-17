import type { Contact, Company, Deal, Task, Activity, CRMStore } from "./types";

const now = new Date().toISOString();
const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();

export const seedCompanies: Company[] = [
  { id: "c1", name: "Acme Corp", domain: "acme.com", industry: "Technology", size: "51-200", revenue: 5000000, phone: "+1 415 555 0100", address: "123 Market St, San Francisco, CA", notes: "Key enterprise account.", createdAt: d(90), updatedAt: d(10) },
  { id: "c2", name: "Globex Inc", domain: "globex.com", industry: "Manufacturing", size: "201-500", revenue: 12000000, phone: "+1 212 555 0200", address: "45 Park Ave, New York, NY", notes: "Large mid-market client.", createdAt: d(80), updatedAt: d(5) },
  { id: "c3", name: "Initech", domain: "initech.com", industry: "Finance", size: "11-50", revenue: 2000000, phone: "+1 512 555 0300", address: "88 Congress Ave, Austin, TX", notes: "", createdAt: d(60), updatedAt: d(20) },
  { id: "c4", name: "Umbrella LLC", domain: "umbrella.com", industry: "Healthcare", size: "501-1000", revenue: 30000000, phone: "+1 312 555 0400", address: "200 N Michigan Ave, Chicago, IL", notes: "Strategic partner.", createdAt: d(45), updatedAt: d(3) },
];

export const seedContacts: Contact[] = [
  { id: "ct1", firstName: "Sarah", lastName: "Chen", email: "sarah.chen@acme.com", phone: "+1 415 555 1001", company: "Acme Corp", companyId: "c1", title: "VP of Sales", status: "customer", tags: ["vip", "enterprise"], notes: "Met at SaaStr 2024. Prefers morning calls.", createdAt: d(85), updatedAt: d(2) },
  { id: "ct2", firstName: "James", lastName: "Rivera", email: "james.r@globex.com", phone: "+1 212 555 1002", company: "Globex Inc", companyId: "c2", title: "CTO", status: "prospect", tags: ["technical"], notes: "Interested in API integration.", createdAt: d(70), updatedAt: d(7) },
  { id: "ct3", firstName: "Emily", lastName: "Watson", email: "ewatson@initech.com", phone: "+1 512 555 1003", company: "Initech", companyId: "c3", title: "CEO", status: "lead", tags: ["decision-maker"], notes: "Referred by Sarah Chen.", createdAt: d(30), updatedAt: d(1) },
  { id: "ct4", firstName: "Marcus", lastName: "Johnson", email: "m.johnson@umbrella.com", phone: "+1 312 555 1004", company: "Umbrella LLC", companyId: "c4", title: "Head of Operations", status: "customer", tags: ["upsell"], notes: "Renewal due in Q3.", createdAt: d(40), updatedAt: d(5) },
  { id: "ct5", firstName: "Priya", lastName: "Patel", email: "priya.p@acme.com", phone: "+1 415 555 1005", company: "Acme Corp", companyId: "c1", title: "Product Manager", status: "prospect", tags: [], notes: "", createdAt: d(20), updatedAt: d(20) },
  { id: "ct6", firstName: "Tom", lastName: "Bradley", email: "tbradley@freelance.io", phone: "+1 650 555 1006", company: "", companyId: "", title: "Consultant", status: "churned", tags: ["at-risk"], notes: "Cancelled subscription last quarter.", createdAt: d(120), updatedAt: d(30) },
];

export const seedDeals: Deal[] = [
  { id: "d1", title: "Acme Enterprise Plan", contactId: "ct1", contactName: "Sarah Chen", companyId: "c1", companyName: "Acme Corp", stage: "negotiation", value: 48000, currency: "USD", probability: 75, closeDate: d(-14), notes: "Annual contract. Legal review pending.", createdAt: d(60), updatedAt: d(2), ownerName: "Alexander" },
  { id: "d2", title: "Globex API Integration", contactId: "ct2", contactName: "James Rivera", companyId: "c2", companyName: "Globex Inc", stage: "proposal", value: 22000, currency: "USD", probability: 50, closeDate: d(-30), notes: "Sent proposal on Monday.", createdAt: d(40), updatedAt: d(5), ownerName: "Alexander" },
  { id: "d3", title: "Initech Starter Package", contactId: "ct3", contactName: "Emily Watson", companyId: "c3", companyName: "Initech", stage: "qualified", value: 8500, currency: "USD", probability: 30, closeDate: d(-45), notes: "Needs CFO approval.", createdAt: d(25), updatedAt: d(1), ownerName: "Alexander" },
  { id: "d4", title: "Umbrella Renewal + Upsell", contactId: "ct4", contactName: "Marcus Johnson", companyId: "c4", companyName: "Umbrella LLC", stage: "won", value: 65000, currency: "USD", probability: 100, closeDate: d(10), notes: "Closed! Upsell to premium tier.", createdAt: d(50), updatedAt: d(3), ownerName: "Alexander" },
  { id: "d5", title: "Acme Add-on Seats", contactId: "ct5", contactName: "Priya Patel", companyId: "c1", companyName: "Acme Corp", stage: "lead", value: 12000, currency: "USD", probability: 15, closeDate: d(-60), notes: "Early stage, needs nurturing.", createdAt: d(15), updatedAt: d(15), ownerName: "Alexander" },
  { id: "d6", title: "Bradley Consulting Retainer", contactId: "ct6", contactName: "Tom Bradley", companyId: "", companyName: "", stage: "lost", value: 6000, currency: "USD", probability: 0, closeDate: d(20), notes: "Budget constraints cited.", createdAt: d(90), updatedAt: d(30), ownerName: "Alexander" },
];

export const seedTasks: Task[] = [
  { id: "t1", title: "Follow up with Sarah Chen re: contract", description: "Check on legal review status and timeline.", status: "todo", priority: "high", dueDate: d(-1), contactId: "ct1", contactName: "Sarah Chen", dealId: "d1", dealName: "Acme Enterprise Plan", createdAt: d(3), updatedAt: d(3) },
  { id: "t2", title: "Send Globex API proposal", description: "Finalize pricing and attach case studies.", status: "in_progress", priority: "high", dueDate: d(-2), contactId: "ct2", contactName: "James Rivera", dealId: "d2", dealName: "Globex API Integration", createdAt: d(5), updatedAt: d(1) },
  { id: "t3", title: "Schedule demo with Emily Watson", description: "Book a 45-minute product demo.", status: "todo", priority: "medium", dueDate: d(-5), contactId: "ct3", contactName: "Emily Watson", dealId: "d3", dealName: "Initech Starter Package", createdAt: d(2), updatedAt: d(2) },
  { id: "t4", title: "Send Umbrella renewal invoice", description: "Generate and send the renewal invoice via Stripe.", status: "done", priority: "high", dueDate: d(5), contactId: "ct4", contactName: "Marcus Johnson", dealId: "d4", dealName: "Umbrella Renewal + Upsell", createdAt: d(8), updatedAt: d(3), completedAt: d(3) },
  { id: "t5", title: "Update CRM with new contacts from SaaStr", description: "Add the 6 new contacts from last week's event.", status: "todo", priority: "low", dueDate: d(-7), createdAt: d(7), updatedAt: d(7) },
];

export const seedActivities: Activity[] = [
  { id: "a1", type: "deal_updated", title: "Deal moved to Negotiation", description: "Acme Enterprise Plan advanced to Negotiation stage.", contactId: "ct1", contactName: "Sarah Chen", dealId: "d1", dealName: "Acme Enterprise Plan", createdAt: d(2) },
  { id: "a2", type: "email", title: "Email sent to James Rivera", description: "Sent Globex API Integration proposal deck and pricing sheet.", contactId: "ct2", contactName: "James Rivera", dealId: "d2", dealName: "Globex API Integration", createdAt: d(3) },
  { id: "a3", type: "deal_created", title: "New deal created", description: "Umbrella Renewal + Upsell deal created at $65,000.", contactId: "ct4", contactName: "Marcus Johnson", dealId: "d4", dealName: "Umbrella Renewal + Upsell", createdAt: d(5) },
  { id: "a4", type: "call", title: "Call with Emily Watson", description: "30-minute discovery call. Interested in starter plan.", contactId: "ct3", contactName: "Emily Watson", createdAt: d(6) },
  { id: "a5", type: "deal_updated", title: "Deal marked as Won 🎉", description: "Umbrella Renewal + Upsell closed at $65,000.", contactId: "ct4", contactName: "Marcus Johnson", dealId: "d4", dealName: "Umbrella Renewal + Upsell", createdAt: d(3) },
  { id: "a6", type: "contact_created", title: "New contact added", description: "Priya Patel from Acme Corp added to CRM.", contactId: "ct5", contactName: "Priya Patel", createdAt: d(20) },
  { id: "a7", type: "task_completed", title: "Task completed", description: "Sent Umbrella renewal invoice to Marcus Johnson.", contactId: "ct4", contactName: "Marcus Johnson", createdAt: d(3) },
  { id: "a8", type: "meeting", title: "Kickoff meeting with Umbrella LLC", description: "Onboarding kickoff for premium tier upgrade.", contactId: "ct4", contactName: "Marcus Johnson", createdAt: d(1) },
];

export const seedData: CRMStore = {
  contacts: seedContacts,
  companies: seedCompanies,
  deals: seedDeals,
  tasks: seedTasks,
  activities: seedActivities,
};
