interface OccupancyBarProps {
  percent: number;
}

export default function OccupancyBar({ percent }: OccupancyBarProps) {
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-accent/70 to-accent rounded-full transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
