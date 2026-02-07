import React from 'react';
import { Trophy, Calendar, Clock, Users, Sofa } from "lucide-react";
import { formatDateTimeAsText } from '@/lib/utils/common';

const TournamentGrid = ({ tournaments, onSelect, isDarkMode,leaderboardCountRegisterUser }) => {
 

  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} mb-4`} />
        <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>No upcoming tournaments</h3>
        <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Create a new tournament to start managing participants.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${(tournaments.length) % 3} gap-4`}>

      {tournaments.map((tournament) => {
        const { date, time } = formatDateTimeAsText(tournament.dateTime);
        return (
          <div
            key={tournament.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
              isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => onSelect(tournament)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-100 truncate">{tournament.tournamentName}</h4>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                isDarkMode ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-100 text-amber-800 border-amber-200"
              }`}>
                UPCOMING
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-violet-400" />
                <span className="text-violet-300">{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-400">₹ {tournament.prizePool?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400">{leaderboardCountRegisterUser?.[tournament.id] || 0} registered</span>
              </div>
              <div className="flex items-center gap-2">
                <Sofa className="h-4 w-4 text-pink-400" />
                <span className="text-pink-400">{(tournament.slot)-(leaderboardCountRegisterUser?.[tournament.id]) || 0} slot left</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TournamentGrid;



