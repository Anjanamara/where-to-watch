"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MovieCard from "../components/MovieCard";
import { getLatestStreamingMovies } from "../lib/tmdb";
import MovieCardSkeleton from "../components/MovieCardSkeleton";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const featuredMovie = movies.length > 0 ? movies[0] : null;
  const [platform, setPlatform] = useState("All");
  const platforms = [
    { name: "All", logo: null },
    { name: "Netflix", logo: "/ott/netflix.png" },
    { name: "Prime", logo: "/ott/prime.jpg" },
    { name: "JioHotstar", logo: "/ott/jiohotstar.jpg" },
    { name: "SonyLIV", logo: "/ott/sonyliv.jpg" },
    { name: "aha", logo: "/ott/aha.png" },
    { name: "Zee5", logo: "/ott/zee5.jpg" },
    { name: "SunNXT", logo: "/ott/sunnxt.jpg" },
  ];
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
  const filteredMovies =
    platform === "All"
      ? movies.slice(1)
      : movies
          .slice(1)
          .filter((movie: any) =>
            movie.providers?.some((p: any) =>
              p.provider_name
                .toLowerCase()
                .replace(/\s/g, "")
                .includes(platform.toLowerCase().replace(/\s/g, "")),
            ),
          );

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
      {featuredMovie && (
        <Link href={`/movie/${featuredMovie.id}`}>
          <div className="relative w-full mb-16 rounded-xl overflow-hidden cursor-pointer">
            {/* backdrop */}
            <img
              src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
              alt={featuredMovie.title}
              className="w-full h-[420px] object-cover"
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/50" />

            {/* content */}
            <div className="absolute inset-0 flex items-center justify-between px-12">
              {/* left: poster + info */}
              <div className="flex items-center gap-8 max-w-xl">
                <img
                  src={`https://image.tmdb.org/t/p/w300${featuredMovie.poster_path}`}
                  className="hidden md:block w-44 rounded-lg shadow-xl"
                />

                <div>
                  <h2 className="text-4xl font-bold mb-4">
                    {featuredMovie.title}
                  </h2>

                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {featuredMovie.overview}
                  </p>
                </div>
              </div>

              {/* right: streaming platforms */}
              <div className="hidden md:flex flex-col items-end text-right">
                <h3 className="text-4xl font-bold mb-6">Streaming On</h3>

                <div className="flex gap-4 justify-center w-full">
                  {featuredMovie.providers?.slice(0, 3).map((p: any) => (
                    <img
                      key={p.provider_id}
                      src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                      className="h-14 rounded-md shadow-md hover:scale-110 transition-transform"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          🎬 New Movies Streaming Now
        </h2>

        <div className="flex gap-3 items-center">
          {platforms.map((p) => (
            <button
              key={p.name}
              onClick={() => setPlatform(p.name)}
              className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all
        ${
          platform === p.name
            ? "bg-gray-800 scale-110"
            : "hover:bg-gray-800/60 hover:scale-110"
        }`}
            >
              {p.logo ? (
                <img src={p.logo} className="max-h-8 object-contain" />
              ) : (
                <span className="text-sm">All</span>
              )}
            </button>
          ))}
        </div>
      </div>
      {movies.length === 0 && loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-5 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-5 gap-6">
          {filteredMovies.map((movie: any) => (
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
