
export function PlayerCard({
  player,
  rank,
  searchTerm,
  loggedInUser,
  isDarkMode,
}) {
  const isSearched =
    searchTerm &&
    player.name.toLowerCase().includes(searchTerm.toLowerCase());

  const isYou = player.name === loggedInUser;

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
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`}
          alt={player.name}
          className="w-full h-full object-cover rounded-full transition-transform duration-500 ease-out group-hover:scale-105 motion-safe:group-hover:scale-105"
        />
      </div>

      {/* Name */}
      <h3 className={`text-lg font-black tracking-widest mb-1 ${nameColor}`}>
        {player.name}
      </h3>

      {/* Meta */}
      <p className={`text-[10px] tracking-[0.3em] ${metaColor} uppercase mb-4`}>
        {player.rank} · {player.tournament}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className={`text-xs ${statLabelColor} uppercase`}>Wins</p>
          <p className={`text-2xl font-black ${statValueColor}`}>
            {player.wins}
          </p>
        </div>

        <div className="text-right">
          <p className={`text-xs ${rewardLabelColor} uppercase`}>Reward</p>
          <p className={`text-xl font-black ${rewardValueColor}`}>
            ${player.reward.toLocaleString()}
          </p>
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