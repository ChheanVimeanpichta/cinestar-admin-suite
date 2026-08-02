import { useEffect, useState } from "react";
import { Movie } from "../../types";
import { fetchAllMovies } from "../../services/movieApi";
import Card from "../../components/shared/Card";
import Button from "../../components/shared/Button";
import SectionHeader from "../../components/shared/SectionHeader";

export default function MovieManagement() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchAllMovies().then(setMovies);
  }, []);

  return (
    <div>
      <SectionHeader
        title="Movie Management"
        subtitle="Manage the movie archive"
        action={<Button>+ Add Movie</Button>}
      />
      <div className="grid gap-3">
        {movies.map((m) => (
          <Card key={m.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={m.posterUrl} className="w-12 h-16 object-cover rounded" alt={m.title} />
              <div>
                <p className="font-heading text-onSurface">{m.title}</p>
                <p className="text-onSurfaceVariant text-sm">{m.genre.join(", ")}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Edit</Button>
              <Button variant="ghost">Archive</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}