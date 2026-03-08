export default function MovieCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-800 rounded-lg h-75 w-full"></div>
      <div className="h-4 bg-gray-800 rounded mt-3 w-3/4"></div>
      <div className="h-3 bg-gray-800 rounded mt-2 w-1/2"></div>
    </div>
  );
}
