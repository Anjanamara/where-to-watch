import { Movie } from "../types/movie";
import pLimit from "p-limit";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const REVALIDATE_TIME = 900; // 15 minutes

export type StreamingMovie = Movie & {
  providers: any[];
};

export async function getTrendingMovies(): Promise<Movie[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&region=IN&sort_by=popularity.desc`,
    { next: { revalidate: REVALIDATE_TIME } }
  );

  const data = await res.json();

  return data.results;
}

export async function getMovieDetails(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
    { cache: "no-store" }
  );

  return res.json();
}

export async function getWatchProviders(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`,
    { next: { revalidate: REVALIDATE_TIME } }
  );

  const data = await res.json();
  const indiaData = data.results?.IN;

  return {
    providers: indiaData?.flatrate || [],
    link: indiaData?.link || null
  };
}

export async function getLatestStreamingMovies(
  page: number = 1
): Promise<StreamingMovie[]> {

  if (!API_KEY) {
    throw new Error("TMDB API key missing");
  }

  const limit = pLimit(5);
  let collectedMovies: StreamingMovie[] = [];
  let currentPage = page;

  while (collectedMovies.length < 12) {

    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_origin_country=IN&sort_by=release_date.desc&page=${currentPage}`,
      { next: { revalidate: REVALIDATE_TIME } }
    );

    const data = await res.json();
    const movies: Movie[] = data.results;

    const providerRequests = movies.map(movie =>
      limit(() =>
        fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${API_KEY}`
        ).then(r => r.json())
      )
    );

    const providerResults = await Promise.all(providerRequests);

    movies.forEach((movie, index) => {
      const providers = providerResults[index]?.results?.IN?.flatrate;

      if (providers) {
        collectedMovies.push({
          ...movie,
          providers
        });
      }
    });

    currentPage++;

    if (!data.results.length) break;
  }

  return collectedMovies;
}