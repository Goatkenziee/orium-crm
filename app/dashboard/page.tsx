"use client";
import { useCRM } from "@/lib/store";
import TopBar from "@/components/TopBar";
import KpiCard from "@/components/KpiCard";
import { formatCurrency, STAGE_LABELS, STAGE_COLORS } from "@/lib/utils";
import { Users, Building2, TrendingUp, CheckSquare, Activity, DollarSign } from "lucide-react";

export default function DashboardPage() {
  const { contacts, companies, deals, tasks, activities } = useCRM();

  const pipeline = deals.filter(d => d.stage !== "closed_won" && d.stage !== "closed_lost");
  const won = deals.filter(d => d.stage === "closed_won");
  const pipelineValue = pipeline.reduce((s, d) => s + d.value, 0);
  const wonValue = won.reduce((s, d) => s + d.value, 0);
  const openTasks = tasks.filter(t => t.status !== "done").length;

  const stageOrder = ["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"] as const;

  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const upcomingTasks = tasks
    .filter(t => t.status !== "done" && t.dueDate)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div>
      <TopBar title="Dashboard" subtitle={`${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`} />
      <div className="p-6 space-y-6">

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard title="Contacts" value={contacts.length} icon={<Users size={18} />} sub="Total contacts" color="bg-blue-50 text-blue-600" />
          <KpiCard title="Companies" value={companies.length} icon={<Building2 size={18} />} sub="Accounts" color="bg-indigo-50 text-indigo-600" />
          <KpiCard title="Open Deals" value={pipeline.length} icon={<TrendingUp size={18} />} sub={formatCurrency(pipelineValue) + " pipeline"} color="bg-purple-50 text-purple-600" />
          <KpiCard title="Won Revenue" value={formatCurrency(wonValue)} icon={<DollarSign size={18} />} sub={`${won.length} deals closed`} color="bg-emerald-50 text-emerald-600" trend="This quarter" trendUp />
          <KpiCard title="Open Tasks" value={openTasks} icon={<CheckSquare size={18} />} sub={`${tasks.filter(t => t.priority === "high" && t.status !== "done").length} high priority`} color="bg-amber-50 text-amber-600" />
          <KpiCard title="Activities" value={activities.length} icon={<Activity size={18} />} sub="Logged total" color="bg-pink-50 text-pink-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deal pipeline by stage */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Deal Pipeline</h2>
            <div className="space-y-2">
              {stageOrder.map(stage => {
                const stageDeals = deals.filter(d => d.stage === stage);
                const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);
                const pct = pipelineValue > 0 ? Math.round((stageValue / (pipelineValue + wonValue)) * 100) : 0;
                return (
                  <div key={stage} className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium min-w-[90px] text-center ${STAGE_COLORS[stage]}`}>{STAGE_LABELS[stage]}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className={`h-2 rounded-full bg-blue-500 transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 min-w-[60px] text-right">{formatCurrency(stageValue)} ({stageDeals.length})</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent activities */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Recent Activities</h2>
            <div className="space-y-3">
              {recentActivities.length === 0 && <p className="text-sm text-slate-400">No activities yet.</p>}
              {recentActivities.map(a => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    {a.type.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{a.title}</p>
                    <p className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full capitalize shrink-0">{a.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming tasks */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Upcoming Tasks</h2>
          {upcomingTasks.length === 0 && <p className="text-sm text-slate-400">No upcoming tasks.</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingTasks.map(t => {
              const overdue = t.dueDate && new Date(t.dueDate) < new Date();
              return (
                <div key={t.id} className="border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.priority === "high" ? "bg-red-100 text-red-700" : t.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{t.priority}</span>
                    {overdue && <span className="text-xs text-red-500 font-medium">Overdue</span>}
                  </div>
                  <p className="text-sm font-medium text-slate-900">{t.title}</p>
                  {t.dueDate && <p className="text-xs text-slate-400 mt-0.5">Due {t.dueDate}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
