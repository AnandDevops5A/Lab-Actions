"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "../../lib/contexts/theme-context";
import dynamic from "next/dynamic";
import { getCache, setCache } from "@/lib/utils/client-cache";
import {  errorMessage} from "@/lib/utils/alert";
import { UserContext } from "@/lib/contexts/user-context";
import { SkeletonCard } from "../skeleton/Skeleton";
import { getAllReviews, getAllTournaments } from "@/lib/api/backend-api";

const AddReview = dynamic(() => import("./section/AddReview"), {
  loading: () => <SkeletonCard />,
  ssr: false,
});

const Reviews = dynamic(() => import("./section/Reviews"), {
  loading: () => (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 my-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  ),
  ssr: false,
});

const ReviewHero = dynamic(() => import("./section/ReviewHero"), {
  loading: () => <div className="h-[348px] w-full animate-pulse rounded-2xl bg-gray-800/50" />,
  ssr: false,
});

export default function ReviewsPage() {
  const themeContext = useContext(ThemeContext);
  const { isDarkMode } = themeContext || { isDarkMode: true };
  const { user } = useContext(UserContext);
  const [tournaments, setTournaments] = useState([]);
  const [reviews, setReviews] = useState([]);

  async function loadTournaments() {
    try {
      const cacheResult = await getCache("AllTournament");
      if (cacheResult?.status) {
        setTournaments(Array.from(cacheResult.data));
        return;
      }
      
      const dbResult = await getAllTournaments();
      if (!dbResult?.ok) {
        return errorMessage("Server Error");
      }
      let data = Array.from(dbResult.data);
      setTournaments(data);
      await setCache("AllTournament", data);
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
        return errorMessage("Internal Server Error");
      }

      setReviews(dbResult.data);
      await setCache("reviews", dbResult.data);
      return;
    } catch (err) {
      return errorMessage("Unexpected Error");
    }
  }

  

  const [filters, setFilters] = useState({
    tournamentId: "all",
    sort: "newest",
    minRating: 0,
    search: "",
  });

  const filtered = useMemo(() => {
    let data = [...reviews];
    if (filters.tournamentId !== "all") {
      data = data.filter((r) => r.tournamentId == filters.tournamentId);
    }
    if (filters.minRating > 0) {
      data = data.filter((r) => r.rating >= filters.minRating);
    }
    if (filters.search.trim().length) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (r) =>
          (r.reviewerName || "").toLowerCase().includes(q) ||
          (r.comment || "").toLowerCase().includes(q) ||
          (r.tags || []).join(" ").toLowerCase().includes(q),
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

  // For efficient lookups, create a map of tournament IDs to names.
  // This is much faster than using .find() inside a loop.
  const tournamentMap = useMemo(() => 
    new Map(tournaments.map(t => [t.id, t.tournamentName])),
    [tournaments]
  );

  useEffect(() => {
    // Fetch tournaments and reviews concurrently for better performance.
    const loadData = async () => {
      await Promise.all([loadTournaments(), loadReviews()]);
    };
    loadData();
  }, []); // Empty dependency array ensures this runs only once on mount.
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
        tournamentMap={tournamentMap}
        isDarkMode={isDarkMode}
      />

      {/* Submit review */}

      <AddReview
        setReviews={setReviews}
        tournaments={tournaments}
        isDarkMode={isDarkMode}
        inputClasses={inputClasses}
        loadReviews={loadReviews}
      />
    </main>
  );
}
