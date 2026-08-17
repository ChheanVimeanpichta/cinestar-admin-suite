import { Clapperboard } from "lucide-react";
import { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="h-screen overflow-hidden bg-surface text-onSurface font-body flex">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 bg-gradient-to-br from-[#0b0f16] via-surface to-black border-r border-white/10">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded bg-accent flex items-center justify-center">
            <Clapperboard size={20} className="text-onSurface" />
          </span>
          <span className="font-heading font-black text-xl uppercase tracking-widest">
            Cinestar
          </span>
        </div>

        <div>
          <h1 className="font-heading font-black uppercase text-4xl leading-tight">
            Cinematic
            <br />
            Admin Suite
          </h1>
          <p className="text-onSurfaceVariant text-body-md mt-4 max-w-sm">
            Monitor revenue, bookings, showtimes, and venues across every theater in real time.
          </p>
        </div>

        <p className="text-onSurfaceVariant text-xs font-mono uppercase tracking-widest">
          Est. 2026 — Multi-venue theater management
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <span className="w-10 h-10 rounded bg-accent flex items-center justify-center">
              <Clapperboard size={20} className="text-onSurface" />
            </span>
            <span className="font-heading font-black text-xl uppercase tracking-widest">
              Cinestar
            </span>
          </div>

          <h2 className="font-heading font-black uppercase text-3xl">{title}</h2>
          <p className="text-onSurfaceVariant text-body-md mt-2 mb-8">{subtitle}</p>

          {children}
        </div>
      </div>
    </div>
  );
}
