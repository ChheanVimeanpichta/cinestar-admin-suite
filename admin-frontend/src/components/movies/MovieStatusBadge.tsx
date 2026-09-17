interface MovieStatusBadgeProps {
  badge?: string;
}

const badgeStyles: Record<string, string> = {
  IMAX: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  "4DX": "bg-purple-500/15 text-purple-300 border-purple-500/30",
  CineStar: "bg-red-500/15 text-red-300 border-red-500/30",
  DOLBY: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  "2D": "bg-white/10 text-onSurfaceVariant border-white/10",
};

export default function MovieStatusBadge({ badge }: MovieStatusBadgeProps) {
  if (!badge) return <span className="text-onSurfaceVariant font-mono text-xs">—</span>;

  const style = badgeStyles[badge] ?? "bg-white/10 text-onSurfaceVariant border-white/10";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${style}`}
    >
      {badge}
    </span>
  );
}
