import { getMovieDetails, getWatchProviders } from "../../../lib/tmdb";
import { OTT_LINKS } from "../../../lib/ottLinks";

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movie = await getMovieDetails(id);

  const watchData = await getWatchProviders(id);

  const providers = watchData.providers;

  const watchLink = watchData.link;

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

            <div className="flex gap-4 flex-wrap mt-4">
              {providers.map((provider: any) => {
                console.log(provider.provider_name);
                const link = OTT_LINKS[provider.provider_name];

                return (
                  <a
                    key={provider.provider_id}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                      className="w-6 h-6 rounded"
                    />

                    <span>{provider.provider_name}</span>
                  </a>
                );
              })}
            </div>

            {watchLink && (
              <a
                href={watchLink}
                target="_blank"
                className="inline-block mt-6 bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-semibold"
              >
                ▶ Watch Now
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
