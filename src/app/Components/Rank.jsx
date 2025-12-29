import React from "react";

const leaderboardData = [
  { id: 1, name: "NeonRogue", score: 9820, country: "JP" },
  { id: 2, name: "CyberViper", score: 9650, country: "US" },
  { id: 3, name: "PixelGhost", score: 9400, country: "DE" },
  { id: 4, name: "ZeroByte", score: 9100, country: "KR" },
  { id: 5, name: "HexSlayer", score: 8800, country: "BR" },
  { id: 6, name: "NightCircuit", score: 8600, country: "FR" },
  { id: 7, name: "QuantumFox", score: 8400, country: "UK" },
  { id: 8, name: "VoidRunner", score: 8200, country: "CA" },
  { id: 9, name: "DataWraith", score: 8000, country: "AU" },
  { id: 10, name: "GlitchLord", score: 7800, country: "SE" },
];

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-xl border border-cyan-500/40 bg-gradient-to-br from-black via-zinc-900 to-black shadow-[0_0_30px_rgba(0,255,255,0.25)]">

        {/* Header */}
        <div className="p-6 border-b border-cyan-500/30 text-center">
          <h1 className="text-2xl font-extrabold text-cyan-400 tracking-widest drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
            TOURNAMENT LEADERBOARD
          </h1>
          <p className="text-sm text-cyan-300/70 mt-1">
            LIVE RANKINGS — NEURAL ARENA
          </p>
        </div>

        {/* Scrollable List */}
        <div
          className="
            max-h-[360px] overflow-y-auto divide-y divide-cyan-500/20 scrollbar-thin scrollbar-thumb-cyan-500/60 scrollbar-track-black/40"
        >
          {leaderboardData.map((player, index) => {
            const isTopThree = index < 3;

            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 transition-all
                ${isTopThree
                    ? "bg-cyan-500/5 shadow-[inset_0_0_20px_rgba(0,255,255,0.3)]"
                    : "hover:bg-cyan-500/10"
                  }`}
              >
                {/* Rank */}
                <div className="flex items-center gap-4">
                  <span
                    className={`text-lg font-bold w-8 text-center
                    ${index === 0
                        ? "text-amber-600"
                        : index === 1
                          ? "text-zinc-300"
                          : index === 2
                            ? "text-yellow-300"
                            : "text-cyan-400"
                      }`}
                  >
                    #{index + 1}
                  </span>

                  {/* Player Info */}
                  <div>
                    <p className="text-cyan-300 font-semibold tracking-wide">
                      {player.name}
                    </p>
                    <p className="text-xs text-cyan-500/60">
                      {player.country}
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="text-xl font-mono text-cyan-400">
                    {player.score.toLocaleString()}
                  </p>
                  <p className="text-xs text-cyan-500/50">PTS</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-500/30 text-center">
          <p className="text-xs text-cyan-500/50">
            SCROLL TO VIEW MORE PLAYERS
          </p>
        </div>
      </div>
    </div>
  );
}
