import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export default function KpiCard({
  title,
  value,
  change,
  changePositive,
  icon: Icon,
  iconColor,
  iconBg,
}: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
      <div className={clsx("w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0", iconBg)}>
        <Icon size={20} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        {change && (
          <p
            className={clsx(
              "text-xs font-medium mt-1",
              changePositive ? "text-emerald-600" : "text-red-500"
            )}
          >
            {changePositive ? "▲" : "▼"} {change}
          </p>
        )}
      </div>
    </div>
  );
}
