"use client";
import React, { useState, useMemo, useContext, useEffect, useLayoutEffect } from "react";
import { ThemeContext } from "../../lib/contexts/theme-context";
import { UserContext } from "../../lib/contexts/user-context";
import { TopThree } from "./components/TopThree";
import { PlayerCard } from "./components/PlayerCard";
import {
  getAllLeaderBoard,
  getAllTournaments,
  getAllUsers,
  getUsersByIds,
} from "../../lib/api/backend-api";
import { LeaderboardSkeleton } from "../skeleton/Skeleton";
import { errorMessage } from "@/lib/utils/alert";

const DummyTournamentforLeaderboard = [
  "Global",
  "Tokyo Grid",
  "Neo Europe",
  "Mars League",
];

export default function Leaderboard() {
  const [search, setSearch] = useState("");
  // const [tournament, setTournament] = useState("Global");
  const [sortBy, setSortBy] = useState("rank");
  const [loading, setLoading] = useState(true);
  const [dropdown, setDropdown] = useState(0);

  const themeContext = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const isDarkMode = themeContext?.isDarkMode ?? true;
  const [users, setUsers] = useState([]);
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const [AllTournament, setAllTournament] = useState();

  //GET DATA FROM BACKEND
  async function getData(isMounted) {
    try {
      // Parallel fetch: leaderboard, tournaments, and all users (for fallback)
      const [leaderboardRes, tournamentRes, userRes] = await Promise.all([
        getAllLeaderBoard(),
        getAllTournaments(),
        getAllUsers(),
      ]);

      if (!leaderboardRes.ok) {
        errorMessage(leaderboardRes.error || "Failed to load leaderboard data");
        if (isMounted()) setLoading(false);
        return;
      }

      // Extract leaderboard entries and prepare tournaments map
      const lbEntries = leaderboardRes.data || [];
      const tournaments = (tournamentRes?.data || []).map((t) => ({ ...t }));
      const tournamentById = Object.fromEntries((tournaments || []).map((t) => [t.id || t._id, { ...t }]));

      // Group entries by tournament and compute rankList per tournament
      const entriesByTournament = lbEntries.reduce((acc, e) => {
        const tid = e.tournamentId;
        if (!tid) return acc;
        acc[tid] = acc[tid] || [];
        acc[tid].push(e);
        return acc;
      }, {});

      for (const tid of Object.keys(entriesByTournament)) {
        const entries = entriesByTournament[tid];
        const hasRank = entries.some((x) => x.rank != null);
        let sorted = [];
        if (hasRank) {
          sorted = entries.slice().sort((a, b) => (a.rank || 9999) - (b.rank || 9999));
        } else {
          sorted = entries.slice().sort((a, b) => (b.score || 0) - (a.score || 0));
        }
        const rankList = {};
        sorted.forEach((entry, idx) => {
          const key = entry.userId || entry.tempEmail;
          rankList[key] = entry.rank ?? idx + 1;
        });
        if (tournamentById[tid]) tournamentById[tid].rankList = rankList;
        else tournaments.push({ id: tid, tournamentName: tid, rankList });
      }

      // Determine user ids to fetch details for: prefer users referenced in leaderboard, otherwise fallback to all users
      const userIdSet = new Set(lbEntries.map((e) => e.userId).filter(Boolean));
      let finalUsers = userRes?.data || [];

      // If we didn't get all users (or empty), and we have leaderboard entries, try fetching specific users
      if (finalUsers.length === 0 && userIdSet.size > 0) {
        const idsToFetch = Array.from(userIdSet);
        const userData = await getUsersByIds(idsToFetch);
        finalUsers = userData.data || [];
      }

      if (isMounted()) {
        setLeaderboardEntries(lbEntries);
        setUsers(finalUsers);
        setAllTournament(Object.values(tournamentById));
        setLoading(false);
      }
    } catch (error) {
      console.error("Leaderboard Data Fetch Error:", error);
      if (isMounted()) setLoading(false);
      errorMessage("A network error occurred. Please try again.");
    }
  }

  //get data from backend
  useLayoutEffect(() => {
    let ignore = false;
    const isMounted = () => !ignore;

    setLoading(true);
    getData(isMounted);

    return () => {
      ignore = true;
    }; // cleanup
  }, []);

  const availableTournaments = useMemo(() => {
    return AllTournament && AllTournament.length > 0 ? AllTournament : null;
  }, [AllTournament]);

  const selectedTournamentData = useMemo(() => {
    if (dropdown != 0 && AllTournament) {
      return AllTournament.find((t) => (t.id || t._id || t) == dropdown);
    }
    return null;
  }, [dropdown, AllTournament]);

 const ListofUserId = useMemo(() => {
    const idsFromUsers = (users || []).map((player) => player._id || player.id).filter(Boolean);
    const idsFromLb = (leaderboardEntries || []).map((e) => e.userId).filter(Boolean);
    return Array.from(new Set([...idsFromUsers, ...idsFromLb]));
  }, [users, leaderboardEntries]);

  const filterPlayers = useMemo(() => {
    // Build a map of stats from leaderboard entries (global and per-tournament)
    const allEntries = leaderboardEntries || [];

    // If a tournament is selected, restrict entries for per-tournament stats
    const filteredEntries = dropdown != 0 ? allEntries.filter((e) => e.tournamentId === dropdown) : allEntries;

    // GLOBAL STATS: build from ALL entries so world rank is stable and independent of selected tournament/filter
    const globalStats = new Map();
    for (const entry of allEntries) {
      const key = entry.userId || entry.tempEmail;
      if (!key) continue;
      const g = globalStats.get(key) || { wins: 0, reward: 0 };
      if (entry.rank === 1) g.wins += 1;
      g.reward += entry.winAmount || 0;
      globalStats.set(key, g);
    }

    // Build a global rank map (reward desc -> wins desc)
    const globalRankMap = (() => {
      const arr = Array.from(globalStats.entries()).map(([key, stats]) => ({ key, ...stats }));
      arr.sort((a, b) => {
        if (b.reward !== a.reward) return b.reward - a.reward;
        return (b.wins || 0) - (a.wins || 0);
      });
      const map = new Map();
      arr.forEach((item, idx) => map.set(item.key, idx + 1));
      return map;
    })();

    // PER-TOURNAMENT STATS: computed from filteredEntries (if a tournament is selected)
    const perTournamentStats = new Map(); // key: userIdOrEmail -> { rank, score, winAmount }
    for (const entry of filteredEntries) {
      const key = entry.userId || entry.tempEmail;
      if (!key) continue;

      const p = perTournamentStats.get(key) || { rank: entry.rank || null, score: entry.score || 0 };
      if (entry.rank != null && (p.rank == null || entry.rank < p.rank)) p.rank = entry.rank;
      if ((entry.score || 0) > (p.score || 0)) p.score = entry.score;
      perTournamentStats.set(key, p);
    }

    // Get list of participant ids (userId or tempEmail)
    const participantIds = Array.from(new Set(filteredEntries.map((e) => e.userId || e.tempEmail).filter(Boolean)));

    // If no participants (empty), we can show all users (global view)
    const idsToShow = participantIds.length > 0 ? participantIds : (users || []).map((u) => u._id || u.id).filter(Boolean);

    // Build result objects
    let result = idsToShow.map((id) => {
      // find user object (if any)
      const userObj = (users || []).find((u) => (u._id || u.id) === id);
      const placeholder = {
        id,
        _id: id,
        username: id.includes("@") ? id.split("@")[0] : `User-${id.substring(0,6)}`,
        email: id.includes("@") ? id : undefined,
        playedTournaments: [],
        matches: [],
      };
      const finalUser = userObj || placeholder;

      const gstats = globalStats.get(id) || { wins: 0, reward: 0 };
      const pstats = perTournamentStats.get(id) || { rank: null, score: 0 };

      return {
        ...finalUser,
        wins: gstats.wins || 0,
        reward: gstats.reward || 0,
        tournamentRank: pstats.rank,
        tournamentScore: pstats.score,
        rank: pstats.rank,
        globalRank: globalRankMap.get(id) || null, // stable world rank
      };
    });

    // Apply search filter
    result = result.filter((user) => (user.username || "").toLowerCase().includes(search.toLowerCase()));

    // Sort by selected metric
    if (sortBy === "reward") {
      result.sort((a, b) => (b.reward || 0) - (a.reward || 0));
    } else if (sortBy === "wins") {
      result.sort((a, b) => (b.wins || 0) - (a.wins || 0));
    } else {
      result.sort((a, b) => {
        const rankA = (dropdown != 0 ? a.tournamentRank : a.globalRank) ?? 999999;
        const rankB = (dropdown != 0 ? b.tournamentRank : b.globalRank) ?? 999999;
        return rankA - rankB;
      });
    }

    // Note: We do NOT overwrite globalRank here, so player.globalRank remains the true calculated World Rank.

    return result;
  }, [users, leaderboardEntries, search, dropdown, sortBy]);

  const topThree = filterPlayers.slice(0, 3);
  const restPlayer = filterPlayers.slice(3);
  //user from contextapi
  const loggedInUser = user?.username || "";

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
      className={`min-h-screen ${bgColor} ${textColor} Rusty Attack p-8 relative overflow-hidden pt-22`}
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
          {(availableTournaments || DummyTournamentforLeaderboard).map((t, index) => (
            <option
              key={index + 1}
              value={t.id || t._id || t}
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
          <option value="rank">SORT BY RANK</option>
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
            globalUsers={filterPlayers}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-9">
            {restPlayer.map((player, index) => {
              const rankToShow = (selectedTournamentData ? player.tournamentRank : player.globalRank) || index + 4;
              return (
                <PlayerCard
                  key={player._id || player.id}
                  player={player}
                  rank={rankToShow}
                  globalRank={player.globalRank}
                  tournamentRank={player.tournamentRank}
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
