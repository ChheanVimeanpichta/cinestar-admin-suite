import { GrowthMetricPoint } from "../../types";

export default function GrowthMetricsCard({ data }: { data: GrowthMetricPoint[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-surface-variant rounded p-5">
      <p className="font-heading font-semibold text-onSurface mb-4">Growth Metrics</p>
      <div className="flex items-end justify-between gap-2 h-24">
        {data.map((point, i) => {
          const isLast = i === data.length - 1;
          const heightPct = (point.value / max) * 100;
          return (
            <div key={point.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full h-24 flex items-end">
                <div
                  className={`w-full rounded-t transition-all ${
                    isLast ? "bg-accent" : "bg-accent/25"
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2">
        <span className="font-mono text-[10px] text-onSurfaceVariant uppercase">
          {data[0]?.day}
        </span>
        <span className="font-mono text-[10px] text-onSurfaceVariant uppercase">
          {data[data.length - 1]?.day}
        </span>
      </div>
    </div>
  );
}
