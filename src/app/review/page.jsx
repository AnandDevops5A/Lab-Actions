"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "../../lib/contexts/theme-context";
import CyberLoading from "../skeleton/CyberLoading";
import dynamic from "next/dynamic";
import { getCache, setCache, UpdateCache } from "@/lib/utils/action-redis";
import { addNewReview, getAllTournaments } from "@/lib/api/backend-api";
import { askLogin, errorMessage, successMessage } from "@/lib/utils/alert";
import { UserContext } from "@/lib/contexts/user-context";
import { useRouter } from "next/navigation";

const AddReview = dynamic(() => import("./section/AddReview"), {
  loading: () => CyberLoading,
  ssr: false,
});
const Reviews = dynamic(() => import("./section/Reviews"), {
  loading: () => CyberLoading,
  ssr: false,
});
const ReviewHero = dynamic(() => import("./section/ReviewHero"), {
  loading: () => CyberLoading,
  ssr: false,
});

export default function ReviewsPage() {
  const themeContext = useContext(ThemeContext);
  const { isDarkMode } = themeContext || { isDarkMode: true };
  const { user } = useContext(UserContext);
  const [Tournament, setTournament] = useState([]);
  const router = useRouter();

  async function loadTournaments() {
    try {
      const cacheResult = await getCache("AllTournament");
      if (cacheResult?.status) {
        return setTournament(cacheResult.data);
      }

      const dbResult = await getAllTournaments();
      if (!dbResult?.ok) {
        return errorMessage("Server Error");
      }

      setTournament(dbResult.data);
      await setCache("AllTournament", dbResult.data);
    } catch (err) {
      console.error(err);
      return errorMessage("Unexpected Error");
    }
  }

  async function loadReviews() {
    try {
      const cacheResult = await getCache("reviews");
      if (cacheResult?.status) {
        return setReviews(cacheResult.data);
      }

      const dbResult = await getAllReviews();
      if (!dbResult?.ok) {
        return errorMessage("Server Error");
      }

      setReviews(dbResult.data);
      await setCache("reviews", dbResult.data);
      return;
    } catch (err) {
      return errorMessage("Unexpected Error");
    }
  }

  useEffect(() => {
    // loadData
    // loadTournaments();
    // loadReviews();
  }, []);

  // Dummy tournaments and seed reviews
  const tournaments = [
    { id: "neo-city-cup", tournamentName: "Neo City Cup" },
    { id: "quantum-league", tournamentName: "Quantum League" },
    { id: "venom-circuit", tournamentName: "Venom Circuit" },
    { id: "aurora-series", tournamentName: "Aurora Series" },
    { id: "arihant-open", tournamentName: "Arihant Open" },
  ];

  const [reviews, setReviews] = useState([
    {
      reviewId: "r1",
      name: "Rhea",
      tournamentName: "neo-city-cup",
      rating: 5,
      comment:
        "Electrifying atmosphere, spotless logistics, and the finals were pure adrenaline. Neon perfection.",
      tags: ["Logistics", "Finals", "Ambience"],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    },
    {
      reviewId: "r2",
      name: "Ishan",
      tournamentName: "quantum-league",
      rating: 4,
      comment:
        "Production value was insane. Minor delays, but staff handled it smoothly.",
      tags: ["Production", "Staff"],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
      reviewId: "r3",
      name: "Akira",
      tournamentName: "aurora-series",
      rating: 3,
      comment:
        "Great bracket and fair seeding. Could use better crowd control next time.",
      tags: ["Seeding", "Crowd"],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    },
    {
      reviewId: "r4",
      name: "Abhay",
      tournamentName: "Arihant Open",
      rating: 2,
      comment:
        "Great plateform but low reward. Could use better reward for winner next time.",
      tags: ["Ranking", "Crowd", "rewards"],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
  ]);

  const [filters, setFilters] = useState({
    tournamentName: "all",
    sort: "newest",
    minRating: 0,
    search: "",
  });

  const [form, setForm] = useState({
    reviewerName: user?.name,
    tournamentName: tournaments[0].id,
    rating: 5,
    comment: "",
    tags: "",
  });

  const filtered = useMemo(() => {
    let data = [...reviews];
    if (filters.tournamentName !== "all") {
      data = data.filter((r) => r.tournamentName === filters.tournamentName);
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
          r.tags.join(" ").toLowerCase().includes(q),
      );
    }
    if (filters.sort === "newest") {
      data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (filters.sort === "highest") {
      data.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === "lowest") {
      data.sort((a, b) => a.rating - b.rating);
    }
    return data;
  }, [reviews, filters]);

  async function submitReview(e) {
    e.preventDefault();
    if (!user) {
      askLogin(router);
      return;
    }
    if (!form.reviewerName.trim() || !form.comment.trim()) return;
    const tags =
      form.tags
        .split(/[,\.\s]+/) // split on comma, period, or whitespace
        .map((t) => t.trim())
        .filter(Boolean) || [];

    const newReview = {
      reviewId: `r-${Date.now()}`,
      reviewerName: form.reviewerName.trim(),
      tournamentName: form.tournamentName,
      rating: form.rating,
      comment: form.comment.trim(),
      tags,
      createdAt: new Date().toISOString(),
    };

    // console.log(newReview);

    const resp = await addNewReview(newReview);
    if (resp.ok) {
      console.log("response fron db: ", resp.data);
      successMessage("Review added successfully");
    } else errorMessage("Something went wrong");

    setReviews((prev) => [newReview, ...prev]);

    //update review cache
    await UpdateCache("reviews", reviews);

    //clear form
    setForm({
      reviewerName: "",
      tournamentName: tournaments[0].id,
      rating: 5,
      comment: "",
      tags: "",
    });
  }

  function StarRating({
    value,
    onChange,
    size = "md",
    readOnly = false,
    label,
  }) {
    const sizes = {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
    };
    return (
      <div className="flex items-center gap-1 " aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            onClick={() => !readOnly && onChange?.(n)}
            className={`transition-transform ${readOnly ? "cursor-default" : "hover:scale-110"}`}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            <svg
              className={`${sizes[size]} ${
                n <= value
                  ? "fill-red-500 drop-shadow-[0_0_6px_rgba(217,70,239,0.8)]"
                  : "fill-transparent"
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
        {t?.name ?? "Unknown"}
      </span>
    );
  }
  const inputClasses = `mt-1 w-full rounded-lg border border-white/10 ${
    isDarkMode ? "bg-black/60" : "bg-gray-200/50"
  } px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
    isDarkMode ? "focus:ring-cyan-500/60" : "focus:ring-red-500/60"
  }`;

  return (
    <main className="min-h-screen bg-black text-gray-100  overflow-hidden">
      {/* Hero */}

      <ReviewHero
        setFilters={setFilters}
        reviews={reviews}
        tournaments={tournaments}
        filters={filters}
        isDarkMode={isDarkMode}
        inputClasses={inputClasses}
      />

      {/* Reviews list */}

      <Reviews
        filtered={filtered}
        TournamentBadge={TournamentBadge}
        isDarkMode={isDarkMode}
      />

      {/* Submit review */}

      <AddReview
        form={form}
        setForm={setForm}
        tournaments={tournaments}
        submitReview={submitReview}
        StarRating={StarRating}
        isDarkMode={isDarkMode}
        inputClasses={inputClasses}
      />
    </main>
  );
}
