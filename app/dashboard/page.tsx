"use client";
import { useCRM } from "@/store/crm";
import TopBar from "@/components/TopBar";
import KpiCard from "@/components/KpiCard";
import { Users, Briefcase, DollarSign, CheckSquare, TrendingUp, Clock } from "lucide-react";
import { MONTHLY_REVENUE } from "@/lib/data";
import clsx from "clsx";
import Link from "next/link";

const STAGE_COLORS: Record<string, string> = {
  lead: "bg-slate-200 text-slate-700",
  qualified: "bg-blue-100 text-blue-700",
  proposal: "bg-amber-100 text-amber-700",
  negotiation: "bg-purple-100 text-purple-700",
  won: "bg-emerald-100 text-emerald-700",
  lost: "bg-red-100 text-red-700",
};

const ACTIVITY_ICONS: Record<string, { bg: string; text: string; symbol: string }> = {
  email: { bg: "bg-blue-100", text: "text-blue-600", symbol: "✉" },
  call: { bg: "bg-violet-100", text: "text-violet-600", symbol: "📞" },
  meeting: { bg: "bg-amber-100", text: "text-amber-600", symbol: "🗓" },
  note: { bg: "bg-slate-100", text: "text-slate-600", symbol: "📝" },
  deal_won: { bg: "bg-emerald-100", text: "text-emerald-600", symbol: "🏆" },
  deal_lost: { bg: "bg-red-100", text: "text-red-600", symbol: "✗" },
  contact_added: { bg: "bg-indigo-100", text: "text-indigo-600", symbol: "👤" },
  task_done: { bg: "bg-teal-100", text: "text-teal-600", symbol: "✓" },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days > 30) return `${Math.floor(days / 30)}mo ago`;
  if (days > 0) return `${days}d ago`;
  const hrs = Math.floor(diff / 3600000);
  if (hrs > 0) return `${hrs}h ago`;
  return "Just now";
}

export default function DashboardPage() {
  const { contacts, deals, tasks, activities } = useCRM();

  const totalContacts = contacts.length;
  const customers = contacts.filter((c) => c.status === "customer").length;
  const activeDeals = deals.filter((d) => !["won", "lost"].includes(d.stage));
  const pipelineValue = activeDeals.reduce((s, d) => s + d.value, 0);
  const wonRevenue = deals.filter((d) => d.stage === "won").reduce((s, d) => s + d.value, 0);
  const openTasks = tasks.filter((t) => t.status !== "done").length;
  const highPriority = tasks.filter((t) => t.status !== "done" && t.priority === "high").length;

  const maxRevenue = Math.max(...MONTHLY_REVENUE.map((m) => m.revenue));

  return (
    <div className="flex-1 flex flex-col">
      <TopBar title="Dashboard" subtitle="Welcome back, Alexander 👋" />
      <div className="flex-1 p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard title="Total Contacts" value={String(totalContacts)} change={`${customers} customers`} changePositive icon={Users} iconColor="text-indigo-600" iconBg="bg-indigo-50" />
          <KpiCard title="Pipeline Value" value={`$${(pipelineValue / 1000).toFixed(0)}k`} change={`${activeDeals.length} active deals`} changePositive icon={Briefcase} iconColor="text-amber-600" iconBg="bg-amber-50" />
          <KpiCard title="Won Revenue" value={`$${(wonRevenue / 1000).toFixed(0)}k`} change="All time" changePositive icon={DollarSign} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
          <KpiCard title="Open Tasks" value={String(openTasks)} change={`${highPriority} high priority`} changePositive={highPriority === 0} icon={CheckSquare} iconColor="text-violet-600" iconBg="bg-violet-50" />
        </div>

        {/* Charts + Pipeline */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Revenue Chart */}
          <div className="xl:col-span-3 bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-semibold text-slate-700">Monthly Revenue</p>
                <p className="text-xs text-slate-400">Last 6 months</p>
              </div>
              <TrendingUp size={18} className="text-indigo-400" />
            </div>
            <div className="flex items-end gap-3 h-36">
              {MONTHLY_REVENUE.map((m) => {
                const height = Math.max(8, (m.revenue / maxRevenue) * 100);
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-500 font-medium">${(m.revenue / 1000).toFixed(0)}k</span>
                    <div className="w-full rounded-t-md bg-indigo-500 hover:bg-indigo-600 transition-colors cursor-pointer"
                      style={{ height: `${height}%` }} />
                    <span className="text-xs text-slate-400">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deal Stages */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm font-semibold text-slate-700 mb-4">Deals by Stage</p>
            <div className="space-y-3">
              {Object.entries(
                deals.reduce((acc, d) => {
                  acc[d.stage] = (acc[d.stage] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([stage, count]) => (
                <div key={stage} className="flex items-center gap-3">
                  <span className={clsx("text-xs font-semibold px-2 py-0.5 rounded-full capitalize w-24 text-center", STAGE_COLORS[stage])}>
                    {stage}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{ width: `${(count / deals.length) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 w-4 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity + Tasks */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Activity Feed */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-slate-700">Recent Activity</p>
              <Link href="/activity" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">View all →</Link>
            </div>
            <div className="space-y-3">
              {activities.slice(0, 5).map((a) => {
                const icon = ACTIVITY_ICONS[a.type] || ACTIVITY_ICONS.note;
                return (
                  <div key={a.id} className="flex items-start gap-3">
                    <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0", icon.bg, icon.text)}>
                      {icon.symbol}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{a.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{timeAgo(a.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-slate-700">Open Tasks</p>
              <Link href="/tasks" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">View all →</Link>
            </div>
            <div className="space-y-2">
              {tasks.filter((t) => t.status !== "done").slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                  <Clock size={14} className={clsx(
                    t.priority === "high" ? "text-red-500" :
                    t.priority === "medium" ? "text-amber-500" : "text-slate-400"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{t.title}</p>
                    {t.contactName && <p className="text-xs text-slate-400">{t.contactName}</p>}
                  </div>
                  <span className={clsx("text-xs font-semibold px-2 py-0.5 rounded-full",
                    t.priority === "high" ? "bg-red-100 text-red-600" :
                    t.priority === "medium" ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"
                  )}>
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
