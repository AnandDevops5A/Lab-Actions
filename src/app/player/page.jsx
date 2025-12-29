"use client";

import React from "react";
import Avatar from "../images/avatar.png";
import dynamic from "next/dynamic";
import { SkeletonCard, SkeletonChart, SkeletonTable } from "../skeleton/Skeleton";

const mockPlayer = {
  ign: "SHADOW_LORD_07",
  bgmiId: "1234567890",
  teamName: "Inferno Squad",
  avatarUrl: Avatar.src, // Placeholder URL
  totalWin: 345,
  winRatio: 4.87,
  matchesPlayed: 71,
  avgRank: 6,
};

const DynamicAchievement = dynamic(() => import("./Achievement.jsx"), {
  loading: () => (
    <SkeletonCard/>
  ),
  ssr: false,
});

const DynamicPlayerStats = dynamic(() => import("./PlayerStats.jsx"), {
  loading: () => (
    <SkeletonChart/>
  ),
  ssr: false,
});

const DynamicPlayerHeader = dynamic(() => import("./ProfileHeader.jsx"), {
  loading: () => (
    <SkeletonTable/>
  ),
  ssr: false,
});

const PlayerProfile = () => {
  const player = mockPlayer;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-10">
      {/* 1. Header & Quick Stats (Top Section) */}
      <DynamicPlayerHeader player={player} />

      {/* 2. Main Content Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle Column (Stats) - Takes 2/3 space on large screens */}
        <div className="lg:col-span-2 space-y-8">
          <DynamicPlayerStats player={player} />
        </div>

        {/* Right Column (Match History) - Takes 1/3 space on large screens */}
        <div className="lg:col-span-1">
          <DynamicAchievement />
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
