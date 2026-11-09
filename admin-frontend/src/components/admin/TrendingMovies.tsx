export interface TrendingMovie {
  id: string;
  title: string;
  poster: string;
  format: string;
  occupancyPct: number;
  revenue: string;
  changePct: string;
  positive: boolean;
}

interface TrendingMoviesProps {
  movies: TrendingMovie[];
  aiInsight?: string;
}

export default function TrendingMovies({ movies, aiInsight }: TrendingMoviesProps) {
  return (
    <div className="bg-surface-variant rounded p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <p className="font-heading font-semibold text-onSurface">Trending Movies</p>
        <span className="text-accent text-[11px] font-mono uppercase tracking-wider">
          Top Performers
        </span>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {movies.map((m) => (
          <div key={m.id} className="flex items-center gap-3">
            <img
              src={m.poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300"}
              alt={m.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300";
              }}
              className="w-10 h-14 object-cover rounded bg-white/5 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-onSurface text-sm font-body font-medium truncate">
                {m.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-onSurfaceVariant uppercase">
                  {m.format}
                </span>
                <span className="text-onSurfaceVariant text-xs truncate">
                  {m.occupancyPct}% Occupied
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-onSurface text-sm font-body font-semibold">{m.revenue}</p>
              <p className={`text-xs ${m.positive ? "text-green-400" : "text-accent"}`}>
                {m.changePct}
              </p>
            </div>
          </div>
        ))}
      </div>

      {aiInsight && (
        <div className="mt-5 pt-4 border-t border-white/10">
          <p className="text-onSurfaceVariant text-xs italic leading-relaxed">
            🎯 AI Insight: {aiInsight}
          </p>
        </div>
      )}
    </div>
  );
}
