import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Movie } from "../../types";
import { fetchMovieById } from "../../services/movieApi";
import Badge from "../../components/shared/Badge";
import Button from "../../components/shared/Button";

export default function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (movieId) fetchMovieById(movieId).then(setMovie);
  }, [movieId]);

  if (!movie) return <p className="p-12 text-onSurfaceVariant">Loading...</p>;

  return (
    <div className="px-12 py-12 grid md:grid-cols-3 gap-10">
      <img src={movie.posterUrl} alt={movie.title} className="rounded w-full aspect-[2/3] object-cover" />
      <div className="md:col-span-2">
        <Badge label={movie.rating} tone="accent" />
        <h1 className="text-display-lg font-heading text-onSurface mt-4 leading-tight">{movie.title}</h1>
        <p className="text-onSurfaceVariant font-mono text-label-mono mt-3">
          {movie.durationMins} MIN • {movie.genre.join(" / ")}
        </p>
        <p className="text-body-lg text-onSurfaceVariant mt-6 max-w-xl">{movie.synopsis}</p>
        <Button className="mt-8" onClick={() => navigate(`/movies/${movie.id}/screening`)}>
          Book Now
        </Button>
      </div>
    </div>
  );
}