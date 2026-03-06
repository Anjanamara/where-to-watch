import MovieCard from "../../components/MovieCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const query = q || "";

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${query}`,
    { cache: "no-store" },
  );

  const data = await res.json();

  const movies = (data.results || []).filter((movie: any) => movie.poster_path);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h2 className="text-2xl mb-6">Search results for "{query}"</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  );
}
