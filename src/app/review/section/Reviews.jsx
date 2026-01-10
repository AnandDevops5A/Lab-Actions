import React from 'react'
import { StarRating } from '../StartRating'
// import { TournamentBadge } from './TournamentBadge'



const Reviews = ({ filtered,TournamentBadge,isDarkMode}) => {
  return (
     <section id="reviews" className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 ${isDarkMode ? "bg-black/40" : "bg-blue-200/50"} `}>
        <div className="flex items-center justify-between mb-4 ">
          <h3 className="text-xl font-semibold">Recent reviews</h3>
          <span className="text-xs text-gray-400">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => (
            <article
              key={r.id}
              className={`group relative rounded-xl border border-white/10 bg-linear-to-b  p-5 shadow-[0_0_20px_rgba(34,211,238,0.08)] transition-transform hover:-translate-y-0.5 
                ${isDarkMode ? "from-gray-900/50 to-black/50" : "from-blue-50 to-gray-100"} `}
            >
              <div className= "absolute inset-px rounded-xl ring-1 ring-white/10 pointer-events-none" />
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold">{r.name}</h4>
                  <div className="mt-1 flex items-center gap-2">
                    <StarRating value={r.rating} readOnly size="sm" />
                    <TournamentBadge id={r.tournamentId} />
                  </div>
                </div>
                <time
                  className="text-xs text-gray-400"
                  dateTime={r.createdAt}
                  title={new Date(r.createdAt).toLocaleString()}
                >
                  {new Intl.DateTimeFormat(undefined, {
                    month: 'short',
                    day: '2-digit',
                  }).format(new Date(r.createdAt))}
                </time>
              </div>

              <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                {r.comment}
              </p>

              {r.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {r.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-md border border-red-500/40 bg-red-500/10 px-2 py-1 text-[11px] text-red-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 flex items-center justify-between">
                <button className={`inline-flex items-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-300 hover:bg-cyan-500/20 transition-colors`}>
                  ❤️ Helpful
                </button>
                <button className="text-xs text-gray-400 hover:text-red-400 transition-colors p-1 rounded">
                  Report
                </button>
              </div>

              {/* Glow border on hover */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl bg-linear-to-r from-red-500/15 via-cyan-500/15 to-red-500/15 pointer-events-none" />
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl border border-white/10 bg-black/40 p-8 text-center">
              <p className="text-gray-300">
                No reviews match your filters yet. Be the first to light it up.
              </p>
            </div>
          )}
        </div>
      </section>
  )
}

export default Reviews
