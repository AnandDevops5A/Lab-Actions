import React from 'react'


// components/PlayerStats.jsx

const PlayerStats = ({ player }) => (
    <div className="bg-gray-800 p-6 rounded-xl border border-red-700/50 shadow-lg shadow-gray-700/50">
        <h2 className="text-2xl font-bold uppercase mb-6 border-b-2 border-red-500 pb-2">Tournament Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* Stat Card 1: Kills (Focus Metric with Neon Glow) */}
            <div className="p-4 bg-gray-700 rounded-lg text-center border border-green-500/70">
                <p className="text-xs uppercase text-gray-400 font-medium">Total Win</p>
                <p className="text-4xl font-extrabold text-green-400 [text-shadow:0_0_8px_#F87171]">
                    {player.totalWin}
                </p>
            </div>

            {/* Stat Card 2: K/D Ratio */}
            <div className="p-4 bg-gray-700 rounded-lg text-center">
                <p className="text-xs uppercase text-gray-400 font-medium">Win Ratio</p>
                <p className="text-4xl font-extrabold text-white">
                    {player.winRatio.toFixed(2)}
                </p>
            </div>

            {/* Stat Card 3: Matches Played */}
            <div className="p-4 bg-gray-700 rounded-lg text-center">
                <p className="text-xs uppercase text-gray-400 font-medium">Matches</p>
                <p className="text-4xl font-extrabold text-white">
                    {player.matchesPlayed}
                </p>
            </div>

            {/* Stat Card 4: Avg Rank */}
            <div className="p-4 bg-gray-700 rounded-lg text-center">
                <p className="text-xs uppercase text-gray-400 font-medium">Rank</p>
                <p className="text-4xl font-extrabold text-white">
                    {player.avgRank.toFixed(1)}
                </p>
            </div>

        </div>
    </div>
);

export default PlayerStats
