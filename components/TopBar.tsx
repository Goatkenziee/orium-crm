"use client";

import { Search, Bell, Plus } from "lucide-react";
import { useCRM } from "@/lib/store";

interface TopBarProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

export default function TopBar({ title, subtitle, action }: TopBarProps) {
  const { setSearch, state } = useCRM();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-lg font-bold text-slate-900 truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search…"
            defaultValue={state.searchQuery}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Bell */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
        </button>

        {/* Action */}
        {action && (
          <button
            onClick={action.onClick}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            {action.label}
          </button>
        )}
      </div>
    </header>
  );
}
