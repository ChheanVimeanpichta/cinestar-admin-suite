import { Plus } from "lucide-react";

interface NewMovieEntryCardProps {
  onClick?: () => void;
}

export default function NewMovieEntryCard({ onClick }: NewMovieEntryCardProps) {
  return (
    <div className="flex flex-col rounded overflow-hidden aspect-[2/3] border border-dashed border-white/15">
      <button
        onClick={onClick}
        className="flex-1 flex flex-col items-center justify-center gap-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
      >
        <span className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-onSurface">
          <Plus size={20} />
        </span>
        <div className="text-center">
          <p className="font-heading font-bold text-onSurface text-sm uppercase tracking-wide">
            New Entry
          </p>
          <p className="text-onSurfaceVariant text-xs mt-1">Upload assets &amp; metadata</p>
        </div>
      </button>
    </div>
  );
}
