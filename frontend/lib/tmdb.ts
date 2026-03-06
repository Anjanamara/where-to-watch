import { Movie } from "../types/movie";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export async function getTrendingMovies(): Promise<Movie[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&region=IN&sort_by=popularity.desc`,
    { cache: "no-store" },
  );

  const data = await res.json();

  return data.results;
}

export async function getMovieDetails(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
    { cache: "no-store" },
  );

  return res.json();
}

export async function getWatchProviders(id: string) {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`,
    { cache: "no-store" },
  );

  const data = await res.json();

  return data.results?.IN || null;
}

export async function getLatestStreamingMovies(): Promise<Movie[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_origin_country=IN&sort_by=release_date.desc&vote_count.gte=20`,
    { cache: "no-store" },
  );

  const data = await res.json();

  const movies = data.results.slice(0, 20);

  const streamingMovies: Movie[] = [];

  for (const movie of movies) {
    const providerRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${API_KEY}`,
    );

    const providerData = await providerRes.json();

    if (providerData.results?.IN?.flatrate) {
      streamingMovies.push(movie);
    }
  }

  return streamingMovies;
}
