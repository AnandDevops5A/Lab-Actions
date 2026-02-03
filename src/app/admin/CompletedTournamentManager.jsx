"use client";
import React, { useState, useContext, useMemo, useEffect, useCallback } from "react";
import { ThemeContext } from "../../lib/contexts/theme-context";
import { Trophy } from "lucide-react";
import dynamic from "next/dynamic";
import { SkeletonTable } from "../skeleton/Skeleton";

const TournamentList = dynamic(() => import('./TournamentList'), {
  loading: () =>( <SkeletonTable/>),
  ssr: false, // optional: disable SSR
});
const ParticipantList = dynamic(() => import('./ParticipantList'), {
  loading: () =>( <SkeletonTable/>),
  ssr: false, // optional: disable SSR
});

const CompletedTournamentManager = ({ tournaments, refreshData, joiners, updateJoiners}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedTournament, setSelectedTournament] = useState(null);
  // const [joiners, setJoiners]=useState([]);

  const parseTournamentDate = (dateTime) => {
    const dateStr = dateTime.toString();
    const year = parseInt(dateStr.slice(0, 4));
    const month = parseInt(dateStr.slice(4, 6)) - 1;
    const day = parseInt(dateStr.slice(6, 8));
    const hour = parseInt(dateStr.slice(8, 10));
    const minute = parseInt(dateStr.slice(10, 12));
    return new Date(year, month, day, hour, minute).getTime();
  };

  // Get tournaments from last 30 days (both upcoming and completed)
  const { recentTournaments, upcomingTournaments, completedTournaments } = useMemo(() => {
    const now = Date.now();
    if (!tournaments) {
      return { recentTournaments: [], upcomingTournaments: [], completedTournaments: [] };
    }
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const recent = tournaments
      .filter((t) => parseTournamentDate(t.dateTime) > thirtyDaysAgo)
      .sort((a, b) => b.dateTime - a.dateTime); // Most recent first

    const upcoming = recent.filter(
      (t) => parseTournamentDate(t.dateTime) > now,
    );

    const completed = recent
      .filter((t) => parseTournamentDate(t.dateTime) < now)
      .slice(0, 1);
      
    return { recentTournaments: recent, upcomingTournaments: upcoming, completedTournaments: completed };
  }, [tournaments]);


  return (
    <div className="Rusty Attack ml-15 md:ml-1 ">
      {!selectedTournament ? (
        <div
          className={`p-6 rounded-lg border ${isDarkMode ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <h2
            className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDarkMode ? "text-green-400" : "text-green-600"}`}
          >
            <Trophy className="w-8 h-8" />
            Completed Tournament Manager
          </h2>
          <div
            className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800/50" : "bg-gray-50"}`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}
            >
              Recent Tournaments (Upcoming & Recently Completed)
            </h3>
            <TournamentList
              recentTournaments={recentTournaments}
              upcomingTournaments={upcomingTournaments}
              completedTournaments={completedTournaments}
              onSelectTournament={setSelectedTournament}
              isDarkMode={isDarkMode}
              joiners={joiners}
              updateJoiners={updateJoiners} //refresh the joiner
            />
          </div>
        </div>
      ) : (
        <ParticipantList
          selectedTournament={selectedTournament}
          isDarkMode={isDarkMode}
          refreshData={refreshData}
          onBack={() => setSelectedTournament(null)}
          joiners={joiners}
          updateJoiners={updateJoiners} //refresh the joiner
        />
      )}
    </div>
  );
};

export default CompletedTournamentManager;
