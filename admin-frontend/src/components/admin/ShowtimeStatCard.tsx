import { ReactNode } from "react";

interface ShowtimeStatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  tone?: "default" | "warning";
}

export default function ShowtimeStatCard({ label, value, icon, tone = "default" }: ShowtimeStatCardProps) {
  return (
    <div className="bg-surface-variant rounded p-5 flex items-center justify-between">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant">{label}</p>
        <p className={`text-2xl font-heading font-bold mt-2 ${tone === "warning" ? "text-accent" : "text-onSurface"}`}>
          {value}
        </p>
      </div>
      <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-onSurfaceVariant">
        {icon}
      </div>
    </div>
  );
}
