"use client";

type HeaderProps = {
  platform: string;
  setPlatform: (value: string) => void;
  platforms: { name: string; logo: string | null }[];
};

export default function Header({
  platform,
  setPlatform,
  platforms,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full bg-black z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Site Name */}
        <h1 className="text-xl font-bold tracking-wide">WhereToWatch</h1>

        {/* Platform Logos */}
        <div className="flex gap-4 items-center">
          {platforms.map((p, idx) => (
            <button
              key={`${p.name}-${idx}`}
              onClick={() => setPlatform(p.name)}
              title={p.name}
              className={`w-14 h-14 flex items-center justify-center rounded-lg
              transition-all duration-300
              ${
                platform === p.name
                  ? "bg-gray-800 scale-110"
                  : "hover:bg-gray-800/60 hover:scale-110"
              }`}
            >
              {p.logo ? (
                <img
                  src={
                    p.logo && typeof p.logo === "string" && p.logo.trim() !== ""
                      ? p.logo
                      : "/fallback-logo.png"
                  }
                  alt={p.name}
                  className="max-h-9 object-contain"
                />
              ) : (
                <span className="text-sm">All</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
