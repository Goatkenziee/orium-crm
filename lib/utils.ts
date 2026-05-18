export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value.toFixed(0)}`;
}

export function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function fullName(contact: { firstName: string; lastName: string }): string {
  return `${contact.firstName} ${contact.lastName}`;
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    lead: "bg-slate-100 text-slate-700",
    prospect: "bg-blue-100 text-blue-700",
    customer: "bg-green-100 text-green-700",
    churned: "bg-red-100 text-red-700",
  };
  return map[status] ?? "bg-slate-100 text-slate-600";
}

export function stageColor(stage: string): string {
  const map: Record<string, string> = {
    prospecting: "bg-slate-100 text-slate-700",
    qualification: "bg-blue-100 text-blue-700",
    proposal: "bg-yellow-100 text-yellow-700",
    negotiation: "bg-orange-100 text-orange-700",
    closed_won: "bg-green-100 text-green-700",
    closed_lost: "bg-red-100 text-red-700",
  };
  return map[stage] ?? "bg-slate-100 text-slate-600";
}

export function priorityColor(priority: string): string {
  const map: Record<string, string> = {
    low: "bg-slate-100 text-slate-600",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };
  return map[priority] ?? "bg-slate-100 text-slate-600";
}

export function taskStatusColor(status: string): string {
  const map: Record<string, string> = {
    todo: "bg-slate-100 text-slate-600",
    in_progress: "bg-blue-100 text-blue-700",
    done: "bg-green-100 text-green-700",
  };
  return map[status] ?? "bg-slate-100 text-slate-600";
}
