export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatRelative(iso: string): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

// alias used in activities page
export const formatRelativeDate = formatRelative;

export function initials(first: string, last: string): string {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

// alias used in deals / companies pages
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(w => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ── Stage / Status / Priority badges ────────────────────────────────────────

export const DEAL_STAGES = [
  { key: "lead", label: "Lead", color: "bg-slate-100 text-slate-700" },
  { key: "qualified", label: "Qualified", color: "bg-blue-100 text-blue-700" },
  { key: "proposal", label: "Proposal", color: "bg-amber-100 text-amber-700" },
  { key: "negotiation", label: "Negotiation", color: "bg-orange-100 text-orange-700" },
  { key: "won", label: "Won", color: "bg-emerald-100 text-emerald-700" },
  { key: "lost", label: "Lost", color: "bg-red-100 text-red-700" },
] as const;

export const CONTACT_STATUSES = [
  { key: "lead", label: "Lead", color: "bg-slate-100 text-slate-700" },
  { key: "prospect", label: "Prospect", color: "bg-blue-100 text-blue-700" },
  { key: "customer", label: "Customer", color: "bg-emerald-100 text-emerald-700" },
  { key: "churned", label: "Churned", color: "bg-red-100 text-red-700" },
] as const;

export const TASK_PRIORITIES = [
  { key: "low", label: "Low", color: "bg-slate-100 text-slate-600" },
  { key: "medium", label: "Medium", color: "bg-amber-100 text-amber-700" },
  { key: "high", label: "High", color: "bg-red-100 text-red-700" },
] as const;

export function stageBadge(stage: string) {
  return DEAL_STAGES.find(s => s.key === stage) ?? { label: stage, color: "bg-slate-100 text-slate-700" };
}

// alias used in deals page
export function stageColor(stage: string): string {
  return stageBadge(stage).color;
}

export function statusBadge(status: string) {
  return CONTACT_STATUSES.find(s => s.key === status) ?? { label: status, color: "bg-slate-100 text-slate-700" };
}

export function priorityBadge(priority: string) {
  return TASK_PRIORITIES.find(p => p.key === priority) ?? { label: priority, color: "bg-slate-100 text-slate-700" };
}

// ── Avatar color ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-500",
  "bg-pink-600",
  "bg-indigo-600",
  "bg-teal-600",
  "bg-orange-600",
];

export function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
