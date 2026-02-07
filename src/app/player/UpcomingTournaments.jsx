import React, { useContext } from "react";
import { Calendar, Trophy, Gamepad2, Clock, Users } from "lucide-react";
import { ThemeContext } from "../../lib/contexts/theme-context";
import { FormatDate } from "@/lib/utils/common";



const UpcomingTournaments = ({ tournaments }) => {
  const { isDarkMode } = useContext(ThemeContext);



  return (
    <div
      className={`animate-slideInDown p-6 rounded-xl border shadow-lg transition-colors duration-300 ${isDarkMode ? "bg-gray-800 border-cyan-400/30 shadow-cyan-900/20" : "bg-white border-cyan-200 shadow-cyan-500/20"}`}
    >
      <div
        className={`flex items-center justify-between border-b pb-3 mb-6 ${
          isDarkMode ? "border-cyan-500/30" : "border-cyan-200"
        }`}
      >
        {/* Left Side: Title & Icon */}
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${isDarkMode ? "bg-cyan-500/10" : "bg-cyan-50"}`}
          >
            <Calendar
              className={`w-6 h-6 ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`}
            />
          </div>
          <h2
            className={` text-[0.9rem] md:text-lg font-bold uppercase tracking-tight ${
              isDarkMode ? "text-slate-100" : "text-slate-800"
            }`}
          >
          ⚔️  Upcoming Events
          </h2>
        </div>

        {/* Right Side: Metadata / Badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            isDarkMode
              ? "bg-cyan-950 text-cyan-400 border border-cyan-500/30"
              : "bg-cyan-50 text-cyan-700 border border-cyan-100"
          }`}
        >
          <span className="opacity-70">Total:</span>
          <span className="font-bold">{tournaments.length}</span>
        </div>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {tournaments && tournaments.length > 0 ? (
          tournaments.map((match, idx) => (
            <div
              key={idx}
              className={`relative p-4 rounded-lg border transition-all duration-300 group overflow-hidden ${isDarkMode ? "bg-gray-700/40 border-gray-600 hover:border-cyan-400" : "bg-gray-50 border-gray-200 hover:border-cyan-400"}`}
            >
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 blur-xl rounded-full -mr-8 -mt-8 transition duration-300 group-hover:bg-cyan-500/20 "></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className={`font-bold text-lg transition-colors line-clamp-1 ${isDarkMode ? "text-slate-100 group-hover:text-cyan-300" : "text-gray-900 group-hover:text-cyan-600"}`}
                  >
                    {match.tournamentName}
                  </h3>
                  <span
                    className={`shrink-0 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border ${isDarkMode ? "bg-cyan-900/60 text-cyan-300 border-cyan-500/30" : "bg-cyan-100 text-cyan-700 border-cyan-200"}`}
                  >
                   Joined
                  </span>
                </div>

                <div
                  className={`grid grid-cols-2 gap-y-2 gap-x-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-xs">Pool: ₹{match.prizePool}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs">
                      {match.plateform || "Mobile"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-xs">
                      Slots: {match.filledSlots || 0}/{match.maxSlots || 50}
                    </span>
                  </div>
                  <div
                    className={`col-span-2 flex items-center gap-1.5 mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    <Clock
                      className={`w-3.5 h-3.5 ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`}
                    />
                    <span className="text-xs Rusty Attack tracking-wide">
                      <FormatDate dateNum={match.dateTime} />
                    </span>
                  </div>
                </div>

                {match.transactionId && (
                  <div
                    className={`mt-3 pt-2 border-t flex justify-between items-center ${isDarkMode ? "border-gray-600/50" : "border-gray-200"}`}
                  >
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                      TxID
                    </span>
                    <span
                      className={`text-[10px] Rusty Attack truncate max-w-[120px] ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                      title={match.transactionId}
                    >
                      {match.transactionId}
                    </span>
                  </div>
                )}

                {match.gameId && (
                  <div className="mt-1 pt-2 border-t border-blue-600/50 flex justify-between items-center">
                    <span className="text-[10px] text-blue-500 uppercase tracking-wider">
                      GameId
                    </span>
                    <span
                      className="text-[10px] text-blue-400 Rusty Attack truncate max-w-[120px]"
                      title={match.gameId}
                    >
                      {match.gameId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 flex flex-col items-center">
            <Calendar className="w-10 h-10 mb-2 opacity-20" />
            <p>No upcoming tournaments.</p>
            <p className="text-xs mt-1 opacity-60">
              Join a tournament to see it here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingTournaments;
