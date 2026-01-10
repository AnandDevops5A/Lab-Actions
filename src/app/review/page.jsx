'use client';

import { useContext, useMemo, useState } from 'react';
import ReviewHero from './section/ReviewHero';
import Reviews from './section/Reviews';
import AddReview from './section/AddReview';
import { ThemeContext } from '../Library/ThemeContext';

export default function ReviewsPage() {

const themeContext = useContext(ThemeContext);
  const { isDarkMode } = themeContext || { isDarkMode: true };

  // Dummy tournaments and seed reviews
  const tournaments = [
    { id: 'neo-city-cup', name: 'Neo City Cup' },
    { id: 'quantum-league', name: 'Quantum League' },
    { id: 'venom-circuit', name: 'Venom Circuit' },
    { id: 'aurora-series', name: 'Aurora Series' },
    { id: 'arihant-open', name: 'Arihant Open' },
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
    {
      id: 'r4',
      name: 'Abhay',
      tournamentId: 'Arihant Open',
      rating: 2,
      comment:
        'Great plateform but low reward. Could use better reward for winner next time.',
      tags: ['Ranking', 'Crowd','rewards'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
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
      <div className="flex items-center gap-1 " aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            onClick={() => !readOnly && onChange?.(n)}
            className={`transition-transform ${readOnly ? 'cursor-default' : 'hover:scale-110'}`}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <svg
              className={`${sizes[size]} ${
                n <= value
                  ? 'fill-red-500 drop-shadow-[0_0_6px_rgba(217,70,239,0.8)]'
                  : 'fill-transparent'
              } stroke-red-400`}
              viewBox="0 0 24 24"
            >
              <path
                d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 4.27 1.402-8.168L.132 9.211l8.2-1.193L12 .587z"
                strokeWidth="1"
              />
            </svg>
          </div>
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
    <main className="min-h-screen bg-black text-gray-100  overflow-hidden">
      

      {/* Hero */}
     <ReviewHero setFilters={setFilters} reviews={reviews} tournaments={tournaments} filters={filters} isDarkMode={isDarkMode}/>

      {/* Reviews list */}
     <Reviews filtered={filtered} TournamentBadge={TournamentBadge} isDarkMode={isDarkMode}/>

      {/* Submit review */}
      <AddReview form={form} setForm={setForm} tournaments={tournaments} submitReview={submitReview} StarRating={StarRating} isDarkMode={isDarkMode}/>

     
    </main>
  );
}
