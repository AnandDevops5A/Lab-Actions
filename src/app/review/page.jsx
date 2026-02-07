"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "../../lib/contexts/theme-context";
import dynamic from "next/dynamic";
import { getCache, setCache } from "@/lib/utils/action-redis";
import {  errorMessage} from "@/lib/utils/alert";
import { UserContext } from "@/lib/contexts/user-context";
import { SkeletonCard, SkeletonTable } from "../skeleton/Skeleton";
import { getAllReviews, getAllTournaments } from "@/lib/api/backend-api";
import { dummyReview } from "@/lib/constants/dummy-data";

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
  loading: () => <SkeletonTable />,
  ssr: false,
});

export default function ReviewsPage() {
  const themeContext = useContext(ThemeContext);
  const { isDarkMode } = themeContext || { isDarkMode: true };
  const { user } = useContext(UserContext);
  const [tournament, setTournament] = useState([]);
 

  const [reviews, setReviews] = useState(dummyReview);

  async function loadTournaments() {
    try {
      const cacheResult = await getCache("AllTournament");
      if (cacheResult?.status) {
        // console.log(cacheResult.data);
        return setTournament(Array.from(cacheResult.data));
      }
      
      const dbResult = await getAllTournaments();
      if (!dbResult?.ok) {
        return errorMessage("Server Error");
      }
      let data = Array.from(dbResult.data);
      // console.log(dbResult.data);
      setTournament(data);
      return await setCache("AllTournament", data);
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

  

  const [filters, setFilters] = useState({
    tournamentName: "all",
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


  function TournamentBadge({ id }) {
    // console.log();;
    const t = tournament.find((x) => x.id == id);
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-300">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        {t?.tournamentName ?? "Unknown"}
      </span>
    );
  }

  useEffect(() => {
    // loadData
    loadTournaments();
    loadReviews();
  }, []);
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
        tournaments={tournament}
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
        setReviews={setReviews}
        tournaments={tournament}
        isDarkMode={isDarkMode}
        inputClasses={inputClasses}
      />
    </main>
  );
}
