"use client";
import React, { useMemo } from "react";
import { StarRating } from "../StartRating";

const ReviewHero = ({
  setFilters,
  reviews,
  tournaments,
  filters,
  isDarkMode,
  inputClasses
}) => {
  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);
  
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8  mt-16 p-4 ">
      <div
        className={` overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br  p-6 sm:p-10 backdrop-blur-md ${
          isDarkMode ? "bg-gray-900/60" : "bg-gray-200/60"
        }`}
      >
        <div className="absolute inset-px rounded-2xl ring-1 ring-white/10 pointer-events-none" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Tournament reviews in neon and noise
            </h2>
            <p className="mt-3 max-w-2xl text-gray-300">
              Real players. Real experiences. Cut through the static with
              community-powered insights on brackets, production, logistics, and
              more.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-3 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2">
                <StarRating value={Math.round(avgRating)} readOnly size="sm" />
                <div className="text-sm">
                  <span className="font-semibold text-cyan-300">
                    {avgRating}
                  </span>
                  <span className="text-gray-400"> avg rating</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
                <span className="text-sm">
                  <span className="font-semibold text-green-300">
                    {reviews.length}
                  </span>{" "}
                  <span className="text-gray-400">reviews</span>
                </span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className={`rounded-xl border border-white/10 ${isDarkMode ? "bg-black/30 shadow-purple-500 shadow-sm" : "bg-gray-200/50 shadow-slate-600 shadow-inner inset-2 "} p-4`}>
            <h3 className="text-lg font-semibold mb-3">Filter & sort</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400">Tournament</label>
                <select
                  className={`${inputClasses}`}
                  value={filters.tournamentName}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, tournamentName: e.target.value }))
                  }
                >
                  <option value="all">All tournaments</option>
                  {tournaments.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.tournamentName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400">Minimum rating</label>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={1}
                  value={filters.minRating}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      minRating: Number(e.target.value),
                    }))
                  }
                  className="mt-1 w-full accent-blue-500"
                />
                <div className="mt-1 text-xs text-gray-400">
                  {filters.minRating}+
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400">Sort by</label>
                <select
                  className={`${inputClasses}`}
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, sort: e.target.value }))
                  }
                >
                  <option value="newest">Newest first</option>
                  <option value="highest">Highest rated</option>
                  <option value="lowest">Lowest rated</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400">Search</label>
                <input
                  type="text"
                  placeholder="Type to filter reviews..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, search: e.target.value }))
                  }
                  className={`${inputClasses}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewHero;



