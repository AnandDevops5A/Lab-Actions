"use client";
import React, { useEffect, useState, useContext, useMemo } from "react";
import { getJoinersByTournamentIdList } from "../../lib/api/backend-api";
import { Trophy, Users, Swords, Gamepad2 } from "lucide-react";
import { ThemeContext } from "../../lib/contexts/theme-context";
import { fetchUpcomingTournament } from "@/lib/utils/common";
import { UserContext } from "@/lib/contexts/user-context";
import { UpcomingSkeletonCard } from "@/app/skeleton/Skeleton";
import GamingBackground from "./gaming-background";

// Card styles from the inspirational component
const cardStyles = [
  {
    badgeColor: "from-cyan-400 to-sky-500",
    accent: "border-cyan-400/60",
    glow: "bg-cyan-400/20",
  },
  {
    badgeColor: "from-amber-400 to-orange-500",
    accent: "border-amber-400/60",
    glow: "bg-amber-400/20",
  },
  {
    badgeColor: "from-green-400 to-emerald-500",
    accent: "border-green-400/60",
    glow: "bg-green-400/20",
  },
  {
    badgeColor: "from-red-500 to-orange-500",
    accent: "border-red-500/60",
    glow: "bg-red-500/20",
  },
];

const parseTournamentDate = (dateVal) => {
  if (!dateVal) return null;
  const dateStr = dateVal.toString();
  if (dateStr.length === 12 && !isNaN(dateStr)) {
    const year = parseInt(dateStr.slice(0, 4));
    const month = parseInt(dateStr.slice(4, 6)) - 1;
    const day = parseInt(dateStr.slice(6, 8));
    const hour = parseInt(dateStr.slice(8, 10));
    const minute = parseInt(dateStr.slice(10, 12));
    return new Date(year, month, day, hour, minute);
  }
  return new Date(dateVal);
};

const CountdownTimer = ({ targetDate, isDarkMode }) => {
  const [timeLeft, setTimeLeft] = useState("Loading...");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = parseTournamentDate(targetDate);
      if (!target || isNaN(target.getTime())) {
        setTimeLeft("Date TBC");
        return;
      }
      const difference = target.getTime() - new Date().getTime();

      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        setTimeLeft(
          `${String(d).padStart(2, "0")}d : ${String(h).padStart(2, "0")}h : ${String(m).padStart(2, "0")}m`,
        );
      } else {
        setTimeLeft("STARTED");
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000 * 60); // Update every minute
    calculateTimeLeft();
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <p
      className={`mt-1 text-[13px] font-semibold ${timeLeft === "STARTED" ? "text-red-500 animate-pulse" : isDarkMode ? "text-slate-200" : "text-gray-800"}`}
    >
      {timeLeft}
    </p>
  );
};

const UpcomingMatches = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const userContext = useContext(UserContext);
  const { user, userJoinedTournaments } = userContext || {};
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinerCounts, setJoinerCounts] = useState({});
  const buttonStyles = `
  relative overflow-hidden rounded-full px-4 py-2 font-semibold tracking-wide
  text-[11px] md:text-[12px] transition-all duration-300 ease-out
  ${isDarkMode ? "bg-cyan-400/10 text-slate-100 border border-cyan-400/60" : "bg-cyan-600/10 text-cyan-700 border border-cyan-600/60"}
  hover:bg-amber-400 hover:text-slate-900 hover:border-amber-300
  hover:shadow-[0_0_25px_rgba(251,191,36,0.85)]
`;

  const handleOpenModal = () => {
    //scroll to hero section
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      setTimeout(() => {
        heroSection.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchTournaments = async () => {
      setLoading(true);
      try {
        const tournamentData = await fetchUpcomingTournament();

        if (!isMounted) return;
        setTournaments(tournamentData || []);
      } catch (err) {
        console.error("Failed to fetch tournaments:", err);
        if (isMounted) setTournaments([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTournaments();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (tournaments.length === 0) return;

    const fetchJoinerCounts = async () => {
      try {
        const tournamentIds = tournaments.map((t) => t.id);
        const joinersRes = await getJoinersByTournamentIdList(tournamentIds);

        if (joinersRes.ok && isMounted) {
          const counts = joinersRes.data.reduce((acc, joiner) => {
            if (joiner && joiner.tournamentId) {
              acc[joiner.tournamentId] = (acc[joiner.tournamentId] || 0) + 1;
            }
            return acc;
          }, {});
          setJoinerCounts(counts);
        }
      } catch (err) {
        console.error("Failed to fetch joiner counts:", err);
      }
    };

    fetchJoinerCounts();

    return () => {
      isMounted = false;
    };
  }, [tournaments, userJoinedTournaments]);

  // console.table("userJoinedTournaments:", userJoinedTournaments);
  // console.log(typeof userJoinedTournaments, Array.isArray(userJoinedTournaments));
  const userJoinedTournamentNames = useMemo(() => {
    // Defensive check to ensure we have an array before mapping
    if (( userJoinedTournaments && Array.isArray(userJoinedTournaments) && userJoinedTournaments.length > 0)) {
      return userJoinedTournaments.map((t) => String(t.tournamentName));

    }
    return [];
  }, [userJoinedTournaments]);
  // console.log("userJoinedTournamentNames:", userJoinedTournamentNames);


  return (
    <section
      id="tournaments"
      className={`min-h-screen flex flex-col items-center justify-center pt-10 md:pt-0 transition-colors duration-300 ${isDarkMode ? "bg-[#021311] text-slate-100" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Gaming-style decorative background: neon grid, scanlines, blobs, particles, and icons */}
      <GamingBackground isDarkMode={isDarkMode} />
      <h1
        className={`autoblur mb-10 text-[25px] md:text-4xl lg:text-5xl font-extrabold drop-shadow-[0_0_30px_rgba(14,211,8,0.75)] ${isDarkMode ? "text-amber-300" : "text-amber-600"}`}
      >
        ⚔ Upcoming Warzones ⚔
      </h1>

      <div
        className={`rounded-3xl px-6 py-8 md:p-10 shadow-[0_0_60px_rgba(0,0,0,0.95)] transition-colors duration-300 ${isDarkMode ? "bg-transparent border border-slate-600" : "bg-white shadow-xl border border-gray-200"}`}
      >
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-7">
            {[1, 2, 3].map((i) => (
              <UpcomingSkeletonCard key={i} />
            ))}
          </div>
        ) : tournaments.length === 0 ? (
          <div
            className={`text-center py-20 px-10 rounded-2xl border border-dashed ${isDarkMode ? "border-amber-500/20 bg-black/20" : "border-amber-600/20 bg-amber-50/50"}`}
          >
            <Trophy
              className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-amber-500/40" : "text-amber-600/40"}`}
            />
            <p
              className={`text-xl font-bold tracking-widest ${isDarkMode ? "text-amber-400/80" : "text-amber-700/80"}`}
            >
              No Active Warzones
            </p>
            <p
              className={`mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}
            >
              Good to see you, soldier 🫡.
              <br />
              New missions are being assigned. Check back soon...
            </p>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7`}
          >
            {tournaments.map((tournament, index) => {
              const style = cardStyles[index % cardStyles.length];
              const joinedCount = joinerCounts[tournament.id] || 0;
              const maxPlayers = tournament.maxPlayers || 50;
              return (
                <article
                  key={tournament.id || index}
                  className={`
                    fadeup group relative flex flex-col justify-between
                    w-[320px] md:w-[360px] h-fit
                    rounded-2xl border ${isDarkMode ? "border-[#101821]" : "border-gray-200"} ${style.accent}
                    ${isDarkMode ? "bg-linear-to-br from-[#020814] via-[#050d18] to-[#050b14]" : "bg-gradient-to-br from-white via-gray-50 to-white"}
                    overflow-hidden
                    shadow-[0_18px_30px_rgba(0,0,0,0.85)]
                    transition-all duration-300 ease-out
                    hover:-translate-y-1.5 hover:shadow-[0_25px_60px_rgba(0,0,0,0.95)]
                  `}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div
                      className={`absolute -top-20 -right-10 w-48 h-48 ${style.glow} blur-3xl`}
                    />
                  </div>

                  <div className="relative z-10 flex items-start justify-between px-5 pt-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`
                        w-12 h-12 rounded-2xl border border-white/10
                        bg-linear-to-br ${style.badgeColor}
                        shadow-[0_0_25px_rgba(56,189,248,0.9)]
                        flex items-center justify-center 
                      `}
                      >
                        <Swords className="text-lg font-black" />
                      </div>
                      <div>
                        <p
                          className={`text-[15px] font-semibold tracking-wide mb-1 line-clamp-1 ${isDarkMode ? "text-slate-50" : "text-gray-900"}`}
                        >
                          {tournament.tournamentName}
                        </p>
                        <p
                          className={`text-[11px] uppercase tracking-[0.24em] ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
                        >
                          {tournament.platform || "Mobile"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenModal()}
                      className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-colors duration-200 group-hover:border-cyan-300 group-hover:text-cyan-300 ${isDarkMode ? "border-slate-600/60 bg-slate-900/60 text-slate-300" : "border-gray-300 bg-gray-100 text-gray-600"}`}
                      disabled={userJoinedTournamentNames.includes(String(tournament.tournamentName))}
                      aria-disabled={userJoinedTournamentNames.includes(String(tournament.tournamentName))}
                      aria-label={userJoinedTournamentNames.includes(String(tournament.tournamentName)) ? "Already Joined" : "Join Tournament"}
                      
                    >
                      →
                    </button>
                  </div>

                  <div className="relative z-10 flex items-center justify-between px-5 pb-4 pt-3">
                    <div
                      className={`flex space-x-6 text-[11px] md:text-[12px] ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
                    >
                      <div>
                        <p className="uppercase tracking-[0.2em]">Prize</p>
                        <p
                          className={`mt-1 text-[13px] font-semibold ${isDarkMode ? "text-amber-300" : "text-amber-600"}`}
                        >
                          🏆 ₹{tournament.prizePool}
                        </p>
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.2em]">Starts In</p>
                        <CountdownTimer targetDate={tournament.dateTime} isDarkMode={isDarkMode} />
                      </div>
                    </div>
                    <div className="flex items-center">
                      {!userJoinedTournamentNames.includes(
                        String(tournament.tournamentName),
                      ) ? (
                        <button
                          type="button"
                          onClick={() => handleOpenModal()}
                          disabled={userJoinedTournamentNames.includes(String(tournament.tournamentName))}
                          aria-disabled={userJoinedTournamentNames.includes(String(tournament.tournamentName))}
                          aria-label={userJoinedTournamentNames.includes(String(tournament.tournamentName)) ? "Already Joined" : "Join Tournament"}
                          className={`${buttonStyles} group`}
                        >
                          <span className="relative z-10 flex items-center space-x-1">
                            <span>Join Now</span>
                            <span className="text-xs">▶</span>
                          </span>

                          {/* Animated Sweep Effect */}
                          <span className="absolute inset-0 -translate-x-full opacity-0 transition-all duration-400 ease-out bg-gradient-to-r from-transparent via-white/60 to-transparent group-hover:translate-x-full group-hover:opacity-100" />
                        </button>
                      ) : (
                        <div
                          className={`flex items-center space-x-2 text-[11px] md:text-[12px] font-medium uppercase tracking-widest ${isDarkMode ? "text-cyan-400/80" : "text-cyan-600/80"}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          <span>Enrolled</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <hr
                    className={`${isDarkMode ? "border-slate-800" : "border-gray-200"}`}
                  />
                  <div
                    className={`relative z-10 flex items-center justify-between px-5 py-2 text-[11px] ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span className="font-medium">
                        <span
                          className={`font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {joinedCount}
                        </span>
                        <span
                          className={`${isDarkMode ? "text-slate-500" : "text-gray-400"}`}
                        >
                          {" "}
                          /{" "}
                        </span>
                        <span>{maxPlayers} Joined</span>
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 font-semibold ${isDarkMode ? "text-green-400" : "text-green-600"}`}
                    >
                      <span>{maxPlayers - joinedCount} Slots Left</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      
    </section>
  );
};

export default UpcomingMatches;
