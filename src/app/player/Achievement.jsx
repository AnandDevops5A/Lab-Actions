import React, { useContext, useMemo } from "react";
import { ThemeContext } from "../../lib/contexts/theme-context";
import { FormatDate } from "@/lib/utils/common";
// components/MatchHistory.jsx

const Achievement = ({ matchHistory }) => {
  const { isDarkMode } = useContext(ThemeContext);
  // console.log(matchHistory);
//sort match history ontop first
const sortedMatchHistory = useMemo(() => { return [...(matchHistory || [])].sort((a, b) => {
  if (a.rank && b.rank) {
    return a.rank - b.rank;
  } else if (b.rank) {
    return -1;
  } else if (a.rank) {
    return 1;
  } else {
    return 0;
  }
})},[matchHistory]);


  return (
  <div className={`p-6 rounded-xl border shadow-lg transition-colors duration-300 ${isDarkMode ? "bg-gray-800 border-red-700/50 shadow-gray-700/50" : "bg-white border-red-200 shadow-gray-200"}`}>
    <h2 className={`text-2xl font-bold uppercase mb-6 ${isDarkMode ? "text-red-500" : "text-red-600"}`}>
      Match Feed
    </h2>
    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {sortedMatchHistory && sortedMatchHistory.length > 0 ? (
        sortedMatchHistory.map((match,idx) => (
          // Conditional styling based on Win/Loss
          <div
            key={idx}
            className={`p-3 rounded-lg flex justify-between items-center transition duration-300 
                                ${
                                  (match.rank ? match.rank <= 3: false)
                                    ? (isDarkMode ? "bg-green-900/40 border-l-4 border-green-500 hover:bg-green-800/50" : "bg-green-50 border-l-4 border-green-500 hover:bg-green-100")
                                    : (isDarkMode ? "bg-red-900/40 border-l-4 border-red-500 hover:bg-red-800/50" : "bg-red-50 border-l-4 border-red-500 hover:bg-red-100")
                                }`}
          >
            <div>
              <p className={`font-semibold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>{match.tournamentName}</p>
              <p className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}><FormatDate dateNum={match.dateTime} /></p>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {match.rank<=3
                  ? `🪙: ${
                      (match.rank === 1 && 500) ||
                      (match.rank === 2 && 200) ||
                      (match.rank === 3 && 100)
                    }`
                  : `Chaser`} | Invest : ₹ {match.investAmount}
              </p>
            </div>

            <span
              className={`px-3 py-1 text-sm font-bold uppercase not-visited: rounded
                        ${
                          match.rank<=3
                            ? (isDarkMode ? "bg-green-500 text-gray-900" : "bg-green-200 text-green-900")
                            : (isDarkMode ? "bg-red-400 text-gray-900" : "bg-red-200 text-red-900")
                        }`}
            >
              #{match.rank}
            </span>
          </div>
        ))
      ) : (
        <p className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          You haven&apos;t Played Any Matches Yet.
          <br />
          No match history available.
        </p>
      )}
    </div>
  </div>
  );
};

export default Achievement;
