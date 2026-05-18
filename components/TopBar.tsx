import { Search } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function TopBar({ title, subtitle, action }: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
