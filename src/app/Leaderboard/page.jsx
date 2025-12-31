import React from 'react';

const CyberpunkLeaderboard = () => {
  // Expanded Mock Data (20 Players)
  const players = [
    { rank: 1, name: "NIGHT_RUNNER", wins: 84, rewards: "$250,000", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NIGHT_RUNNER", status: "LEGEND" },
    { rank: 2, name: "NEON_SAMURAI", wins: 79, rewards: "$195,000", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NEON_SAMURAI", status: "ELITE" },
    { rank: 3, name: "CYBER_WOLF", wins: 72, rewards: "$160,000", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CYBER_WOLF", status: "ELITE" },
    { rank: 4, name: "GLITCH_WITCH", wins: 68, rewards: "$120,000", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GLITCH_WITCH", status: "PRO" },
    { rank: 5, name: "DATA_PHANTOM", wins: 65, rewards: "$105,500", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DATA_PHANTOM", status: "PRO" },
    { rank: 6, name: "VOID_WALKER", wins: 60, rewards: "$90,000", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=VOID_WALKER", status: "VETERAN" },
    { rank: 7, name: "SYNTH_WAVE", wins: 58, rewards: "$82,500", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SYNTH_WAVE", status: "VETERAN" },
    { rank: 8, name: "IRON_GIANT", wins: 55, rewards: "$75,000", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=IRON_GIANT", status: "VETERAN" },
    { rank: 9, name: "ZERO_COOL", wins: 51, rewards: "$68,000", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZERO_COOL", status: "EXPERT" },
    { rank: 10, name: "ACID_BURN", wins: 49, rewards: "$60,000", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ACID_BURN", status: "EXPERT" },
    { rank: 11, name: "CHROME_HEART", wins: 45, rewards: "$52,000", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CHROME_HEART", status: "ADVANCED" },
    { rank: 12, name: "PIXEL_RONIN", wins: 40, rewards: "$45,500", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PIXEL_RONIN", status: "ADVANCED" },
    { rank: 13, name: "NET_VULTURE", wins: 38, rewards: "$39,000", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NET_VULTURE", status: "ADVANCED" },
    { rank: 14, name: "LASER_FANG", wins: 35, rewards: "$32,500", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LASER_FANG", status: "RISING" },
    { rank: 15, name: "SOLAR_FLARE", wins: 32, rewards: "$28,000", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SOLAR_FLARE", status: "RISING" },
    { rank: 16, name: "BINARY_SOUL", wins: 28, rewards: "$24,500", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BINARY_SOUL", status: "RISING" },
    { rank: 17, name: "TECHNO_MAGE", wins: 25, rewards: "$20,000", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TECHNO_MAGE", status: "ROOKIE" },
    { rank: 18, name: "SHADOW_LINK", wins: 20, rewards: "$15,500", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SHADOW_LINK", status: "ROOKIE" },
    { rank: 19, name: "VAPOR_TRAIL", wins: 15, rewards: "$10,000", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=VAPOR_TRAIL", status: "ROOKIE" },
    { rank: 20, name: "SYSTEM_ERR", wins: 12, rewards: "$5,000", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SYSTEM_ERR", status: "NOVICE" },
  ];

  const topThree = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <div className="min-h-screen bg-neutral-950 text-cyan-400 font-mono p-4 md:p-8 relative overflow-hidden">
      {/* Background Grid Effect */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 text-center mb-16 mt-8">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
          NetRunners
        </h1>
        <p className="text-fuchsia-400 tracking-[0.5em] text-xs md:text-sm font-bold uppercase mt-2 animate-pulse">
          Global Tournament // Season 2077
        </p>
      </div>

      {/* TOP 3 PODIUM */}
      <div className="relative z-10 flex flex-col md:flex-row justify-center items-end gap-6 md:gap-8 mb-20 px-4">
        
        {/* Rank 2 (Left) */}
        <div className="order-2 md:order-1 flex flex-col items-center w-full md:w-64">
          <div className="relative group w-full">
            <div className="absolute -inset-0.5 bg-gradient-to-b from-cyan-500 to-transparent opacity-50 blur group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-black border border-cyan-500/50 p-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-none border-2 border-cyan-400 mb-4 overflow-hidden relative">
                 <img src={topThree[1].avatar} alt="" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition"/>
                 <div className="absolute bottom-0 right-0 bg-cyan-400 text-black text-xs font-bold px-1">#2</div>
              </div>
              <h3 className="text-xl font-bold text-white truncate w-full text-center">{topThree[1].name}</h3>
              <div className="mt-2 text-center w-full">
                <div className="text-xs text-gray-400 uppercase tracking-widest">Wins</div>
                <div className="text-2xl font-black text-cyan-400">{topThree[1].wins}</div>
                <div className="text-xs text-cyan-500/80 mt-1">{topThree[1].rewards}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Rank 1 (Center/Top) */}
        <div className="order-1 md:order-2 flex flex-col items-center w-full md:w-72 -mt-12">
          <div className="relative group w-full transform hover:-translate-y-2 transition duration-500">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-b from-yellow-400 via-yellow-500 to-transparent opacity-60 blur-md group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative bg-neutral-900 border-2 border-yellow-400 p-8 flex flex-col items-center shadow-[0_0_50px_rgba(250,204,21,0.2)]">
              <div className="absolute -top-6 text-yellow-400 text-4xl drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
                ♛
              </div>
              
              <div className="w-28 h-28 border-4 border-yellow-400 mb-4 overflow-hidden relative shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                 <img src={topThree[0].avatar} alt="" className="w-full h-full object-cover"/>
                 <div className="absolute top-0 left-0 bg-yellow-400 text-black text-xs font-bold px-2 py-1">MVP</div>
              </div>
              
              <h3 className="text-2xl font-black text-white tracking-wide uppercase truncate w-full text-center">{topThree[0].name}</h3>
              <div className="mt-4 text-center w-full border-t border-yellow-400/30 pt-4">
                <div className="text-xs text-yellow-200 uppercase tracking-widest mb-1">Total Wins</div>
                <div className="text-4xl font-black text-yellow-400 drop-shadow-md">{topThree[0].wins}</div>
                <div className="text-sm font-bold text-yellow-200 mt-1 bg-yellow-400/10 inline-block px-3 py-1 rounded">
                  {topThree[0].rewards}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rank 3 (Right) */}
        <div className="order-3 flex flex-col items-center w-full md:w-64">
           <div className="relative group w-full">
            <div className="absolute -inset-0.5 bg-gradient-to-b from-fuchsia-500 to-transparent opacity-50 blur group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-black border border-fuchsia-500/50 p-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-none border-2 border-fuchsia-400 mb-4 overflow-hidden relative">
                 <img src={topThree[2].avatar} alt="" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition"/>
                 <div className="absolute bottom-0 right-0 bg-fuchsia-400 text-black text-xs font-bold px-1">#3</div>
              </div>
              <h3 className="text-xl font-bold text-white truncate w-full text-center">{topThree[2].name}</h3>
              <div className="mt-2 text-center w-full">
                <div className="text-xs text-gray-400 uppercase tracking-widest">Wins</div>
                <div className="text-2xl font-black text-fuchsia-400">{topThree[2].wins}</div>
                <div className="text-xs text-fuchsia-500/80 mt-1">{topThree[2].rewards}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THE LIST (RANK 4-20) */}
      <div className="relative z-10 max-w-5xl mx-auto pb-12">
        {/* Table Header */}
        <div className="hidden md:flex justify-between items-center px-6 py-2 border-b border-cyan-900/50 text-xs font-bold uppercase tracking-widest text-cyan-600 mb-2">
          <div className="w-16">Rank</div>
          <div className="flex-1">Player</div>
          <div className="w-24 text-center">Wins</div>
          <div className="w-32 text-right">Rewards</div>
        </div>

        <div className="space-y-3">
          {rest.map((player) => (
            <div 
              key={player.rank}
              className="group relative flex flex-col md:flex-row md:items-center justify-between p-4 bg-black/60 border border-cyan-900/30 hover:border-cyan-400 hover:bg-cyan-950/20 transition-all duration-300 backdrop-blur-sm"
            >
              {/* Hover Glow Line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#22d3ee]"></div>

              {/* Player Info */}
              <div className="flex items-center gap-4 md:gap-6 flex-1 mb-2 md:mb-0">
                <span className="text-xl md:text-2xl font-black text-cyan-800 w-10 group-hover:text-cyan-400 transition-colors">
                  {String(player.rank).padStart(2, '0')}
                </span>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-cyan-800 group-hover:border-cyan-400 overflow-hidden relative hidden sm:block">
                    <img src={player.avatar} alt={player.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"/>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-300 group-hover:text-white group-hover:tracking-widest transition-all duration-300 text-lg md:text-base">
                      {player.name}
                    </h4>
                    <span className="text-[10px] text-cyan-700 uppercase tracking-wider group-hover:text-cyan-500 font-bold">
                      {player.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid for Mobile / Row for Desktop */}
              <div className="flex items-center justify-between md:gap-8 ml-10 md:ml-0">
                <div className="w-24 md:text-center">
                  <span className="text-sm md:hidden text-gray-600 mr-2 uppercase text-[10px]">Wins:</span>
                  <span className="text-lg md:text-xl font-bold text-white">{player.wins}</span>
                </div>
                <div className="w-auto md:w-32 text-right">
                   <span className="text-sm md:hidden text-gray-600 mr-2 uppercase text-[10px]">Earned:</span>
                  <span className="font-mono font-bold text-cyan-400 group-hover:text-yellow-400 transition-colors shadow-cyan-500/50">
                    {player.rewards}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Load More / End of List Indicator */}
        <div className="text-center mt-8 opacity-50">
             <span className="text-xs tracking-[0.3em] text-cyan-800">/// END OF TRANSMISSION ///</span>
        </div>
      </div>
    </div>
  );
};

export default CyberpunkLeaderboard;