import React from "react";

// components/PlayerStats.jsx

//reuseable stat box with neon glow effect
const StatsNeonBox = ({ title, value, color }) => {
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
      className={`p-4 bg-gray-700 rounded-lg text-center border ${selectedColor.border}`}
    >
      <p className="text-xs uppercase text-gray-400 font-medium">{title}</p>
      <p
        className={`text-[24px] md:text-3xl font-extrabold ${selectedColor.text} [text-shadow:0_0_8px_#F87171]`}
      >
        {value}
      </p>
    </div>
  );
};
//reuseable stat box simple
const StatsSimpleBox = ({ title, value }) => {
  return (
    <div className="p-4 bg-gray-700 rounded-lg text-center">
      <p className="text-xs uppercase text-gray-400 font-medium">{title}</p>
      <p className="text-xl md:text-3xl font-extrabold text-white">{value}</p>
    </div>
  );
};

const PlayerStats = ({ player, matchHistory }) => (
  <div className="bg-gray-800 p-6 rounded-xl border border-red-700/50 shadow-lg shadow-gray-700/50">
    <h2 className="text-2xl font-bold uppercase mb-6 border-b-2 border-red-500 pb-2">
      Tournament Stats
    </h2>
    {player.totalPlay ? (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {/* Stat Card 1: Total withdraw (Focus Metric with Neon Glow) */}
        <StatsNeonBox
          title="Withdraw"
          value={`₹ ${matchHistory.map((m) => m.winAmount).reduce((a, b) => a + b, 0)}` || "N/A"}
          color="green"
        />

        {/* Stat Card 2:Total Win */}
        <StatsSimpleBox title="Wins" value={matchHistory.map((m) => m.rank=== 1).length || "N/A"} />

        {/* Stat Card 3: Matches Played */}
        <StatsSimpleBox title="Total Play" value={matchHistory.length || "N/A"} />
        {/* Stat Card 2: K/D Ratio */}
        <StatsSimpleBox
          title="Win Ratio"
          value={
            player.totalPlay > 0
              ? `${((matchHistory.filter((m) => m.rank== 1).length / matchHistory.length) * 100).toFixed(0)} %`
              : "0.0%"
          }
        />

        {/* Stat Card 5: Invest */}
        <StatsSimpleBox
          title="Invest"
          value={`₹ ${matchHistory.map((m) => m.investAmount).reduce((a, b) => a + b, 0)}` || "N/A"}
        />
        {/* Stat Card 6: Total Loose (Focus Metric with Neon Glow) */}
        <StatsNeonBox
          title="Total Loose"
          value={matchHistory.filter((m) => m.rank < 3).length|| "N/A"}
          color="red"
        />
      </div>
    ) : (
      <p className="text-gray-400 text-center">
        You haven&apos;t Played Any Matches Yet.
        <br />
        No match history available.
      </p>
    )}
  </div>
);

export default PlayerStats;
