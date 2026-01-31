import React, { useContext } from "react";
import { ThemeContext } from "../../lib/contexts/theme-context";

// components/PlayerStats.jsx

//reuseable stat box with neon glow effect
const StatsNeonBox = ({ title, value, color, isDarkMode }) => {
  // Tailwind CSS requires full class names to be present, not dynamically constructed.
  const colorVariants = {
    green: {
      border: "border-green-500/70",
      text: "text-green-400",
    },
    red: {
      border: "border-red-500/70",
      text: "text-red-400",
    },
  };

  const selectedColor = colorVariants[color] || {
    border: "border-gray-500/70",
    text: "text-gray-400",
  };

  return (
    <div
      className={`p-4 rounded-lg text-center border transition-colors duration-300 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} ${selectedColor.border}`}
    >
      <p className={`text-xs uppercase font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{title}</p>
      <p
        className={`text-[24px] md:text-3xl font-extrabold ${selectedColor.text} [text-shadow:0_0_8px_#F87171]`}
      >
        {value}
      </p>
    </div>
  );
};
//reuseable stat box simple
const StatsSimpleBox = ({ title, value, isDarkMode }) => {
  return (
    <div className={`p-4 rounded-lg text-center transition-colors duration-300 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
      <p className={`text-xs uppercase font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{title}</p>
      <p className={`text-xl md:text-3xl font-extrabold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{value}</p>
    </div>
  );
};

const PlayerStats = ({ player, matchHistory }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
  <div className={`p-6 rounded-xl border shadow-lg transition-colors duration-300 ${isDarkMode ? "bg-gray-800 border-red-700/50 shadow-gray-700/50" : "bg-white border-red-200 shadow-gray-200"}`}>
    <h2 className="text-2xl font-bold uppercase mb-6 border-b-2 border-red-500 pb-2">
      Tournament Stats
    </h2>
    {player.totalPlay ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Stat Card 1: Total withdraw (Focus Metric with Neon Glow) */}
        <StatsNeonBox
          title="Withdraw"
          value={`₹ ${matchHistory?.reduce((acc, m) => acc + (m.winAmount || 0), 0) || 0}`}
          color="green"
          isDarkMode={isDarkMode}
        />

        {/* Stat Card 2:Total Win */}
        <StatsSimpleBox title="Wins" value={matchHistory?.filter((m) => m.rank === 1).length || 0} isDarkMode={isDarkMode} />

        {/* Stat Card 3: Matches Played */}
        <StatsSimpleBox title="Total Play" value={matchHistory?.length || 0} isDarkMode={isDarkMode} />
        {/* Stat Card 2: K/D Ratio */}
        <StatsSimpleBox
          title="Win Ratio"
          value={ matchHistory && matchHistory.length > 0
            ? player.totalPlay > 0
              ? `${((matchHistory.filter((m) => m.rank== 1).length / matchHistory.length) * 100).toFixed(0)} %`
              : "0.0%"
          : "0.0%"}
          isDarkMode={isDarkMode}
        />

         {/* Stat Card 5: Invest */}
        <StatsSimpleBox
          title="Invest"
          value={`₹ ${matchHistory?.reduce((acc, m) => acc + (m.investAmount || 0), 0) || 0}`}
          isDarkMode={isDarkMode}
        />
        {/* Stat Card 6: Total Loose (Focus Metric with Neon Glow) */}
        <StatsNeonBox
          title="Total Loose"
          value={matchHistory?.filter((m) => m.rank > 3 || m.rank === 0).length || 0}
          color="red"
          isDarkMode={isDarkMode}
        />
      </div>
    ) : (
      <p className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
        You haven&apos;t Played Any Matches Yet.
        <br />
        No match history available.
      </p>
    )}
  </div>
  );
};

export default PlayerStats;
