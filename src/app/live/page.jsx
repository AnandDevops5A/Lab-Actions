"use client";
import React, { useContext, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { SkeletonCard } from "../skeleton/Skeleton";
import { ThemeContext } from "../../lib/contexts/theme-context";
import { Tv } from "lucide-react";

const LiveTournament = dynamic(() => import("@/components/live/LiveTournament"), {
  ssr: false,
  loading: () => <SkeletonCard />,
});

function LiveStreamContent() {
  const search = useSearchParams();
  const q = search.get("q") || "game tournament";
  const tournamentId = search.get("tournamentId") || null;

  return <LiveTournament query={q} tournamentId={tournamentId} showChat={true} />;
}

export default function LivePage() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <main
      className={`min-h-screen py-10 px-4 pt-24 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-slate-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center gap-3 border-b pb-4 border-gray-700/50">
          <div className={`p-3 rounded-xl ${isDarkMode ? "bg-red-500/10" : "bg-red-100"}`}>
            <Tv className={`w-8 h-8 ${isDarkMode ? "text-red-500" : "text-red-600"}`} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-wider">
              Live <span className="text-red-500">Stream</span>
            </h1>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Watch ongoing tournaments and events in real-time
            </p>
          </div>
        </div>

        {/* Live Content */}
        <Suspense fallback={<SkeletonCard />}>
          <LiveStreamContent />
        </Suspense>
      </div>
    </main>
  );
}
