import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  footer?: ReactNode;
}

export default function StatCard({ label, value, icon, trend, footer }: StatCardProps) {
  return (
    <div className="bg-surface-variant rounded p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <p className="font-mono text-label-mono uppercase text-onSurfaceVariant tracking-wide">
          {label}
        </p>
        <div className="w-9 h-9 rounded bg-white/5 flex items-center justify-center text-onSurfaceVariant">
          {icon}
        </div>
      </div>

      <p className="text-3xl font-heading font-extrabold text-onSurface">{value}</p>

      {trend && (
        <p className={`text-sm font-body ${trend.positive ? "text-green-400" : "text-accent"}`}>
          {trend.positive ? "↗" : "↘"} {trend.value}
        </p>
      )}

      {footer}
    </div>
  );
}
