import React from 'react';

const SkeletonCard = () => (
    <div className="relative bg-gray-900/90 p-4 md:p-6 rounded-xl border border-[#00E5FF]/30 shadow-[0_0_10px_rgba(0,229,255,0.1)] animate-pulse overflow-hidden">
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-linear-to-bl from-[#00E5FF]/20 to-transparent"></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-[#00E5FF]/20 rounded w-24 shadow-[0_0_5px_rgba(0,229,255,0.2)]"></div>
        <div className="h-8 w-8 bg-[#FF0055]/20 rounded shadow-[0_0_5px_rgba(255,0,85,0.2)]"></div>
      </div>
      <div className="h-8 bg-gray-800 rounded w-32 mb-2 border border-gray-700"></div>
      <div className="h-3 bg-gray-800 rounded w-20"></div>
    </div>
  );

  const SkeletonChart = () => (
    <div className="bg-gray-900/90 p-4 md:p-6 rounded-xl border border-[#FF0055]/30 shadow-[0_0_10px_rgba(255,0,85,0.1)] animate-pulse">
      <div className="h-6 bg-[#FF0055]/20 rounded w-48 mb-4 shadow-[0_0_5px_rgba(255,0,85,0.2)]"></div>
      <div className="h-64 bg-gray-800/50 rounded border border-gray-700 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-[#FF0055]/10 to-transparent"></div>
      </div>
    </div>
  );

  const SkeletonTable = () => (
    <div className="bg-gray-900/90 rounded-xl border border-[#00E5FF]/30 shadow-[0_0_10px_rgba(0,229,255,0.1)] animate-pulse">
      <div className="p-4">
        <div className="h-8 bg-[#00E5FF]/20 rounded mb-6 w-1/3 shadow-[0_0_5px_rgba(0,229,255,0.2)]"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-800/50 rounded border border-gray-700/50 flex items-center px-4">
               <div className="h-3 w-full bg-gray-700/30 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const LeaderboardSkeleton = () => {
  return (
    <div className="w-full max-w-7xl mx-auto mt-10">
      {/* Top 3 Skeleton */}
      <div className="flex flex-col md:flex-row justify-center items-end gap-4 mb-16 px-4">
        {[2, 1, 3].map((i) => (
          <div
            key={i}
            className={`relative flex flex-col items-center p-4 rounded-xl bg-gray-900/80 animate-pulse backdrop-blur-sm
              ${i == 1 
                ? "h-80 w-full md:w-1/3 order-1 md:order-2 border border-[#FFD700]/50 shadow-[0_0_20px_rgba(255,215,0,0.15)]" 
                : "h-64 w-full md:w-1/4 order-2 md:order-1 border border-[#00E5FF]/30 shadow-[0_0_15px_rgba(0,229,255,0.1)]"}
            `}
          >
            <div className={`w-20 h-20 rounded-full mb-4 border-2 ${i === 1 ? "border-[#FFD700]/50 bg-[#FFD700]/10" : "border-[#00E5FF]/50 bg-[#00E5FF]/10"}`} />
            <div className={`h-6 w-3/4 bg-gray-700 rounded mb-2`} />
            <div className={`h-4 w-1/2 bg-gray-800 rounded`} />
          </div>
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-9">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`h-48 rounded-xl bg-gray-900/60 animate-pulse p-4 flex flex-col items-center justify-center gap-3 border border-[#FF0055]/20 shadow-[0_0_10px_rgba(255,0,85,0.05)]`}
          >
            <div className={`w-16 h-16 rounded-full bg-[#FF0055]/10 border border-[#FF0055]/30`} />
            <div className={`h-4 w-2/3 bg-gray-700 rounded`} />
            <div className={`h-3 w-1/2 bg-gray-800 rounded`} />
          </div>
        ))}
      </div>
    </div>
  );
};

  const UpcomingSkeletonCard = () => (
    <div className="w-[320px] md:w-[360px] h-[150px] rounded-2xl border border-[#101821] bg-linear-to-br from-[#020814] via-[#050d18] to-[#050b14] p-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-700"></div>
          <div>
            <div className="h-3 w-20 bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded mt-2"></div>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-700"></div>
      </div>
      <div className="flex items-center justify-between mt-6">
        <div className="h-6 w-24 bg-gray-700 rounded"></div>
        <div className="h-8 w-28 bg-gray-700 rounded-full"></div>
      </div>
    </div>
  );
  export { SkeletonCard, SkeletonChart, SkeletonTable ,LeaderboardSkeleton,UpcomingSkeletonCard};



