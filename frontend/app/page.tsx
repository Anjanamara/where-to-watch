import { getLatestStreamingMovies } from "../lib/tmdb";
import MovieCard from "../components/MovieCard";

export default async function Home() {
  const movies = await getLatestStreamingMovies();

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-8">WhereToWatch</h1>

      <h2 className="text-2xl mb-6">🎬 New Movies Streaming Now</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  );
}
