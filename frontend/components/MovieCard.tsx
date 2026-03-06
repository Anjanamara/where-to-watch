import { Movie } from "../types/movie";

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  return (
    <div className="bg-gray-900 rounded-lg p-3 hover:scale-105 transition cursor-pointer">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="rounded"
      />

      <h3 className="mt-2 text-sm font-semibold">{movie.title}</h3>

      <p className="text-xs text-gray-400">
        ⭐ {movie.vote_average.toFixed(1)}
      </p>
    </div>
  );
}
