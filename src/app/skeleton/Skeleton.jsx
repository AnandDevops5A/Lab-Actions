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
  
  export { SkeletonCard, SkeletonChart, SkeletonTable };