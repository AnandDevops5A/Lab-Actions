import React from 'react'


const AddReview = ({form,setForm,tournaments,submitReview,StarRating}) => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <div className=" overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-black/60 to-gray-900/60 p-6 sm:p-10">
          <div className="absolute inset-px rounded-2xl ring-1 ring-white/10 pointer-events-none" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold">Drop a review</h3>
              <p className="mt-2 text-gray-300">
                Share your experience to help players decide. Keep it honest, specific, and respectful.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="inline-block h-1.5 w-1.5 mt-1 rounded-full bg-cyan-400" />
                  <span>
                    <strong className="text-cyan-300">Details:</strong> Mention production, schedules, staff, and fairness.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-block h-1.5 w-1.5 mt-1 rounded-full bg-red-400" />
                  <span>
                    <strong className="text-red-300">Tone:</strong> Be constructive. No personal attacks.
                  </span>
                </li>
              </ul>
            </div>

            <form onSubmit={submitReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your display name"
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Tournament</label>
                  <select
                    value={form.tournamentId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, tournamentId: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60"
                  >
                    {tournaments.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Rating</label>
                <div className="mt-1">
                  <StarRating
                    value={form.rating}
                    onChange={(n) => setForm((f) => ({ ...f, rating: n }))}
                    size="lg"
                    label="Select rating"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Comment</label>
                <textarea
                  value={form.comment}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, comment: e.target.value }))
                  }
                  placeholder="What stood out? Be specific."
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tags: e.target.value }))
                  }
                  placeholder="Logistics, Production, Bracket"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/60"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-gray-400">
                  By submitting, you agree to community guidelines.
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Publish review
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
  )
}

export default AddReview
