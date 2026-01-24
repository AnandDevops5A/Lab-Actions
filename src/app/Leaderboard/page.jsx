"use client";
import React, { useState, useMemo, useContext, useEffect } from "react";
import { ThemeContext } from "../Library/ThemeContext";
import { TopThree } from "./components/TopThree";
import { PlayerCard } from "./components/PlayerCard";
import { useFetchBackendAPI } from "../Library/API";
import { calulateWinAndReward } from "../Library/common";
import { LeaderboardSkeleton } from "../skeleton/Skeleton";
import { getCache } from "../Library/ActionRedis";

const DummyTournamentforLeaderboard = [
  "Global",
  "Tokyo Grid",
  "Neo Europe",
  "Mars League",
];

export default function Leaderboard() {
  const [search, setSearch] = useState("");
  // const [tournament, setTournament] = useState("Global");
  const [sortBy, setSortBy] = useState("wins");
  const [loading, setLoading] = useState(true);
  const [dropdown, setDropdown] = useState(0);

  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? true;
  const [users, setUsers] = useState([]);
  const [AllTournament, setAllTournament] = useState();

  //GET DATA FROM BACKEND
  async function getData(isMounted) {
    try {
      let data;
      let tournamentData;
      const c = await getCache("adminData::SimpleKey []");
      const cache = c.data;


      // console.log(cache);
      // Check if cache is valid (not the error object from getCache)
      if (c.status) {
        data = cache.users[1];
        tournamentData = cache.tournaments[1];
        // console.log(tournamentData);
      } else {
        const res = await useFetchBackendAPI("users/all");
        data = res.data;
        console.log("backend call");
      }

      if (!isMounted()) return;

      //filter  played and unplayed user
      const played = (data || []).filter((d) => d.playedTournaments != null);

      let ids = played.flatMap((u) => u.playedTournaments);
      let listoftournaments = Array.from(new Set(ids));

      if (!tournamentData) {
        let response = await useFetchBackendAPI("tournament/getTournament", {
          method: "POST",
          data: listoftournaments,
        });
        tournamentData = response.data || [];
        // console.log(tournamentData);
      } else {
        tournamentData = tournamentData.filter((t) =>
          listoftournaments.includes(t.id)
        );
      }
      
      if (!isMounted()) return;
      
      // console.log(tournamentData);
      setAllTournament(tournamentData);

      //calculate reward and win
      const userStats = calulateWinAndReward(tournamentData);
      //merge reward to user
      let usersWithStats = played.map((user) => {
        const stats = userStats.get(user.id) || userStats.get(user._id);
        return {
          ...user,
          reward: stats?.reward || 0,
          wins: stats?.wins || 0,
        };
      });

      // Sort by reward then wins to establish global rank
      usersWithStats.sort((a, b) => {
        if (b.reward !== a.reward) return b.reward - a.reward;
        return b.wins - a.wins;
      });

      // Assign global rank once
      usersWithStats = usersWithStats.map((user, index) => ({
        ...user,
        globalRank: index + 1,
      }));

      setUsers(usersWithStats);
    } catch (error) {
      console.error("Failed to fetch leaderboard data", error);
    } finally {
      if (isMounted()) setLoading(false);
    }
  }

  //get data from backend
  useEffect(() => {
    let ignore = false;
    const isMounted = () => !ignore;

    setLoading(true);
    getData(isMounted);

    return () => {
      ignore = true;
    }; // cleanup
  }, []);

  const selectedTournamentData = useMemo(() => {
    if (dropdown != 0 && AllTournament) {
      return AllTournament.find((t) => (t.id || t) == dropdown);
    }
    return null;
  }, [dropdown, AllTournament]);

  const filterPlayers = useMemo(() => {
    if (!users) return [];

    let result = users.filter((p) =>
      (p.username || "").toLowerCase().includes(search.toLowerCase())
    );

    if (selectedTournamentData) {
      if (selectedTournamentData.rankList) {
        result = result.filter((u) =>
          Object.prototype.hasOwnProperty.call(
            selectedTournamentData.rankList,
            u._id || u.id
          )
        );
        result.sort((a, b) => {
          const rankA = selectedTournamentData.rankList[a._id || a.id];
          const rankB = selectedTournamentData.rankList[b._id || b.id];
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
  }, [search, dropdown, users, sortBy, selectedTournamentData]);

  const topThree = filterPlayers.slice(0, 3);
  const restPlayer = filterPlayers.slice(3);
  //user from contextapi
  const loggedInUser = "Anand Raj";

  const selectedTournament = selectedTournamentData || "Global";

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
          className={`text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${headerGradient} ${
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
        className={`max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 rounded-xl backdrop-blur-sm ${
          isDarkMode
            ? "bg-gray-900/80 border border-green-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
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
              ? "bg-gray-900 border border-green-500/40 text-green-300 focus:border-yellow-400"
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
              ? "bg-gray-900 border border-red-500/40 text-red-300 focus:border-yellow-400"
              : "bg-slate-100 border border-slate-400 text-slate-700 focus:border-blue-500"
          } px-3 py-2 tracking-widest focus:outline-none transition-colors`}
        >
          <option
            key={0}
            value={0}
            className={isDarkMode ? "bg-gray-900" : "bg-slate-100"}
          >
            Global
          </option>
          {(AllTournament || DummyTournamentforLeaderboard).map((t, index) => (
            <option
              key={index + 1}
              value={t.id || t}
              className={isDarkMode ? "bg-gray-900" : "bg-slate-100"}
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
              ? "bg-gray-900 border border-yellow-400/40 text-yellow-300 focus:border-yellow-300"
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
      {loading ? (
        <LeaderboardSkeleton isDarkMode={isDarkMode} />
      ) : (
        <>
          <TopThree
            players={topThree}
            isDarkMode={isDarkMode}
            selectedTournament={selectedTournament}
            globalUsers={users}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-9">
            {restPlayer.map((player, index) => {
              const globalRank = player.globalRank;
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
        </>
      )}

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
