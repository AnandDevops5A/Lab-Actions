'use client'
import React, { useState, useMemo } from "react";

const PLAYERS = [
  { id: 1, name: "NIGHT_RUNNER", wins: 84, reward: 250000, tournament: "Global", rank: "LEGEND" },
  { id: 2, name: "NEON_SAMURAI", wins: 87, reward: 195000, tournament: "Global", rank: "ELITE" },
  { id: 3, name: "CYBER_WOLF", wins: 72, reward: 160000, tournament: "Tokyo Grid", rank: "ELITE" },
  { id: 4, name: "GLITCH_WITCH", wins: 68, reward: 120000, tournament: "Tokyo Grid", rank: "PRO" },
  { id: 5, name: "DATA_PHANTOM", wins: 65, reward: 105500, tournament: "Neo Europe", rank: "PRO" },
  { id: 6, name: "VOID_WALKER", wins: 60, reward: 90000, tournament: "Neo Europe", rank: "VETERAN" },
  { id: 7, name: "SYNTH_WAVE", wins: 58, reward: 82500, tournament: "Global", rank: "VETERAN" },
  { id: 8, name: "IRON_GIANT", wins: 55, reward: 75000, tournament: "Mars League", rank: "VETERAN" },
  { id: 9, name: "ZERO_COOL", wins: 51, reward: 68000, tournament: "Mars League", rank: "EXPERT" },
  { id: 10, name: "ACID_BURN", wins: 94, reward: 60000, tournament: "Global", rank: "EXPERT" },
  { id: 11, name: "CHROME_HEART", wins: 45, reward: 52000, tournament: "Tokyo Grid", rank: "ADVANCED" },
  { id: 12, name: "PIXEL_RONIN", wins: 42, reward: 48000, tournament: "Neo Europe", rank: "ADVANCED" },
  { id: 13, name: "NET_VULTURE", wins: 40, reward: 45000, tournament: "Global", rank: "ADVANCED" },
  { id: 14, name: "LASER_FANG", wins: 38, reward: 39500, tournament: "Mars League", rank: "RISING" },
  { id: 15, name: "SOLAR_FLARE", wins: 35, reward: 36000, tournament: "Tokyo Grid", rank: "RISING" },
  { id: 16, name: "BINARY_SOUL", wins: 32, reward: 32500, tournament: "Neo Europe", rank: "RISING" },
  { id: 17, name: "TECHNO_MAGE", wins: 28, reward: 28000, tournament: "Global", rank: "ROOKIE" },
  { id: 18, name: "SHADOW_LINK", wins: 25, reward: 24000, tournament: "Mars League", rank: "ROOKIE" },
  { id: 19, name: "VAPOR_TRAIL", wins: 22, reward: 21000, tournament: "Tokyo Grid", rank: "ROOKIE" },
  { id: 20, name: "SYSTEM_ERR", wins: 18, reward: 18000, tournament: "Neo Europe", rank: "NOVICE" },
];

const TOURNAMENTS = ["Global", "Tokyo Grid", "Neo Europe", "Mars League"];

export default function CyberpunkLeaderboard() {
  const [search, setSearch] = useState("");
  const [tournament, setTournament] = useState("Global");
  const [sortBy, setSortBy] = useState("wins");

  const filteredPlayers = useMemo(() => {
    return PLAYERS
      .filter(p =>
        tournament === "Global" ? true : p.tournament === tournament 
      )
      .filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sortBy === "wins"
          ? b.wins - a.wins
          : b.reward - a.reward
      );
  }, [search, tournament, sortBy]);

  const topThree = filteredPlayers.slice(0, 3);
  const restPlayer = filteredPlayers.slice(3);
  //user from contextapi
  const loggedInUser = "DATA_PHANTOM"


  return (
    <div className="min-h-screen bg-neutral-900 text-green-400 font-mono p-8 relative overflow-hidden pt-22 ">

      {/* Scanlines */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(transparent_95%,rgba(0,255,255,0.06)_96%)] bg-size-[100%_4px]" />

      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-6xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-green-400 via-red-500 to-yellow-400 drop-shadow-[0_0_20px_#22d3ee]">
          NETRUNNER LEADERBOARD
        </h1>
        <p className="mt-2 text-xs tracking-[0.4em] text-red-500 uppercase">
          Competitive Tournament Rankings
        </p>
      </header>

      {/* Controls */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 bg-black/80 border border-green-500/30 p-4 shadow-[0_0_40px_rgba(34,211,238,0.15)]">

        <input
          placeholder="SEARCH PLAYER"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-black border border-green-500/40 px-3 py-2 text-green-300 tracking-widest focus:outline-none focus:border-yellow-400"
        />

        <select
          value={tournament}
          onChange={(e) => setTournament(e.target.value)}
          className="bg-black border border-red-500/40 px-3 py-2 text-red-300 tracking-widest focus:outline-none"
        >
          {TOURNAMENTS.map(t => (
            <option key={t} value={t} className="bg-black">
              {t.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-black border border-yellow-400/40 px-3 py-2 text-yellow-300 tracking-widest focus:outline-none"
        >
          <option value="wins">SORT BY WINS</option>
          <option value="reward">SORT BY REWARD</option>
        </select>

        <div className="flex items-center justify-center text-xs tracking-[0.3em] text-green-600">
          RESULTS: {filteredPlayers.length}
        </div>
      </section>

      {/* Top Three Players */}
      <TopThree players={topThree} />

      
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-9 ">
        {restPlayer.map((player, index) => (
          <PlayerCard
            key={player.id}
            player={player}
            rank={index + 4}
            searchTerm={search}
            loggedInUser={loggedInUser}
          />
        ))}
      </div>


      <footer className="text-center mt-10 text-xs tracking-[0.4em] text-green-700 opacity-50">
        /// END OF TRANSMISSION ///
      </footer>
    </div>
  );
}

export function TopThree({ players }) {
  if (players.length < 3) return null;

  return (
    <section className="flex flex-col md:flex-row justify-center items-end gap-10 mb-16">
      {/* Rank 2 */}
      <LeaderCard player={players[1]} position={2} />

      {/* Rank 1 */}
      <LeaderCard player={players[0]} position={1} />

      {/* Rank 3 */}
      <LeaderCard player={players[2]} position={3} />
    </section>
  );
}

export function LeaderCard({ player, position }) {
  const isFirst = position === 1;

  return (
    <div
      className={`
        relative group bg-black border 
        ${isFirst
          ? "border-yellow-400 scale-110 shadow-[0_0_60px_rgba(250,204,21,0.45)]"
          : "border-green-500/40 shadow-[0_0_30px_rgba(34,211,238,0.25)]"
        }
        p-6 w-72 text-center
        transition-all duration-500
        hover:-translate-y-2
      `}
    >
      {/* Scanline Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_94%,rgba(0,255,255,0.05)_96%)] bg-size-[100%_4px]" />

      {/* Rank Badge */}
      <div
        className={`
          absolute -top-6 left-1/2 -translate-x-1/2 
          text-4xl font-black
          ${isFirst ? "text-yellow-400" : "text-green-400"}
        `}
      >
        {isFirst ? "♛" : `#${position}`}
      </div>

      {/* Aggressive Glow Edge */}
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-green-400 to-transparent opacity-80" />

      {/* Avatar */}
      <div
        className={`
          mx-auto mb-4 border-2 rounded-full overflow-hidden
          ${isFirst ? "w-28 h-28 border-green-400" : "w-24 h-24 border-green-400 "}
        `}
      >
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`}
          alt={player.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name */}
      <h3 className="text-xl font-black tracking-widest text-white mb-1">
        {player.name}
      </h3>

      {/* Tournament */}
      <p className="text-[10px] tracking-[0.3em] uppercase text-green-500 mb-4">
        {player.tournament}
      </p>

      {/* Stats */}
      <div className="flex justify-between items-center text-sm">
        <div>
          <p className="text-green-600 text-xs uppercase">Wins</p>
          <p className="text-2xl font-black text-green-400">{player.wins}</p>
        </div>

        <div className="text-right">
          <p className="text-yellow-500 text-xs uppercase">Reward</p>
          <p className="text-xl font-black text-yellow-400">
            ${player.reward.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bottom Warning Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-red-500 to-transparent opacity-70" />
    </div>
  );
}

export function PlayerCard({
  player,
  rank,
  searchTerm,
  loggedInUser,
}) {
  const isSearched =
    searchTerm &&
    player.name.toLowerCase().includes(searchTerm.toLowerCase());

  const isYou = player.name === loggedInUser;

  return (
    <div
      className={`
        relative group bg-black border
        ${isYou
          ? "border-yellow-400 shadow-[0_0_40px_rgba(20,204,21,0.6)]"
          : isSearched
            ? "border-green-400 shadow-[0_0_35px_rgba(34,211,238,0.6)]"
            : "border-green-900/40"
        }
        p-5 transition-all duration-300
         hover:border-green-400  hover:scale-105
      `}
    >
      {/* Neon Corner Accent */}
      <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-green-400" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-red-500" />

      {/* Rank Badge */}
      <div className="absolute -top-4 -right-4 bg-green-400 text-black text-xs font-black px-3 py-1">
        #{rank}
      </div>

      {/* YOU Badge */}
      {isYou && (
        <div className="absolute -top-4 -left-4 bg-red-600 text-black text-xs font-black px-3 py-1">
          YOU
        </div>
      )}

      {/* Avatar */}
      <div className="w-16 h-16 border-2 border-amber-500 mb-4 overflow-hidden rounded-full">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`}
          alt={player.name}
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* Name */}
      <h3
        className={`
          text-lg font-black tracking-widest mb-1
          ${isYou
            ? "text-yellow-400"
            : isSearched
              ? "text-green-400"
              : "text-white"
          }
        `}
      >
        {player.name}
      </h3>

      {/* Meta */}
      <p className="text-[10px] tracking-[0.3em] text-green-600 uppercase mb-4">
        {player.rank} · {player.tournament}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-green-600 uppercase">Wins</p>
          <p className="text-2xl font-black text-green-400">
            {player.wins}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-yellow-600 uppercase">Reward</p>
          <p className="text-xl font-black text-yellow-400">
            ${player.reward.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Scanlines */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_96%,rgba(255,255,255,0.04)_98%)] bg-[length:100%_4px]" />
    </div>
  );
}
