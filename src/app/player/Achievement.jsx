import React from "react";
// components/MatchHistory.jsx



const Achievement = ({ matchHistory }) => (
  <div className="bg-gray-800 p-6 rounded-xl border border-red-700/50 shadow-lg shadow-gray-700/50">
    <h2 className="text-2xl font-bold uppercase mb-6 text-red-500">
      Match Feed
    </h2>
    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {matchHistory ? (
        matchHistory.map((match,idx) => (
          // Conditional styling based on Win/Loss
          <div
            key={idx}
            className={`p-3 rounded-lg flex justify-between items-center transition duration-300 
                                ${
                                  (match.rank ? match.rank >= 3: false)
                                    ? "bg-green-900/40 border-l-4 border-green-500 hover:bg-green-800/50"
                                    : "bg-red-900/40 border-l-4 border-red-500 hover:bg-red-800/50"
                                }`}
          >
            <div>
              <p className="font-semibold text-lg">{match.tournamentName}</p>
              <p className="text-xs text-gray-400">
                {match.rank
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
                          match.rank
                            ? "bg-green-500 text-gray-900"
                            : "bg-red-400 text-gray-900"
                        }`}
            >
              #{match.rank}
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center">
          You haven&apos;t Played Any Matches Yet.
          <br />
          No match history available.
        </p>
      )}
    </div>
  </div>
);

export default Achievement;



