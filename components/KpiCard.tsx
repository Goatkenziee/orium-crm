import { ReactNode } from "react";
import clsx from "clsx";

export default function KpiCard({ label, value, sub, color = "blue", icon }: {
  label: string;
  value: string | number;
  sub?: string;
  color?: "blue" | "green" | "purple" | "orange";
  icon?: ReactNode;
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
      {icon && (
        <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", colors[color])}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
