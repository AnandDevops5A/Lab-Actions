


export function LeaderCard({ player, position, isDarkMode }) {
  const isFirst = position === 1;
  
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

  return (
    <div
      className={`
        relative group ${bgColor} border 
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
        {isFirst ? "♛" : `#${position}`}
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
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`}
          alt={player.name}
          className="w-full h-full object-cover rounded-full transition-transform duration-500 ease-out group-hover:scale-105 motion-safe:group-hover:scale-105"
        />
      </div>

      {/* Name */}
      <h3 className={`text-xl font-black tracking-widest ${nameColor} mb-1`}>
        {player.name}
      </h3>

      {/* Tournament */}
      <p className={`text-[10px] tracking-[0.3em] uppercase ${labelColor} mb-4`}>
        {player.tournament}
      </p>

      {/* Stats */}
      <div className="flex justify-between items-center text-sm">
        <div>
          <p className={`text-xs uppercase ${labelColor}`}>Wins</p>
          <p className={`text-2xl font-black ${statColor}`}>{player.wins}</p>
        </div>

        <div className="text-right">
          <p className={`text-xs uppercase ${rewardLabelColor}`}>Reward</p>
          <p className={`text-xl font-black ${rewardColor}`}>
            ${player.reward.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bottom Warning Bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent ${isDarkMode ? 'via-red-500' : 'via-red-400'} to-transparent opacity-70`} />
    </div>
  );
}