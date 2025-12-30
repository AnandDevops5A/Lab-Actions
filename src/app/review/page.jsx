'use client';

import { useMemo, useState } from 'react';

export default function ReviewsPage() {
  // Dummy tournaments and seed reviews
  const tournaments = [
    { id: 'neo-city-cup', name: 'Neo City Cup' },
    { id: 'quantum-league', name: 'Quantum League' },
    { id: 'venom-circuit', name: 'Venom Circuit' },
    { id: 'aurora-series', name: 'Aurora Series' },
  ];

  const [reviews, setReviews] = useState([
    {
      id: 'r1',
      name: 'Rhea',
      tournamentId: 'neo-city-cup',
      rating: 5,
      comment:
        'Electrifying atmosphere, spotless logistics, and the finals were pure adrenaline. Neon perfection.',
      tags: ['Logistics', 'Finals', 'Ambience'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    },
    {
      id: 'r2',
      name: 'Ishan',
      tournamentId: 'quantum-league',
      rating: 4,
      comment:
        'Production value was insane. Minor delays, but staff handled it smoothly.',
      tags: ['Production', 'Staff'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
      id: 'r3',
      name: 'Akira',
      tournamentId: 'aurora-series',
      rating: 3,
      comment:
        'Great bracket and fair seeding. Could use better crowd control next time.',
      tags: ['Seeding', 'Crowd'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    },
  ]);

  const [filters, setFilters] = useState({
    tournamentId: 'all',
    sort: 'newest',
    minRating: 0,
    search: '',
  });

  const [form, setForm] = useState({
    name: '',
    tournamentId: tournaments[0].id,
    rating: 5,
    comment: '',
    tags: '',
  });

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const filtered = useMemo(() => {
    let data = [...reviews];
    if (filters.tournamentId !== 'all') {
      data = data.filter((r) => r.tournamentId === filters.tournamentId);
    }
    if (filters.minRating > 0) {
      data = data.filter((r) => r.rating >= filters.minRating);
    }
    if (filters.search.trim().length) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q) ||
          r.tags.join(' ').toLowerCase().includes(q)
      );
    }
    if (filters.sort === 'newest') {
      data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (filters.sort === 'highest') {
      data.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === 'lowest') {
      data.sort((a, b) => a.rating - b.rating);
    }
    return data;
  }, [reviews, filters]);

  function submitReview(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;
    const tags =
      form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean) || [];
    const newReview = {
      id: `r-${Date.now()}`,
      name: form.name.trim(),
      tournamentId: form.tournamentId,
      rating: form.rating,
      comment: form.comment.trim(),
      tags,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
    setForm({
      name: '',
      tournamentId: tournaments[0].id,
      rating: 5,
      comment: '',
      tags: '',
    });
  }

  function StarRating({ value, onChange, size = 'md', readOnly = false, label }) {
    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    };
    return (
      <div className="flex items-center gap-1" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => !readOnly && onChange?.(n)}
            className={`transition-transform ${readOnly ? 'cursor-default' : 'hover:scale-110'}`}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <svg
              className={`${sizes[size]} ${
                n <= value
                  ? 'fill-fuchsia-500 drop-shadow-[0_0_6px_rgba(217,70,239,0.8)]'
                  : 'fill-transparent'
              } stroke-fuchsia-400`}
              viewBox="0 0 24 24"
            >
              <path
                d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 4.27 1.402-8.168L.132 9.211l8.2-1.193L12 .587z"
                strokeWidth="1"
              />
            </svg>
          </button>
        ))}
      </div>
    );
  }

  function TournamentBadge({ id }) {
    const t = tournaments.find((x) => x.id === id);
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-300">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        {t?.name ?? 'Unknown'}
      </span>
    );
  }

  return (
    <main className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
      {/* Neon grid background */}
      {/* <div className="pointer-events-none absolute inset-0 -">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-black" />
        <svg
          className="absolute inset-0 opacity-[0.12]"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
        >
          <defs>
            <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#22d3ee" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      </div> */}

      

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8  mt-20">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/60 to-black/70 p-6 sm:p-10 backdrop-blur-md">
          <div className="absolute inset-px rounded-2xl ring-1 ring-white/10" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Tournament reviews in neon and noise
              </h2>
              <p className="mt-3 max-w-2xl text-gray-300">
                Real players. Real experiences. Cut through the static with community-powered insights on brackets,
                production, logistics, and more.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center gap-3 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2">
                  <StarRating value={Math.round(avgRating)} readOnly size="sm" />
                  <div className="text-sm">
                    <span className="font-semibold text-cyan-300">{avgRating}</span>
                    <span className="text-gray-400"> avg rating</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/10 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-fuchsia-400 animate-ping" />
                  <span className="text-sm">
                    <span className="font-semibold text-fuchsia-300">{reviews.length}</span>{' '}
                    <span className="text-gray-400">reviews</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <h3 className="text-lg font-semibold mb-3">Filter & sort</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400">Tournament</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                    value={filters.tournamentId}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, tournamentId: e.target.value }))
                    }
                  >
                    <option value="all">All tournaments</option>
                    {tournaments.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
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
                      setFilters((f) => ({ ...f, minRating: Number(e.target.value) }))
                    }
                    className="mt-1 w-full accent-fuchsia-500"
                  />
                  <div className="mt-1 text-xs text-gray-400">
                    {filters.minRating}+
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Sort by</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60"
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
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews list */}
      <section id="reviews" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 ">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Recent reviews</h3>
          <span className="text-xs text-gray-400">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => (
            <article
              key={r.id}
              className="group relative rounded-xl border border-white/10 bg-gradient-to-b from-gray-900/50 to-black/50 p-5 shadow-[0_0_20px_rgba(34,211,238,0.08)] transition-transform hover:-translate-y-0.5"
            >
              <div className="absolute inset-px rounded-xl ring-1 ring-white/10 pointer-events-none" />
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
                      className="inline-flex items-center rounded-md border border-fuchsia-500/40 bg-fuchsia-500/10 px-2 py-1 text-[11px] text-fuchsia-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 flex items-center justify-between">
                <button className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-300 hover:bg-cyan-500/20 transition-colors">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 4v16M4 12h16"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  Upvote
                </button>
                <button className="text-xs text-gray-400 hover:text-fuchsia-400 transition-colors">
                  Report
                </button>
              </div>

              {/* Glow border on hover */}
              <div className="absolute inset-0  rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl bg-gradient-to-r from-fuchsia-500/15 via-cyan-500/15 to-fuchsia-500/15" />
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

      {/* Submit review */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/60 to-gray-900/60 p-6 sm:p-10">
          <div className="absolute inset-px rounded-2xl ring-1 ring-white/10" />
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
                  <span className="inline-block h-1.5 w-1.5 mt-1 rounded-full bg-fuchsia-400" />
                  <span>
                    <strong className="text-fuchsia-300">Tone:</strong> Be constructive. No personal attacks.
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
                    className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60"
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
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60"
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

     
    </main>
  );
}
