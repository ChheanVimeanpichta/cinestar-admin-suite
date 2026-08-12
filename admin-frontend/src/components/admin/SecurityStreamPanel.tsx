import { Radio } from "lucide-react";
import { SecurityStreamEvent } from "../../types";

const toneBorder: Record<string, string> = {
  alert: "border-accent",
  warning: "border-yellow-500",
  neutral: "border-white/10",
};

function renderMessage(event: SecurityStreamEvent) {
  if (!event.highlight) {
    return <span className="text-onSurfaceVariant">{event.message}</span>;
  }
  const parts = event.message.split(event.highlight);
  return (
    <span className="text-onSurfaceVariant">
      {parts[0]}
      <span className="text-onSurface font-medium">{event.highlight}</span>
      {parts[1]}
    </span>
  );
}

export default function SecurityStreamPanel({ events }: { events: SecurityStreamEvent[] }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Radio size={15} className="text-accent" />
        <p className="font-mono text-xs uppercase tracking-wide text-onSurface font-semibold">
          Security Stream
        </p>
      </div>

      <div className="flex flex-col gap-5 flex-1">
        {events.map((event) => (
          <div
            key={event.id}
            className={`border-l-2 pl-3 ${toneBorder[event.tone]}`}
          >
            <p className="font-mono text-[10px] uppercase text-onSurfaceVariant tracking-wide">
              {event.timeAgo}
            </p>
            <p className="text-sm mt-1 leading-snug">{renderMessage(event)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-[10px] uppercase tracking-wide text-onSurfaceVariant">
            Server Load
          </p>
          <span className="font-mono text-[10px] uppercase text-green-400">Optimal</span>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full" style={{ width: "22%" }} />
        </div>
      </div>
    </div>
  );
}
