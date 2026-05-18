import { DealStage } from "./types";

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export function uuid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export const STAGE_LABELS: Record<DealStage, string> = {
  prospecting: "Prospecting",
  qualification: "Qualification",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Won",
  closed_lost: "Lost",
};

export const STAGE_COLORS: Record<DealStage, string> = {
  prospecting: "bg-slate-100 text-slate-700",
  qualification: "bg-blue-100 text-blue-700",
  proposal: "bg-purple-100 text-purple-700",
  negotiation: "bg-amber-100 text-amber-700",
  closed_won: "bg-emerald-100 text-emerald-700",
  closed_lost: "bg-red-100 text-red-700",
};

export function initials(first: string, last: string): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export function getContrastColor(bg: string): string {
  return "#ffffff";
}
