"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building2, TrendingUp, CheckSquare, Activity, Settings, Zap } from "lucide-react";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/contacts", icon: Users, label: "Contacts" },
  { href: "/companies", icon: Building2, label: "Companies" },
  { href: "/deals", icon: TrendingUp, label: "Deals" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/activities", icon: Activity, label: "Activities" },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-60 bg-slate-900 flex flex-col shrink-0">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-700">
        <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <span className="text-white font-semibold text-sm tracking-wide">Orium CRM</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-slate-700">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
          <Settings size={16} />
          Settings
        </Link>
        <div className="mt-3 px-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
            <div>
              <p className="text-slate-200 text-xs font-medium">Alexander</p>
              <p className="text-slate-500 text-xs">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
