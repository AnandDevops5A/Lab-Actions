import React, { useContext, useMemo } from "react";
import { ThemeContext } from "../../lib/contexts/theme-context";

// components/PlayerStats.jsx

// Configuration for neon box variants
const COLOR_VARIANTS = {
  green: {
    border: "border-green-500/70",
    text: "text-green-400",
  },
  red: {
    border: "border-red-500/70",
    text: "text-red-400",
  },
  default: {
    border: "border-gray-500/70",
    text: "text-gray-400",
  },
};

//reuseable stat box with neon glow effect
const StatsNeonBox = ({ title, value, color, isDarkMode }) => {
  const selectedColor = COLOR_VARIANTS[color] || COLOR_VARIANTS.default;

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
      <p className={`text-xl md:text-3xl font-extrabold ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{value}</p>
    </div>
  );
};

const PlayerStats = ({ matchHistory }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const stats = useMemo(() => {
    if (!matchHistory || matchHistory.length === 0) return null;

    const totalWithdraw = matchHistory.reduce((acc, m) => acc + (m.winAmount || 0), 0);
    const totalInvest = matchHistory.reduce((acc, m) => acc + (m.investAmount || 0), 0);
    const onTop = matchHistory.filter((m) => m.rank >= 3&& m.rank <= 4).length;
    const totalPlay = matchHistory.length;
    const totalLoose = matchHistory.filter((m) => m.rank > 3 || m.rank === 0).length;
    const winRatio = totalPlay > 0 ? ((onTop / totalPlay) * 100).toFixed(1) + " %" : "0.0%";

    return {
      totalWithdraw,
      totalInvest,
      onTop,
      totalPlay,
      totalLoose,
      winRatio,
    };
  }, [matchHistory]);

  return (
  <div className={`p-6 rounded-xl border shadow-lg transition-colors duration-300 ${isDarkMode ? "bg-gray-800 border-red-700/50 shadow-gray-700/50" : "bg-white border-red-200 shadow-gray-200"}`}>
    <h2 className="text-2xl font-bold uppercase mb-6 border-b-2 border-red-500 pb-2">
      Tournament Stats
    </h2>
    {stats ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Stat Card 1: Total withdraw (Focus Metric with Neon Glow) */}
        <StatsNeonBox
          title="Withdraw"
          value={`₹ ${stats.totalWithdraw}`}
          color="green"
          isDarkMode={isDarkMode}
        />

        {/* Stat Card 2:Total Win */}
        {stats.onTop >=1 &&<StatsSimpleBox title="On Top" value={stats.onTop} isDarkMode={isDarkMode} />}

        {/* Stat Card 3: Matches Played */}
        <StatsSimpleBox title="Total Play" value={stats.totalPlay} isDarkMode={isDarkMode} />
        {/* Stat Card 2: K/D Ratio */}
        {stats.winRatio >0 && <StatsSimpleBox
          title="Win Ratio"
          value={stats.winRatio}
          isDarkMode={isDarkMode}
        />}

         {/* Stat Card 5: Invest */}
        <StatsSimpleBox
          title="Invest"
          value={`₹ ${stats.totalInvest}`}
          isDarkMode={isDarkMode}
        />
        {/* Stat Card 6: Total Loose (Focus Metric with Neon Glow) */}
        <StatsNeonBox
          title="Down Matches"
          value={stats.totalLoose}
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
