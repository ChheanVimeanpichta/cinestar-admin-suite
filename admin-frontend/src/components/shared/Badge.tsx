interface BadgeProps {
  label: string;
  tone?: "accent" | "neutral" | "success";
}

export default function Badge({ label, tone = "neutral" }: BadgeProps) {
  const tones = {
    accent: "bg-accent/20 text-accent border-accent/40",
    neutral: "bg-white/5 text-onSurfaceVariant border-white/10",
    success: "bg-green-500/10 text-green-400 border-green-500/30",
  };
  return (
    <span className={`font-mono text-label-mono uppercase px-2 py-1 rounded border ${tones[tone]}`}>
      {label}
    </span>
  );
}