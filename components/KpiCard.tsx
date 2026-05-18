interface Props {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export default function KpiCard({ title, value, sub, icon, trend, trendUp, color = "bg-blue-50 text-blue-600" }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
      {trend && (
        <div className={`text-xs mt-1.5 font-medium ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
          {trendUp ? "↑" : "↓"} {trend}
        </div>
      )}
    </div>
  );
}
