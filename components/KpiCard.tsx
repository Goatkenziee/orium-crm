import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBg?: string;
  trend?: { value: string; positive: boolean };
  sub?: string;
}

export default function KpiCard({ label, value, icon: Icon, iconBg = "bg-blue-100", trend, sub }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 font-medium ${trend.positive ? "text-emerald-600" : "text-red-500"}`}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}
