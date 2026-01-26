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
  const recentTournaments = useMemo(() => {
    if (!tournaments) return [];
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    return tournaments
      .filter(t => parseTournamentDate(t.dateTime) > thirtyDaysAgo)
      .sort((a, b) => b.dateTime - a.dateTime); // Most recent first
  }, [tournaments, now]);

  // Separate upcoming and completed tournaments
  const upcomingTournaments = useMemo(() => {
    return recentTournaments.filter(t => parseTournamentDate(t.dateTime) > now);
  }, [recentTournaments, now]);

  const completedTournaments = useMemo(() => {
    return recentTournaments.filter(t => parseTournamentDate(t.dateTime) < now).slice(0, 1);
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