import Link from "next/link";
import { Movie } from "../types/movie";

type Props = {
  movie: Movie;
  providers?: any[];
};

export default function MovieCard({ movie, providers }: Props) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="bg-gray-900 rounded-lg p-3 hover:scale-105 transition cursor-pointer">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded"
        />

        <h3 className="mt-2 text-sm font-semibold">{movie.title}</h3>

        <div className="flex gap-2 mt-2">
          {providers?.slice(0, 3).map((provider) => (
            <img
              key={provider.provider_id}
              src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
              alt={provider.provider_name}
              className="w-6 h-6 rounded"
            />
          ))}
        </div>
      </div>
    </Link>
  );
}
