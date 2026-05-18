"use client";
import { useCRM } from "@/lib/store";
import KpiCard from "@/components/KpiCard";
import TopBar from "@/components/TopBar";
import { Users, DollarSign, CheckSquare, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MONTHLY_REVENUE } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

const STAGE_COLORS: Record<string, string> = {
  prospecting: "bg-slate-400",
  qualification: "bg-blue-400",
  proposal: "bg-yellow-400",
  negotiation: "bg-orange-400",
  closed_won: "bg-green-500",
  closed_lost: "bg-red-400",
};

const STAGE_LABELS: Record<string, string> = {
  prospecting: "Prospecting",
  qualification: "Qualification",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

export default function DashboardPage() {
  const { state } = useCRM();
  const { contacts, deals, tasks, activities } = state;

  const totalRevenue = deals.filter(d => d.stage === "closed_won").reduce((s, d) => s + d.value, 0);
  const pipeline = deals.filter(d => !["closed_won", "closed_lost"].includes(d.stage)).reduce((s, d) => s + d.value, 0);
  const openTasks = tasks.filter(t => t.status !== "done").length;
  const wonDeals = deals.filter(d => d.stage === "closed_won").length;
  const totalDeals = deals.filter(d => d.stage !== "prospecting").length;
  const winRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;

  // Pipeline by stage
  const stages = ["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"];
  const pipelineByStage = stages.map(stage => ({
    stage,
    label: STAGE_LABELS[stage],
    count: deals.filter(d => d.stage === stage).length,
    value: deals.filter(d => d.stage === stage).reduce((s, d) => s + d.value, 0),
  }));

  return (
    <div className="p-6 space-y-6">
      <TopBar title="Dashboard" subtitle="Welcome back, Alexander" />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Revenue" value={formatCurrency(totalRevenue)} sub="Closed won" color="green" icon={<DollarSign className="w-5 h-5" />} />
        <KpiCard label="Pipeline Value" value={formatCurrency(pipeline)} sub="Active deals" color="blue" icon={<TrendingUp className="w-5 h-5" />} />
        <KpiCard label="Contacts" value={contacts.length} sub="Total in CRM" color="purple" icon={<Users className="w-5 h-5" />} />
        <KpiCard label="Open Tasks" value={openTasks} sub={`Win rate ${winRate}%`} color="orange" icon={<CheckSquare className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_REVENUE} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), "Revenue"]} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline by stage */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Pipeline by Stage</h2>
          <div className="space-y-3">
            {pipelineByStage.map(({ stage, label, count, value }) => (
              <div key={stage} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${STAGE_COLORS[stage]}`} />
                  <span className="text-slate-600">{label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-xs">{count} deal{count !== 1 ? "s" : ""}</span>
                  <span className="font-medium text-slate-800 w-20 text-right">{formatCurrency(value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent activities */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activities.slice(0, 6).map(a => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 text-xs font-bold capitalize">
                  {a.type[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{a.title}</p>
                  <p className="text-xs text-slate-400">{a.contactName} · {new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming tasks */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Upcoming Tasks</h2>
          <div className="space-y-3">
            {tasks.filter(t => t.status !== "done").slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full shrink-0 ${t.priority === "high" ? "bg-red-400" : t.priority === "medium" ? "bg-yellow-400" : "bg-slate-300"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{t.title}</p>
                  <p className="text-xs text-slate-400">Due {new Date(t.dueDate).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                  {t.status === "in_progress" ? "In Progress" : "To Do"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
