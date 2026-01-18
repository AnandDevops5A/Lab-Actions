const SkeletonCard = () => (
    <div className="bg-linear-to-br from-gray-800 to-gray-900 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-700 rounded w-24"></div>
        <div className="h-8 w-8 bg-gray-700 rounded"></div>
      </div>
      <div className="h-8 bg-gray-700 rounded w-32 mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-20"></div>
    </div>
  );

  const SkeletonChart = () => (
    <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg animate-pulse">
      <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
      <div className="h-64 bg-gray-700 rounded"></div>
    </div>
  );

  const SkeletonTable = () => (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg animate-pulse">
      <div className="p-4">
        <div className="h-4 bg-gray-700 rounded mb-4 w-full"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
  const LeaderboardSkeleton = ({ isDarkMode }) => {
  const shimmerColor = isDarkMode ? "bg-gray-800/50" : "bg-gray-200";
  const pulseColor = isDarkMode ? "bg-gray-700/50" : "bg-gray-300";

  return (
    <div className="w-full max-w-7xl mx-auto mt-10">
      {/* Top 3 Skeleton */}
      <div className="flex flex-col md:flex-row justify-center items-end gap-4 mb-16 px-4">
        {[2, 1, 3].map((i) => (
          <div
            key={i}
            className={`relative flex flex-col items-center p-4 rounded-xl ${shimmerColor} animate-pulse
              ${i == 1 ? "h-80 w-full md:w-1/3 order-1 md:order-2 border-t-4 border-yellow-500/50" : "h-64 w-full md:w-1/4 order-2 md:order-1 border-t-4 border-gray-500/50"}
            `}
          >
            <div className={`w-20 h-20 rounded-full ${pulseColor} mb-4`} />
            <div className={`h-6 w-3/4 ${pulseColor} rounded mb-2`} />
            <div className={`h-4 w-1/2 ${pulseColor} rounded`} />
          </div>
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-9">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`h-48 rounded-xl ${shimmerColor} animate-pulse p-4 flex flex-col items-center justify-center gap-3 border border-gray-700/20`}
          >
            <div className={`w-16 h-16 rounded-full ${pulseColor}`} />
            <div className={`h-4 w-2/3 ${pulseColor} rounded`} />
            <div className={`h-3 w-1/2 ${pulseColor} rounded`} />
          </div>
        ))}
      </div>
    </div>
  );
};
  export { SkeletonCard, SkeletonChart, SkeletonTable ,LeaderboardSkeleton};