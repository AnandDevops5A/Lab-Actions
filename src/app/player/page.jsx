'use client';

import React from 'react';
import profileBackImage from '../images/profile.png';
import Avatar from '../images/avatar.png';
import ChargeBorder from '../Components/ChargeBorder.jsx';
// --- MOCK DATA for demonstration ---

const mockPlayer = {
  ign: "SHADOW_LORD_07",
  bgmiId: "1234567890",
  teamName: "Inferno Squad",
  avatarUrl: Avatar.src, // Placeholder URL
  totalKills: 345,
  kdRatio: 4.87,
  matchesPlayed: 71,
  avgRank: 6.2,
};

const mockMatchHistory = [
  { id: 1, tournamentName: "Mayhem Cup Round 3", finalRank: 1, kills: 12, result: 'Win' },
  { id: 2, tournamentName: "Weekly Scrims #15", finalRank: 8, kills: 4, result: 'Loss' },
  { id: 3, tournamentName: "Mayhem Cup Round 2", finalRank: 2, kills: 9, result: 'Win' },
  { id: 4, tournamentName: "Qualifier Day 2", finalRank: 15, kills: 1, result: 'Loss' },
  { id: 5, tournamentName: "Qualifier Day 1", finalRank: 3, kills: 10, result: 'Win' },
];
// ------------------------------------


// components/ProfileHeader.jsx

const ProfileHeader = ({ player }) => (
  <ChargeBorder 
  color="#7cfc00 "
  speed={1}
  chaos={0.5}
  thickness={2}
  style={{ borderRadius: 14 }}
>
  <div
    className="relative h-48 sm:h-56 md:h-64 lg:h-72 bg-cover bg-center mt-16 rounded-2xl overflow-hidden"
    style={{ backgroundImage: `url(${profileBackImage.src})` }}
  >
    {/* Semi-transparent overlay */}
    {/* <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm rounded-2xl"></div> */}

    <div className="relative p-4 sm:p-6 flex flex-col md:flex-row-reverse items-center justify-evenly h-full gap-6 blur(4px)">
      {/* Player Avatar */}
      <img
        src={player.avatarUrl}
        alt={player.ign}
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full border-2 border-green-400 object-cover shadow-xl shadow-gray-700/70"
      />

      {/* Player Info */}
      <div className="text-center md:text-left max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold uppercase tracking-widest text-red-400 wrap-break-word">
          {player.ign}
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mt-2">
          Team: <span className="font-semibold text-white">{player.teamName}</span> | Player ID: {player.bgmiId}
        </p>
      </div>
    </div>
  </div>
</ChargeBorder>
);






// components/PlayerStats.jsx

const PlayerStats = ({ player }) => (
    <div className="bg-gray-800 p-6 rounded-xl border border-red-700/50 shadow-lg shadow-gray-700/50">
        <h2 className="text-2xl font-bold uppercase mb-6 border-b-2 border-red-500 pb-2">Tournament Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* Stat Card 1: Kills (Focus Metric with Neon Glow) */}
            <div className="p-4 bg-gray-700 rounded-lg text-center border border-red-500/70">
                <p className="text-xs uppercase text-gray-400 font-medium">Total Kills</p>
                <p className="text-4xl font-extrabold text-red-400 [text-shadow:0_0_8px_#F87171]">
                    {player.totalKills}
                </p>
            </div>

            {/* Stat Card 2: K/D Ratio */}
            <div className="p-4 bg-gray-700 rounded-lg text-center">
                <p className="text-xs uppercase text-gray-400 font-medium">K/D Ratio</p>
                <p className="text-4xl font-extrabold text-white">
                    {player.kdRatio.toFixed(2)}
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
                <p className="text-xs uppercase text-gray-400 font-medium">Avg Rank</p>
                <p className="text-4xl font-extrabold text-white">
                    {player.avgRank.toFixed(1)}
                </p>
            </div>

        </div>
    </div>
);

// components/MatchHistory.jsx

const MatchHistory = ({ matchHistory }) => (
    <div className="bg-gray-800 p-6 rounded-xl border border-red-700/50 shadow-lg shadow-gray-700/50">
        <h2 className="text-2xl font-bold uppercase mb-6 text-red-500">Match Feed</h2>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">

            {matchHistory.map((match) => (
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
            ))}

        </div>
    </div>
);



const PlayerProfile = () => {
  const player = mockPlayer; 
  const matchHistory = mockMatchHistory;
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-10">
      
      {/* 1. Header & Quick Stats (Top Section) */}
      <ProfileHeader player={player} />

      {/* 2. Main Content Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Column (Stats) - Takes 2/3 space on large screens */}
        <div className="lg:col-span-2 space-y-8">
          <PlayerStats player={player} />
        </div>

        {/* Right Column (Match History) - Takes 1/3 space on large screens */}
        <div className="lg:col-span-1">
          <MatchHistory matchHistory={matchHistory} />
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;