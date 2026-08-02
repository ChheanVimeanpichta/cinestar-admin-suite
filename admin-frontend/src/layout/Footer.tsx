export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-8 py-10 text-onSurfaceVariant text-body-md">
      <div className="flex justify-between flex-wrap gap-6">
        <div>
          <p className="font-heading font-bold text-onSurface">CINESTAR</p>
          <p className="text-sm mt-2">The cinematic experience, redefined.</p>
        </div>
        <div className="text-sm">© {new Date().getFullYear()} CineStar. All rights reserved.</div>
      </div>
    </footer>
  );
}