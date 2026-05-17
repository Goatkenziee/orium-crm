import { type ClassValue, clsx } from "clsx";
import type { ContactStatus, DealStage, TaskPriority, TaskStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

export function statusColor(status: ContactStatus): string {
  const map: Record<ContactStatus, string> = {
    lead: "bg-yellow-100 text-yellow-800",
    prospect: "bg-blue-100 text-blue-800",
    customer: "bg-green-100 text-green-800",
    churned: "bg-red-100 text-red-800",
  };
  return map[status];
}

export function stageColor(stage: DealStage): string {
  const map: Record<DealStage, string> = {
    lead: "bg-gray-100 text-gray-700",
    qualified: "bg-blue-100 text-blue-700",
    proposal: "bg-purple-100 text-purple-700",
    negotiation: "bg-orange-100 text-orange-700",
    won: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
  };
  return map[stage];
}

export function priorityColor(priority: TaskPriority): string {
  const map: Record<TaskPriority, string> = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };
  return map[priority];
}

export function taskStatusColor(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    todo: "text-gray-500",
    in_progress: "text-blue-600",
    done: "text-green-600",
  };
  return map[status];
}

export function avatarColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-red-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export const DEAL_STAGES: { value: DealStage; label: string }[] = [
  { value: "lead", label: "Lead" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export const CONTACT_STATUSES: { value: ContactStatus; label: string }[] = [
  { value: "lead", label: "Lead" },
  { value: "prospect", label: "Prospect" },
  { value: "customer", label: "Customer" },
  { value: "churned", label: "Churned" },
];
