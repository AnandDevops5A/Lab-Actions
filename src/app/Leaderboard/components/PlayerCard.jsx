
export function PlayerCard({
  player,
  rank,
  globalRank,
  tournamentRank,
  searchTerm,
  loggedInUser,
  isDarkMode,
  selectedTournament
}) {
  const isSearched =
    searchTerm &&
    (player.username || "").toLowerCase().includes(searchTerm.toLowerCase());

  const isYou = player.username === loggedInUser;

  // Theme-aware colors
  const bgColor = isDarkMode ? "bg-slate-900" : "bg-slate-100";
  const borderColor = isDarkMode
    ? isYou
      ? "border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.4)]"
      : isSearched
        ? "border-green-400 shadow-[0_0_35px_rgba(34,211,238,0.5)]"
        : "border-green-900/40"
    : isYou
      ? "border-amber-600 shadow-lg shadow-amber-600/30"
      : isSearched
        ? "border-blue-400 shadow-lg shadow-blue-400/30"
        : "border-slate-300";
  
  const cornerAccentColor = isDarkMode ? "border-green-400" : "border-blue-500";
  const badgeBgColor = isDarkMode ? "bg-green-400" : "bg-blue-600";
  const badgeTextColor = isDarkMode ? "text-black" : "text-white";
  const youBadgeBgColor = isDarkMode ? "bg-red-600" : "bg-red-500";
  const youBadgeTextColor = "text-white";
  const avatarBorderColor = isDarkMode ? "border-amber-500" : "border-amber-600";
  const nameColor = isDarkMode
    ? isYou
      ? "text-yellow-400"
      : isSearched
        ? "text-green-400"
        : "text-white"
    : isYou
      ? "text-amber-700"
      : isSearched
        ? "text-blue-600"
        : "text-slate-900";
  
  const metaColor = isDarkMode ? "text-green-600" : "text-slate-600";
  const statLabelColor = isDarkMode ? "text-green-600" : "text-slate-600";
  const statValueColor = isDarkMode ? "text-green-400" : "text-blue-600";
  const rewardLabelColor = isDarkMode ? "text-yellow-600" : "text-amber-700";
  const rewardValueColor = isDarkMode ? "text-yellow-400" : "text-amber-700";
  const scanlineColor = isDarkMode
    ? "rgba(255,255,255,0.04)"
    : "rgba(59, 130, 246, 0.03)";
  const hoverBorder = isDarkMode ? "hover:border-green-400" : "hover:border-blue-500";

  const isTournamentSelected = typeof selectedTournament === 'object' && selectedTournament !== null;
  const rewards = isTournamentSelected && selectedTournament.rewards ? selectedTournament.rewards : { 1: 500, 2: 200, 3: 100 };
  const tooltipTitle = isTournamentSelected ? "Prize Pool" : "Prize Breakdown";
  const prizePool = isTournamentSelected ? selectedTournament.prizePool : null;

  return (
    <div
      className={`
        relative group ${bgColor} border
        ${borderColor}
        p-5 transform-gpu will-change-transform transition-transform duration-500 ease-out
        ${hoverBorder} hover:scale-105 hover:shadow-lg
        motion-safe:transform-gpu
      `}
    >
      {/* Neon Corner Accent */}
      <div className={`absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 ${cornerAccentColor}`} />
      <div className={`absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 ${isDarkMode ? "border-red-500" : "border-red-400"}`} />

      {/* Rank Badge */}
      <div className={`absolute -top-4 -right-4 ${badgeBgColor} ${badgeTextColor} text-xs font-black px-3 py-1`}>
        #{rank}
      </div>

      {/* YOU Badge */}
      {isYou && (
        <div className={`absolute -top-4 -left-4 ${youBadgeBgColor} ${youBadgeTextColor} text-xs font-black px-3 py-1`}>
          YOU
        </div>
      )}

      {/* Avatar */}
      <div className={`w-16 h-16 border-2 ${avatarBorderColor} mb-4 overflow-hidden rounded-full`}>
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.callSign}`}
          alt={player.username}
          className="w-full h-full object-cover rounded-full transition-transform duration-500 ease-out group-hover:scale-105 motion-safe:group-hover:scale-105"
        />
      </div>

      {/* Name */}
      <h3 className={`text-lg font-black tracking-widest mb-1 ${nameColor}`}>
        {player.username}
      </h3>

      {/* Meta */}
      <div className="mb-4">
        <p className={`text-[10px] tracking-[0.3em] ${metaColor} uppercase mb-1`}>
          {player.rank} · {selectedTournament?.tournamentName || "Global"}
        </p>
        <div className={`flex gap-3 text-[10px] font-bold ${metaColor} opacity-80`}>
         {/* {globalRank && <span>🥷 {player.playedTournament?s.length}</span>} */}
          {tournamentRank && <span>🏆 #{tournamentRank}</span>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-sm text-center">
        <div className="relative group/stat">
          <p className={`text-xs ${statLabelColor} uppercase cursor-help decoration-dotted underline underline-offset-2`}>Wins</p>
          <p className={`text-2xl font-black ${statValueColor}`}>
            {player.wins || 0}
          </p>
          
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
        <div>
          <p className={`text-xs uppercase ${statLabelColor}`}>🌐 Rank</p>
          <p className={`text-2xl font-black ${statValueColor}`}>#{globalRank}</p>
        </div>

        <div className="text-right relative group/stat">
          <p className={`text-xs ${rewardLabelColor} uppercase cursor-help decoration-dotted underline underline-offset-2`}>Reward</p>
          <p className={`text-xl font-black ${rewardValueColor}`}>
           ₹{player.reward.toLocaleString()}
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

      {/* Scanlines */}
      <div 
        className="pointer-events-none absolute inset-0" 
        style={{
          backgroundImage: `linear-gradient(transparent 96%, ${scanlineColor} 98%)`,
          backgroundSize: '100% 4px'
        }}
      />
    </div>
  );
}
