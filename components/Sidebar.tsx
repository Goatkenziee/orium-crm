"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, TrendingUp,
  CheckSquare, Activity, Settings, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/contacts", icon: Users, label: "Contacts" },
  { href: "/companies", icon: Building2, label: "Companies" },
  { href: "/deals", icon: TrendingUp, label: "Pipeline" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/activity", icon: Activity, label: "Activity" },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-gray-900 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-700">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">Orium CRM</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              path.startsWith(href)
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-700">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <div className="mt-3 px-3 py-2 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">A</div>
          <div className="min-w-0">
            <div className="text-white text-xs font-medium truncate">Alexander</div>
            <div className="text-gray-500 text-xs truncate">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
