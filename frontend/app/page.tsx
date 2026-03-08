"use client";

import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { getLatestStreamingMovies } from "../lib/tmdb";
import MovieCardSkeleton from "../components/MovieCardSkeleton";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

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
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-8">WhereToWatch</h1>

      <h2 className="text-2xl mb-6">🎬 New Movies Streaming Now</h2>
      {movies.length === 0 && loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      )}
    </main>
  );
}
