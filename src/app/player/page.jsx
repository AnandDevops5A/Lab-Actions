"use client";

import React, { useContext, useState, useEffect, useMemo } from "react";
import Avatar from "../images/avatar.png";
import dynamic from "next/dynamic";
import {
  SkeletonCard,
  SkeletonChart,
  SkeletonTable,
} from "../skeleton/Skeleton";
import { UserContext } from "../Library/ContextAPI";
import { getUserTournamentDetails, useFetchBackendAPI } from "../Library/API";
import { useRouter } from "next/navigation";
import { calulateWinAndReward } from "../Library/common";
import { getCache, setCache } from "../Library/ActionRedis";

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

const PlayerProfile = () => {
  //get user from context
  const { user } = useContext(UserContext);
  const [matchHistory, setMatchHistory] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // console.log(user);
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    let i = true;
    const fetchData = async () => {
      const userTournamentDetails = await getCache(`userTournamentDetails:${user.id}`);
      if (userTournamentDetails.status && userTournamentDetails.data) {
        // console.log("from cache", userTournamentDetails.data);
        // console.log("from cache loaded");
     if(i) setMatchHistory(userTournamentDetails.data);
        return;
      } else {
        const response = await getUserTournamentDetails(user.id);
        console.log("backend hit ");
        const setCacheUserTournamentDetails = await setCache(
          `userTournamentDetails:${user.id}`,
          response.data,
          3600,
        ); // Cache for 1 hour

        // console.log("-------------+api+ --------------");
        // console.log(response.data);
        if (!setCacheUserTournamentDetails.status)
          error("Error caching user tournament details");
        if (response.data) setMatchHistory(response.data);
      }
    };
    if (user) fetchData();

    return () => {
      i = false;
    };
  }, [user]);

  if (!user) return null;

  const userStats = useMemo(() => {
    if (!matchHistory) return { reward: 0, wins: 0 };
    const stats = calulateWinAndReward(matchHistory);
    return stats.get(user.id) || { reward: 0, wins: 0 };
  }, [matchHistory, user.id]);

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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-10">
      {/* 1. Header & Quick Stats (Top Section) */}
      <DynamicPlayerHeader player={player} />

      {/* 2. Main Content Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle Column (Stats) - Takes 2/3 space on large screens */}
        <div className="lg:col-span-2 space-y-8">
          <DynamicPlayerStats player={player} matchHistory={matchHistory} />
        </div>

        {/* Right Column (Match History) - Takes 1/3 space on large screens */}
        <div className="lg:col-span-1">
          {<DynamicAchievement matchHistory={matchHistory} />}
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
