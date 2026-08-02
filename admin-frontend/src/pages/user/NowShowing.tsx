import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Movie } from "../../types";
import { fetchNowShowing } from "../../services/movieApi";
import Badge from "../../components/shared/Badge";
import Button from "../../components/shared/Button";
import SectionHeader from "../../components/shared/SectionHeader";

export default function NowShowing() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const featured = movies[0];

  useEffect(() => {
    fetchNowShowing().then(setMovies);
  }, []);

  return (
    <div>
      {/* Hero section for marquee title */}
      {featured && (
        <section
          className="relative h-[70vh] flex items-end p-12 bg-cover bg-center"
          style={{ backgroundImage: `url(${featured.bannerUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
          <div className="relative z-10 max-w-2xl">
            <Badge label={featured.rating} tone="accent" />
            <h1 className="text-display-lg font-heading text-onSurface mt-4">{featured.title}</h1>
            <p className="text-body-lg text-onSurfaceVariant mt-4">{featured.synopsis}</p>
            <Link to={`/movies/${featured.id}`}>
              <Button className="mt-6">Book Now</Button>
            </Link>
          </div>
        </section>
      )}

      {/* Catalog grid */}
      <section className="px-12 py-12">
        <SectionHeader title="Now Showing" subtitle="Catch the latest releases in theaters" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="group rounded overflow-hidden bg-surface-variant hover:scale-[1.02] transition-transform"
            >
              <img src={movie.posterUrl} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
              <div className="p-4">
                <h3 className="font-heading font-semibold text-onSurface group-hover:text-accent transition-colors">
                  {movie.title}
                </h3>
                <p className="text-onSurfaceVariant text-sm mt-1">{movie.genre.join(", ")}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}