interface BookingStatCardProps {
  label: string;
  value: string;
  accentBorder?: boolean;
}

export default function BookingStatCard({ label, value, accentBorder = false }: BookingStatCardProps) {
  return (
    <div
      className={`bg-surface-variant rounded p-5 border ${
        accentBorder ? "border-accent/40" : "border-white/5"
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant">{label}</p>
      <p
        className={`font-heading font-bold text-2xl mt-2 ${
          accentBorder ? "text-accent" : "text-onSurface"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
