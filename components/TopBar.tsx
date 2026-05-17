"use client";
import { Search, Bell, Plus } from "lucide-react";
import { useState } from "react";

interface TopBarProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

export default function TopBar({ title, subtitle, action }: TopBarProps) {
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
      <div className="flex-1">
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className="relative hidden sm:block">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 text-sm bg-slate-100 border border-transparent rounded-lg focus:outline-none focus:border-indigo-400 focus:bg-white w-56 transition-all"
        />
      </div>

      {/* Bell */}
      <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
      </button>

      {/* Action */}
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={15} />
          {action.label}
        </button>
      )}
    </header>
  );
}
