"use client";
import React, { useState, useMemo, useContext, useEffect } from "react";
import { ThemeContext } from "../Library/ThemeContext";
import { TopThree } from "./components/TopThree";
import { PlayerCard } from "./components/PlayerCard";
import { useFetchBackendAPI } from "../Library/API";

// const DummyPlayerForLeaderbored = [
//   {
//     id: 1,
//     name: "NIGHT_RUNNER",
//     wins: 84,
//     reward: 250000,
//     tournament: "Global",
//     rank: "LEGEND",
//   },
//   {
//     id: 2,
//     name: "NEON_SAMURAI",
//     wins: 87,
//     reward: 195000,
//     tournament: "Global",
//     rank: "ELITE",
//   },
//   {
//     id: 3,
//     name: "CYBER_WOLF",
//     wins: 72,
//     reward: 160000,
//     tournament: "Tokyo Grid",
//     rank: "ELITE",
//   },
//   {
//     id: 4,
//     name: "GLITCH_WITCH",
//     wins: 68,
//     reward: 120000,
//     tournament: "Tokyo Grid",
//     rank: "PRO",
//   },
//   {
//     id: 5,
//     name: "DATA_PHANTOM",
//     wins: 65,
//     reward: 105500,
//     tournament: "Neo Europe",
//     rank: "PRO",
//   },
//   {
//     id: 6,
//     name: "VOID_WALKER",
//     wins: 60,
//     reward: 90000,
//     tournament: "Neo Europe",
//     rank: "VETERAN",
//   },
//   {
//     id: 7,
//     name: "SYNTH_WAVE",
//     wins: 58,
//     reward: 82500,
//     tournament: "Global",
//     rank: "VETERAN",
//   },
//   {
//     id: 8,
//     name: "IRON_GIANT",
//     wins: 55,
//     reward: 75000,
//     tournament: "Mars League",
//     rank: "VETERAN",
//   },
//   {
//     id: 9,
//     name: "ZERO_COOL",
//     wins: 51,
//     reward: 68000,
//     tournament: "Mars League",
//     rank: "EXPERT",
//   },
//   {
//     id: 10,
//     name: "ACID_BURN",
//     wins: 94,
//     reward: 60000,
//     tournament: "Global",
//     rank: "EXPERT",
//   },
//   {
//     id: 11,
//     name: "CHROME_HEART",
//     wins: 45,
//     reward: 52000,
//     tournament: "Tokyo Grid",
//     rank: "ADVANCED",
//   },
//   {
//     id: 12,
//     name: "PIXEL_RONIN",
//     wins: 42,
//     reward: 48000,
//     tournament: "Neo Europe",
//     rank: "ADVANCED",
//   },
//   {
//     id: 13,
//     name: "NET_VULTURE",
//     wins: 40,
//     reward: 45000,
//     tournament: "Global",
//     rank: "ADVANCED",
//   },
//   {
//     id: 14,
//     name: "LASER_FANG",
//     wins: 38,
//     reward: 39500,
//     tournament: "Mars League",
//     rank: "RISING",
//   },
//   {
//     id: 15,
//     name: "SOLAR_FLARE",
//     wins: 35,
//     reward: 36000,
//     tournament: "Tokyo Grid",
//     rank: "RISING",
//   },
//   {
//     id: 16,
//     name: "BINARY_SOUL",
//     wins: 32,
//     reward: 32500,
//     tournament: "Neo Europe",
//     rank: "RISING",
//   },
//   {
//     id: 17,
//     name: "TECHNO_MAGE",
//     wins: 28,
//     reward: 28000,
//     tournament: "Global",
//     rank: "ROOKIE",
//   },
//   {
//     id: 18,
//     name: "SHADOW_LINK",
//     wins: 25,
//     reward: 24000,
//     tournament: "Mars League",
//     rank: "ROOKIE",
//   },
//   {
//     id: 19,
//     name: "VAPOR_TRAIL",
//     wins: 22,
//     reward: 21000,
//     tournament: "Tokyo Grid",
//     rank: "ROOKIE",
//   },
//   {
//     id: 20,
//     name: "SYSTEM_ERR",
//     wins: 18,
//     reward: 18000,
//     tournament: "Neo Europe",
//     rank: "NOVICE",
//   },
// ];

const DummyTournamentforLeaderboard = [
  "Global",
  "Tokyo Grid",
  "Neo Europe",
  "Mars League",
];

export default function Leaderboard() {
  const [search, setSearch] = useState("");
  const [tournament, setTournament] = useState("Global");
  const [sortBy, setSortBy] = useState("wins");
  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState(0);

  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? true;
  const [users, setUsers] = useState([]);
  const [AllTournament, setAllTournament] = useState();

  //GET DATA FROM BACKEND
  async function getData() {
    const res = await useFetchBackendAPI("users/all");
    // console.log(res.data);
    const data = res.data;
    //filter  played and unplayed user
    const played = data.filter((d) => d.playedTournaments != null);
    //define reward

    // setUsers(played);
    const unplayed = data.filter((d) => d.playedTournaments == null);

    let ids = played.flatMap((u) => u.playedTournaments);
    let listoftournaments = Array.from(new Set(ids));
    const tournamentData = await useFetchBackendAPI(
      "tournament/getTournament",
      {
        method: "POST",
        data: listoftournaments,
      }
    );
    console.log("tournament fetch success");
    const tournaments = tournamentData.data || [];
    // console.log(tournaments);
    setAllTournament(tournaments);

    const rewardMap = { 1: 500, 2: 200, 3: 100 };
    //calculate rewards
    const userStats = {};

    tournaments.forEach((tournament) => {
      Object.entries(tournament.rankList || {}).forEach(([userId, rank]) => {
        const reward = rewardMap[rank] || 0;

        if (!userStats[userId]) {
          userStats[userId] = { reward: 0, wins: 0 };
        }

        userStats[userId].reward += reward;
        if (rank == 1) {
          userStats[userId].wins += 1;
        }
      });
    });
    // console.log(userRewards);
    //merge reward to user
    const usersWithStats = played.map((user) => {
      const userId = user._id || user.id;
      return {
        ...user,
        reward: userStats[userId]?.reward || 0,
        wins: userStats[userId]?.wins || 0,
      };
    });
    const leaderboard = [...usersWithStats].sort((a, b) => {
      if (b.reward !== a.reward) return b.reward - a.reward;
      return b.wins - a.wins; // tie-breaker by wins
    });
    // console.log(leaderboard);
    setUsers(leaderboard);
    setLoading(false);
  }

  //get data from backend
  useEffect(() => {
    let ignore = false;
    //disable dropdown
    setLoading(true);
    if (ignore) return;
    getData();
    //  fetchTournament();
    //   fetchUsers();
    return () => {
      ignore = true;
    }; // cleanup
  }, []);

  const filterPlayers = useMemo(() => {
    if (!users) return [];

    let result = users.filter((p) =>
      (p.username || "").toLowerCase().includes(search.toLowerCase())
    );

    if (dropdown != 0) {
      const selectedTournament = AllTournament?.find(
        (t) => (t.id || t) == dropdown
      );
      if (selectedTournament?.rankList) {
        result = result.filter((u) =>
          Object.prototype.hasOwnProperty.call(
            selectedTournament.rankList,
            u._id || u.id
          )
        );
        result.sort((a, b) => {
          const rankA = selectedTournament.rankList[a._id || a.id];
          const rankB = selectedTournament.rankList[b._id || b.id];
          return rankA - rankB;
        });
        return result;
      }
      result = result.filter((u) =>
        u.playedTournaments?.some((t) => t == dropdown)
      );
    }

    if (sortBy === "reward") {
      result.sort((a, b) => b.reward - a.reward);
    } else {
      result.sort((a, b) => (b.wins || 0) - (a.wins || 0));
    }

    return result;
  }, [search, dropdown, users, sortBy, AllTournament]);

  const topThree = filterPlayers.slice(0, 3);
  const restPlayer = filterPlayers.slice(3);
  //user from contextapi
  const loggedInUser = "Anand Raj";

  const selectedTournament =
    dropdown != 0 && AllTournament
      ? AllTournament.find((t) => (t.id || t) == dropdown)
      : "Global";

  const bgColor = isDarkMode ? "bg-neutral-900" : "bg-slate-50";
  const textColor = isDarkMode ? "text-green-400" : "text-slate-700";
  const headerGradient = isDarkMode
    ? "from-green-400 via-red-500 to-yellow-400"
    : "from-blue-600 via-purple-600 to-cyan-600";
  const scanlineColor = isDarkMode
    ? "rgba(0,255,255,0.06)"
    : "rgba(59, 130, 246, 0.04)";

  return (
    <div
      className={`min-h-screen ${bgColor} ${textColor} font-mono p-8 relative overflow-hidden pt-22`}
    >
      {/* Scanlines */}
      <div
        className="pointer-events-none fixed inset-0 bg-size-[100%_4px]"
        style={{
          backgroundImage: `linear-gradient(transparent 95%, ${scanlineColor} 96%)`,
        }}
      />

      {/* Header */}
      <header className="text-center mb-12">
        <h1
          className={`text-6xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r ${headerGradient} ${
            isDarkMode ? "drop-shadow-[0_0_20px_#22d3ee]" : "drop-shadow-lg"
          }`}
        >
          NETRUNNER LEADERBOARD
        </h1>
        <p
          className={`mt-2 text-xs tracking-[0.4em] uppercase ${
            isDarkMode ? "text-red-500" : "text-blue-600"
          }`}
        >
          Competitive Tournament Rankings
        </p>
      </header>

      {/* Controls */}
      <section
        className={`max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 ${
          isDarkMode
            ? "bg-slate-900/80 border border-green-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
            : "bg-slate-100 border border-slate-300 shadow-lg"
        } p-4`}
      >
        {/* //search player */}
        <input
          placeholder="SEARCH PLAYER"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${
            isDarkMode
              ? "bg-slate-900 border border-green-500/40 text-green-300 focus:border-yellow-400"
              : "bg-slate-100 border border-slate-400 text-slate-700 focus:border-blue-500"
          } px-3 py-2 tracking-widest focus:outline-none transition-colors`}
        />
        {/* //dropdown for tournamnet */}
        <select
          value={dropdown}
          onChange={(e) => setDropdown(e.target.value)}
          disabled={loading}
          className={`${
            isDarkMode
              ? "bg-slate-900 border border-red-500/40 text-red-300 focus:border-yellow-400"
              : "bg-slate-100 border border-slate-400 text-slate-700 focus:border-blue-500"
          } px-3 py-2 tracking-widest focus:outline-none transition-colors`}
        >
          <option
            key={0}
            value={0}
            className={isDarkMode ? "bg-slate-900" : "bg-slate-100"}
          >
            Global
          </option>
          {(AllTournament || DummyTournamentforLeaderboard).map((t, index) => (
            <option
              key={index + 1}
              value={t.id || t}
              className={isDarkMode ? "bg-slate-900" : "bg-slate-100"}
            >
              {t.tournamentName || t}
            </option>
          ))}
        </select>
        {/* //dropdown for reward and win */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`${
            isDarkMode
              ? "bg-slate-900 border border-yellow-400/40 text-yellow-300 focus:border-yellow-300"
              : "bg-slate-100 border border-slate-400 text-slate-700 focus:border-blue-500"
          } px-3 py-2 tracking-widest focus:outline-none transition-colors`}
        >
          <option value="wins">SORT BY WINS</option>
          <option value="reward">SORT BY REWARD</option>
        </select>
        <div
          className={`flex items-center justify-center text-xs tracking-[0.3em] ${
            isDarkMode ? "text-green-600" : "text-slate-600"
          }`}
        >
          RESULTS: {filterPlayers?.length}
        </div>
      </section>

      {/* Top Three Players */}
      <TopThree
        players={topThree}
        isDarkMode={isDarkMode}
        selectedTournament={selectedTournament}
        globalUsers={users}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-9">
        {restPlayer.map((player, index) => {
          const globalRank =
            users.findIndex(
              (u) => (u._id || u.id) === (player._id || player.id)
            ) + 1;
          const tournamentRank =
            selectedTournament?.rankList?.[player._id || player.id];

          return (
            <PlayerCard
              key={player._id || player.id}
              player={player}
              rank={tournamentRank || globalRank}
              globalRank={globalRank}
              tournamentRank={tournamentRank}
              searchTerm={search}
              loggedInUser={loggedInUser}
              isDarkMode={isDarkMode}
               selectedTournament={selectedTournament}
            />
          );
        })}
      </div>

      <footer
        className={`text-center mt-10 text-xs tracking-[0.4em] opacity-50 ${
          isDarkMode ? "text-green-700" : "text-slate-500"
        }`}
      >
        /// END OF TRANSMISSION ///
      </footer>
    </div>
  );
}
