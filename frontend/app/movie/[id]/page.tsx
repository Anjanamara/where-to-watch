import { getMovieDetails, getWatchProviders } from "../../../lib/tmdb";

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movie = await getMovieDetails(id);

  const providers = await getWatchProviders(id);

  if (!movie) {
    return <div className="text-white p-10">Movie not found</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="flex flex-col md:flex-row gap-10">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-lg w-72"
        />

        <div>
          <h1 className="text-4xl font-bold">{movie.title}</h1>

          <p className="mt-4 text-gray-400 max-w-xl">{movie.overview}</p>

          <p className="mt-4">⭐ Rating: {movie.vote_average}</p>

          <p>📅 Release: {movie.release_date}</p>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Available in India on
            </h2>

            {providers?.flatrate ? (
              <div className="flex gap-4 flex-wrap">
                {providers.flatrate.map((provider: any) => (
                  <div
                    key={provider.provider_id}
                    className="bg-gray-900 px-4 py-2 rounded"
                  >
                    {provider.provider_name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                Not currently streaming on major OTT platforms in India
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
