


export function LeaderCard({ player, rank, isDarkMode, globalRank, tournamentRank, tournamentName, selectedTournament }) {
  const isFirst = rank === 1;
  
  const borderColor = isDarkMode
    ? isFirst ? "border-yellow-400" : "border-green-500/40"
    : isFirst ? "border-amber-600" : "border-slate-400";
    
  const shadowColor = isDarkMode
    ? isFirst ? "shadow-[0_0_60px_rgba(250,204,21,0.45)]" : "shadow-[0_0_30px_rgba(34,211,238,0.25)]"
    : isFirst ? "shadow-xl shadow-amber-600/30" : "shadow-lg shadow-slate-400/20";
    
  const bgColor = isDarkMode ? "bg-slate-900" : "bg-slate-100";
  const textColor = isDarkMode ? "text-white" : "text-slate-900";
  const topGlowColor = isDarkMode ? "via-green-400" : "via-blue-400";
  const rankBadgeColor = isDarkMode 
    ? isFirst ? "text-yellow-400" : "text-green-400"
    : isFirst ? "text-amber-700" : "text-blue-600";
  const nameColor = textColor;
  const labelColor = isDarkMode ? "text-green-600" : "text-slate-600";
  const statColor = isDarkMode ? "text-green-400" : "text-blue-600";
  const rewardColor = isDarkMode ? "text-yellow-400" : "text-amber-700";
  const rewardLabelColor = isDarkMode ? "text-yellow-500" : "text-amber-700";
  const scanlineColor = isDarkMode 
    ? "rgba(0,255,255,0.05)"
    : "rgba(59, 130, 246, 0.03)";

  const isTournamentSelected = typeof selectedTournament === 'object' && selectedTournament !== null;
  const rewards = isTournamentSelected && selectedTournament.rewards ? selectedTournament.rewards : { 1: 500, 2: 200, 3: 100 };
  const tooltipTitle = isTournamentSelected ? "Prize Pool" : "Prize Breakdown";
  const prizePool = isTournamentSelected ? selectedTournament.prizePool : null;

  return (
    <div
      className={`
        relative group ${bgColor} border  mx-auto
        ${borderColor} ${shadowColor}
        p-6 w-72 text-center
        transform-gpu will-change-transform transition-transform duration-500 ease-out
        hover:-translate-y-2 hover:scale-105 hover:shadow-2xl
        motion-safe:transform-gpu
      `}
    >
      {/* Scanline Overlay */}
      <div 
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(transparent 94%, ${scanlineColor} 96%)`,
          backgroundSize: '100% 4px'
        }}
      />

      {/* Rank Badge */}
      <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-4xl font-black ${rankBadgeColor}`}>
        {isFirst ? "♛" : `#${rank}`}
      </div>

      {/* Avatar */}
      <div
        className={`
          mx-auto mb-4 border-2 rounded-full overflow-hidden
          ${isFirst 
            ? isDarkMode ? "w-28 h-28 border-green-400" : "w-28 h-28 border-blue-600" 
            : isDarkMode ? "w-24 h-24 border-green-400" : "w-24 h-24 border-blue-500"
          }
        `}
      >
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.callSign}`}
          alt={player.username}
          className="w-full h-full object-cover rounded-full transition-transform duration-500 ease-out group-hover:scale-105 motion-safe:group-hover:scale-105"
        />
      </div>

      {/* Name */}
      <h3 className={`text-xl font-black tracking-widest ${nameColor} mb-1`}>
        {player.username}
      </h3>

      {/* Tournament */}
      <p className={`text-[10px] tracking-[0.3em] uppercase ${labelColor} mb-1`}>
        {player.rank && <span className="mr-1 opacity-80">{player.rank} ·</span>}
        {tournamentName || player.tournament || "Global"}
      </p>

      <div className={`flex justify-center gap-3 text-[10px] font-bold ${labelColor} opacity-80 mb-4`}>
        {/* {globalRank && <span>🥷 {player.playedTournaments.length}</span>} */}
        {tournamentRank && <span>🏆 #{tournamentRank}</span>}
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center text-sm">
        <div className="relative group/stat">
          <p className={`text-xs uppercase ${labelColor} cursor-help decoration-dotted underline underline-offset-2`}>Wins</p>
          <p className={`text-2xl font-black ${statColor}`}>{player.wins || '0'}</p>
          
          {/* Tooltip for Wins */}
          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max hidden group-hover/stat:block px-3 py-2 rounded-lg text-xs font-medium shadow-2xl z-50 border backdrop-blur-md transition-all duration-200 ${
            isDarkMode 
              ? "bg-gray-900/95 border-green-500/30 text-green-100 shadow-green-900/20" 
              : "bg-white/95 border-blue-200 text-slate-700 shadow-blue-900/10"
          }`}>
            Total 1st Place Finishes
            {/* Arrow */}
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b ${
              isDarkMode ? "bg-gray-900 border-green-500/30" : "bg-white border-blue-200"
            }`}></div>
          </div>
        </div>
        <div className="relative group/stat">
          <p className={`text-xs uppercase ${labelColor} cursor-help decoration-dotted underline underline-offset-2`}>🌐Rank</p>
          <p className={`text-2xl font-black ${statColor}`}>#{globalRank}</p>

          {/* Tooltip for Global Rank */}
          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max hidden group-hover/stat:block px-3 py-2 rounded-lg text-xs font-medium shadow-2xl z-50 border backdrop-blur-md transition-all duration-200 ${
            isDarkMode 
              ? "bg-gray-900/95 border-green-500/30 text-green-100 shadow-green-900/20" 
              : "bg-white/95 border-blue-200 text-slate-700 shadow-blue-900/10"
          }`}>
            Overall ranking across all tournaments
            {/* Arrow */}
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b ${
              isDarkMode ? "bg-gray-900 border-green-500/30" : "bg-white border-blue-200"
            }`}></div>
          </div>
        </div>

        <div className="text-right relative group/stat">
          <p className={`text-xs uppercase ${rewardLabelColor} cursor-help decoration-dotted underline underline-offset-2`}>Reward</p>
          <p className={`text-xl font-black ${rewardColor}`}>
            {player.reward.toLocaleString()}
          </p>

          {/* Tooltip for Reward */}
          <div className={`absolute bottom-full right-0 mb-2 w-48 hidden group-hover/stat:block p-3 rounded-lg text-xs shadow-2xl z-50 border backdrop-blur-md text-left transition-all duration-200 ${
            isDarkMode 
              ? "bg-gray-900/95 border-yellow-500/30 text-gray-200 shadow-yellow-900/10" 
              : "bg-white/95 border-amber-200 text-slate-700 shadow-amber-900/10"
          }`}>
            <p className={`font-bold mb-2 uppercase tracking-wider border-b pb-1 text-[10px] ${isDarkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}>
              {tooltipTitle}
            </p>
            {prizePool && (
              <p className="text-[10px] text-center mb-2 opacity-80 Rusty Attack">{prizePool}</p>
            )}
            <div className="space-y-1.5 Rusty Attack text-[10px]">
              <div className="flex justify-between items-center">
                <span>Rank #1</span> 
                <span className="font-bold text-yellow-500">₹{rewards[1]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Rank #2</span> 
                <span className={`font-bold ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>₹{rewards[2]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Rank #3</span> 
                <span className="font-bold text-orange-500">₹{rewards[3]}</span>
              </div>
            </div>
            {/* Arrow */}
            <div className={`absolute -bottom-1 right-4 w-2 h-2 rotate-45 border-r border-b ${
              isDarkMode ? "bg-gray-900 border-yellow-500/30" : "bg-white border-amber-200"
            }`}></div>
          </div>
        </div>
      </div>

      {/* Bottom Warning Bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent ${isDarkMode ? 'via-red-500' : 'via-red-400'} to-transparent opacity-70`} />
    </div>
  );
}



