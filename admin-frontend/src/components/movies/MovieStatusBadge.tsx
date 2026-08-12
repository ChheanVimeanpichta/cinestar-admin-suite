interface MovieStatusBadgeProps {
  badge?: string;
}

const badgeStyles: Record<string, string> = {
  IMAX: "bg-blue-600/20 text-blue-400 ring-blue-600/30",
  "4DX": "bg-purple-600/20 text-purple-400 ring-purple-600/30",
  CineStar: "bg-amber-600/20 text-amber-400 ring-amber-600/30",
  DOLBY: "bg-cyan-600/20 text-cyan-400 ring-cyan-600/30",
  "2D": "bg-onSurfaceVariant/20 text-onSurfaceVariant ring-onSurfaceVariant/30",
};

export default function MovieStatusBadge({ badge }: MovieStatusBadgeProps) {
  if (!badge) return <span className="text-onSurfaceVariant">{"\u2014"}</span>;

  const style = badgeStyles[badge] ?? "bg-surface-variant text-onSurface";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {badge}
    </span>
  );
}
