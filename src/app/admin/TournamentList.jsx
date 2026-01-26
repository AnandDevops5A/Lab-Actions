import React from "react";
import {
  AlertCircle,
  Calendar,
  Clock,
  Trophy,
  Users,
  CheckCircle
} from "lucide-react";

const TournamentList = ({ recentTournaments, upcomingTournaments, completedTournaments, onSelectTournament, isDarkMode,joiners }) => {
  if (recentTournaments.length === 0) {
    return (
      <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No tournaments in the last 30 days</p>
      </div>
    );
  }

// console.log(upcomingTournaments);
  return (
    <div className="space-y-6">
      {/* Upcoming Tournaments */}
      {upcomingTournaments?.length > 0 && (
        <div>
          <h4 className={`text-md font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            <Clock className="w-5 h-5" />
            Upcoming Tournaments
          </h4>
          <div className="grid gap-4">
            {upcomingTournaments?.map((tournament) => (
              <div
                key={tournament.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-600 hover:border-blue-500'
                    : 'bg-white border-gray-300 hover:border-blue-500'
                }`}
                onClick={() => onSelectTournament && onSelectTournament(tournament)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {tournament.tournamentName}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Calendar className="w-4 h-4" />
                        {new Date(tournament.dateTime).toLocaleDateString()}
                      </span>
                      <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Clock className="w-4 h-4" />
                        {new Date(tournament.dateTime).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      ₹{tournament.prizePool?.toLocaleString()}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Prize Pool
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {(joiners.filter(joiner => joiner.tournamentId==tournament.id))?.length || 0} Registered
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-800'
                  }`}>
                    UPCOMING
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Completed Tournament */}
      {completedTournaments?.length > 0 && (
        <div>
          <h4 className={`text-md font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
            <CheckCircle className="w-5 h-5" />
            Last Completed Tournament
          </h4>
          <div className="grid gap-4">
            {completedTournaments?.map((tournament) => (
              <div
                key={tournament.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-600 hover:border-green-500'
                    : 'bg-white border-gray-300 hover:border-green-500'
                }`}
                onClick={() => onSelectTournament && onSelectTournament(tournament)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {tournament.tournamentName}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Calendar className="w-4 h-4" />
                        {new Date(tournament.dateTime).toLocaleDateString()}
                      </span>
                      <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Clock className="w-4 h-4" />
                        {new Date(tournament.dateTime).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      ₹{tournament.prizePool?.toLocaleString()}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Prize Pool
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {(joiners.filter(joiner => joiner.tournamentId==tournament.id))?.length || 0} Participants
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800'
                  }`}>
                    COMPLETED
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentList;
