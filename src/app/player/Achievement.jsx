import React from 'react'
// components/MatchHistory.jsx

// const matchHistory = [
//   { id: 1, tournamentName: "Mayhem Cup Round 3", finalRank: 1, kills: 12, result: 'Win' },
//   { id: 2, tournamentName: "Weekly Scrims #15", finalRank: 8, kills: 4, result: 'Loss' },
//   { id: 3, tournamentName: "Mayhem Cup Round 2", finalRank: 2, kills: 9, result: 'Win' },
//   { id: 4, tournamentName: "Qualifier Day 2", finalRank: 15, kills: 1, result: 'Loss' },
//   { id: 5, tournamentName: "Qualifier Day 1", finalRank: 3, kills: 10, result: 'Win' },
// ];
const matchHistory=null;

const Achievement = () => (
    <div className="bg-gray-800 p-6 rounded-xl border border-red-700/50 shadow-lg shadow-gray-700/50">
        <h2 className="text-2xl font-bold uppercase mb-6 text-red-500">Match Feed</h2>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">

            {matchHistory ? matchHistory.map((match) => (
                // Conditional styling based on Win/Loss
                <div 
                    key={match.id} 
                    className={`p-3 rounded-lg flex justify-between items-center transition duration-300 
                                ${match.result === 'Win' 
                                    ? 'bg-green-900/40 border-l-4 border-green-500 hover:bg-green-800/50' 
                                    : 'bg-red-900/40 border-l-4 border-red-500 hover:bg-red-800/50'
                                }`}
                >
                    <div>
                        <p className="font-semibold text-lg">{match.tournamentName}</p>
                        <p className="text-xs text-gray-400">Rank: #{match.finalRank} | Kills: {match.kills}</p>
                    </div>
                    
                    <span className={`px-3 py-1 text-sm font-bold uppercase rounded-full 
                        ${match.result === 'Win' 
                            ? 'bg-green-500 text-gray-900' 
                            : 'bg-red-500 text-gray-900'
                        }`}
                    >
                        {match.result}
                    </span>
                </div>
            )): (
                <p className="text-gray-400 text-center">
                    You haven't Played Any Matches Yet.<br/>
                    No match history available.</p>
            )}

        </div>
    </div>
);

export default Achievement
