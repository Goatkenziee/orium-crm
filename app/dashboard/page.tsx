"use client";

import { useCRM } from "@/lib/store";
import KpiCard from "@/components/KpiCard";
import TopBar from "@/components/TopBar";
import { MONTHLY_REVENUE } from "@/lib/data";
import { formatCurrency, formatRelative, stageBadge } from "@/lib/utils";
import {
  Users, Building2, TrendingUp, CheckSquare,
  DollarSign, Activity
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const PIE_COLORS = ["#94a3b8", "#3b82f6", "#f59e0b", "#f97316", "#10b981", "#ef4444"];

export default function DashboardPage() {
  const { state } = useCRM();
  const { contacts, companies, deals, tasks, activities } = state;

  // KPIs
  const totalRevenue = deals.filter(d => d.stage === "won").reduce((s, d) => s + d.value, 0);
  const pipelineValue = deals.filter(d => !["won", "lost"].includes(d.stage)).reduce((s, d) => s + d.value, 0);
  const openTasks = tasks.filter(t => t.status !== "done").length;
  const wonDeals = deals.filter(d => d.stage === "won").length;

  // Pipeline by stage for bar chart
  const stageCounts = ["lead", "qualified", "proposal", "negotiation", "won", "lost"].map(stage => ({
    stage: stage.charAt(0).toUpperCase() + stage.slice(1),
    count: deals.filter(d => d.stage === stage).length,
    value: deals.filter(d => d.stage === stage).reduce((s, d) => s + d.value, 0),
  }));

  // Deals by stage for pie
  const pieData = stageCounts.filter(s => s.count > 0);

  const recentDeals = [...deals]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const recentActivities = activities.slice(0, 6);

  return (
    <div className="flex-1 bg-slate-50">
      <TopBar title="Dashboard" subtitle="Welcome back, Alexander 👋" />

      <div className="p-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
            iconBg="bg-emerald-100"
            trend={{ value: "12% this month", positive: true }}
          />
          <KpiCard
            label="Pipeline Value"
            value={formatCurrency(pipelineValue)}
            icon={TrendingUp}
            iconBg="bg-blue-100"
            trend={{ value: `${deals.filter(d => !["won","lost"].includes(d.stage)).length} open deals`, positive: true }}
          />
          <KpiCard
            label="Contacts"
            value={contacts.length}
            icon={Users}
            iconBg="bg-violet-100"
            sub={`${companies.length} companies`}
          />
          <KpiCard
            label="Open Tasks"
            value={openTasks}
            icon={CheckSquare}
            iconBg="bg-amber-100"
            trend={{ value: `${wonDeals} deals won`, positive: true }}
          />
        </div>

        {/* Revenue chart + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Revenue (last 6 months)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MONTHLY_REVENUE}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Deals by Stage</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="count" nameKey="stage" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={8} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline bar + recent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Pipeline Stages</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stageCounts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Deals */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Recent Deals</h3>
            <div className="space-y-3">
              {recentDeals.map(d => {
                const badge = stageBadge(d.stage);
                return (
                  <div key={d.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{d.title}</p>
                      <p className="text-xs text-slate-500 truncate">{d.contactName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <p className="text-xs font-semibold text-slate-900">{formatCurrency(d.value)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}>{badge.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivities.map(a => (
                <div key={a.id} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{a.title}</p>
                    <p className="text-xs text-slate-400">{formatRelative(a.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
