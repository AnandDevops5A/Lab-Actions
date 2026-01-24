"use client";
import React, { useState, useContext, useMemo } from "react";
import { ThemeContext } from "../Library/ThemeContext";
import { Trophy } from "lucide-react";
import TournamentList from "./TournamentList";
import ParticipantList from "./ParticipantList";


const CompletedTournamentManager = ({ tournaments, refreshData }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedTournament, setSelectedTournament] = useState(null);

  const now = Date.now();

  // Get tournaments from last 30 days (both upcoming and completed)
  const recentTournaments = useMemo(() => {
    const yesterday = now - 24 * 60 * 60 * 1000;
    // const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const tomorrow = now + 24 * 60 * 60 * 1000;
    // const thirtyDaysFromNow30 * 24 * 60 * 60 * 1000;
    return tournaments
      .filter(t => new Date(t.dateTime).getTime() > yesterday && new Date(t.dateTime).getTime() < tomorrow)
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()); // Most recent first
  }, [tournaments, now]);

  // Separate upcoming and completed tournaments
  const upcomingTournaments = useMemo(() => {
    return recentTournaments.filter(t => new Date(t.dateTime).getTime() > now);
  }, [recentTournaments, now]);

  const completedTournaments = useMemo(() => {
    return recentTournaments.filter(t => new Date(t.dateTime).getTime() < now).slice(0, 1);
  }, [recentTournaments, now]);

  return (
    <div className="font-mono">
      {!selectedTournament ? (
        <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
            <Trophy className="w-8 h-8" />
            Completed Tournament Manager
          </h2>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Tournaments (Upcoming & Recently Completed)
            </h3>
            <TournamentList
              recentTournaments={recentTournaments}
              upcomingTournaments={upcomingTournaments}
              completedTournaments={completedTournaments}
              onSelectTournament={setSelectedTournament}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      ) : (
        <ParticipantList
          selectedTournament={selectedTournament}
          isDarkMode={isDarkMode}
          refreshData={refreshData}
          onBack={() => setSelectedTournament(null)}
        />
      )}
    </div>
  );
};

export default CompletedTournamentManager;