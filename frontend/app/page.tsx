"use client";

import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { getLatestStreamingMovies } from "../lib/tmdb";
import MovieCardSkeleton from "../components/MovieCardSkeleton";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const featuredMovie = movies.length > 0 ? movies[0] : null;
  const loadMovies = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const newMovies = (await getLatestStreamingMovies(page)) || [];

      setMovies((prev) => {
        const all = [...prev, ...newMovies];
        // Remove duplicate movies by id using Map
        return Array.from(new Map(all.map((m) => [m.id, m])).values());
      });
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load movies:", error);
    }

    setLoading(false);
  };

  // Initial load
  useEffect(() => {
    loadMovies();
  }, []);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        loadMovies();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [page]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <h1 className="text-4xl font-bold mb-8">WhereToWatch</h1>
      {featuredMovie && (
        <div className="relative w-full h-[420px] mb-10 rounded-xl overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
            alt={featuredMovie.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent flex items-center">
            <div className="p-10 max-w-xl">
              <h2 className="text-4xl font-bold mb-4">{featuredMovie.title}</h2>

              <p className="text-gray-300 mb-6 line-clamp-3">
                {featuredMovie.overview}
              </p>

              <div className="flex gap-3">
                {featuredMovie.providers?.slice(0, 3).map((p: any) => (
                  <img
                    key={p.provider_id}
                    src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                    className="w-8 h-8 rounded"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <h2 className="text-2xl mb-6">🎬 New Movies Streaming Now</h2>
      {movies.length === 0 && loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-5 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              providers={movie.providers}
            />
          ))}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-5 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      )}
    </main>
  );
}
