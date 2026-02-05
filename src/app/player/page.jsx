"use client";

import React, { useContext, useState, useEffect, useMemo } from "react";
import Avatar from "../images/avatar.png";
import dynamic from "next/dynamic";
import {
  SkeletonCard,
  SkeletonChart,
  SkeletonTable,
} from "../skeleton/Skeleton";
import { UserContext } from "../../lib/contexts/user-context";
import {
  getUserTournamentDetails,
  FetchBackendAPI,
} from "../../lib/api/backend-api";
import { useRouter } from "next/navigation";
import { calulateWinAndReward } from "../../lib/utils/common";
import { getCache, setCache } from "../../lib/utils/action-redis";
import { ThemeContext } from "../../lib/contexts/theme-context";

const mockPlayer = {
  ign: "SHADOW_LORD_07",
  bgmiId: "1234567890",
  teamName: "Inferno Squad",
  avatarUrl: Avatar.src, // Placeholder URL
  totalWin: 32,
  winRatio: 4.87,
  matchesPlayed: 37,
  avgRank: 6,
  clanRank: 4,
};

const DynamicAchievement = dynamic(() => import("./Achievement.jsx"), {
  loading: () => <SkeletonCard />,
  ssr: false,
});

const DynamicPlayerStats = dynamic(() => import("./PlayerStats.jsx"), {
  loading: () => <SkeletonChart />,
  ssr: false,
});

const DynamicPlayerHeader = dynamic(() => import("./ProfileHeader.jsx"), {
  loading: () => <SkeletonTable />,
  ssr: false,
});

const DynamicUpcomingTournaments = dynamic(
  () => import("./UpcomingTournaments.jsx"),
  {
    loading: () => <SkeletonCard />,
    ssr: false,
  },
);

const PlayerProfile = () => {
  //get user from context
  const { user } = useContext(UserContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [matchHistory, setMatchHistory] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // console.log(user);
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  //Load data to player section to db
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const userTournamentDetails = await getCache(
          `userTournamentDetails:${user.id}`,
        );
        if (userTournamentDetails?.status && userTournamentDetails?.data) {
          if (isMounted) setMatchHistory(userTournamentDetails.data);
          return;
        }

        // Fallback to API
        const response = await getUserTournamentDetails(user.id);
        if (response?.data) {
          if (isMounted) setMatchHistory(response.data);
          // Cache asynchronously to not block UI
          setCache(
            `userTournamentDetails:${user.id}`,
            response.data,
            3600,
          ).catch((e) => console.warn("Cache update failed", e));
        }
      } catch (err) {
        console.error("Failed to fetch tournament details", err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Filter match history to only show completed matches (where rank is assigned)
  const pastMatches = useMemo(() => {
    if (!matchHistory) return null;
    return matchHistory.filter((match) => match.rank);
  }, [matchHistory]);

  // Filter for upcoming tournaments (where rank is not yet assigned)
  const upcomingMatches = useMemo(() => {
    if (!matchHistory) return null;
    return matchHistory.filter((match) => !match.rank);
  }, [matchHistory]);

  // console.log(upcomingMatches);

  const userStats = useMemo(() => {
    if (!pastMatches || !user) return { reward: 0, wins: 0 };
    const stats = calulateWinAndReward(pastMatches);
    return stats.get(user.id) || { reward: 0, wins: 0 };
  }, [pastMatches, user]);

  const player = useMemo(
    () =>
      user
        ? {
            ...user,
            avatarUrl: user.avatarUrl || Avatar.src,
            reward: userStats.reward,
            win: userStats.wins,
            totalWin: userStats.wins,
            totalPlay: user.playedTournaments?.length || 0,
          }
        : mockPlayer,
    [user, userStats],
  );

  if (!user && !matchHistory) return null;

  return (
    <div
      className={`min-h-screen p-4 md:p-10 transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-slate-100" : "bg-gray-50 text-gray-900"}`}
    >
      {/* 1. Header & Quick Stats (Top Section) */}
      <DynamicPlayerHeader player={player} />

      {/* 2. Main Content Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle Column (Stats) - Takes 2/3 space on large screens */}
        <div className="lg:col-span-2 space-y-8">
          {upcomingMatches ? (
            <details>
              <summary className="cursor-pointer text-xl font-bold mb-4 select-none outline-none marker:text-cyan-500 hover:opacity-80 transition-opacity">
                My Upcoming joined Tournaments Details {upcomingMatches.length > 0 && <span className="w-2 h-2 rounded-full animate-ping bg-green-300 inline-block ml-2 mb-1"></span>}
              </summary>
              <DynamicUpcomingTournaments tournaments={upcomingMatches} />
            </details>
          ) : (
            <SkeletonCard />
          )}

          {pastMatches ? (
            <DynamicPlayerStats player={player} matchHistory={pastMatches} />
          ) : (
            <SkeletonChart />
          )}
        </div>

        {/* Right Column (Match History) - Takes 1/3 space on large screens */}
        <div className="lg:col-span-1 space-y-8">
          {pastMatches ? (
            <DynamicAchievement matchHistory={pastMatches} />
          ) : (
            <SkeletonCard />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
