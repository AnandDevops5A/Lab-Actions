"use client";
import React, { useEffect, useState, useContext, useMemo } from "react";
import {
  getUpcomingTournament,
  getJoinersByTournamentIdList,
} from "../../lib/api/backend-api";
import { getCache, setCache } from "../../lib/utils/client-cache";
import MatchJoiningForm from "../forms/match-joining-form";
import {
  Calendar,
  Trophy,
  Users,
  Swords,
  Zap,
  Clock,
  Gamepad2,
  Check,
} from "lucide-react";
import { ThemeContext } from "../../lib/contexts/theme-context";
import { fetchUserTournaments } from "@/lib/utils/common";
import { UserContext } from "@/lib/contexts/user-context";
import { UpcomingSkeletonCard } from "@/app/skeleton/Skeleton";

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

const UpcomingMatches = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [userJoinedTournaments, setUserJoinedTournaments] = useState([]);
  const [joinerCounts, setJoinerCounts] = useState({});
  const [filter, setFilter] = useState("ALL");

  const buttonStyles = `
  relative overflow-hidden rounded-full px-4 py-2 font-semibold tracking-wide
  text-[11px] md:text-[12px] transition-all duration-300 ease-out
  ${isDarkMode ? "bg-cyan-400/10 text-slate-100 border border-cyan-400/60" : "bg-cyan-600/10 text-cyan-700 border border-cyan-600/60"}
  group-hover:bg-amber-400 group-hover:text-slate-900 group-hover:border-amber-300
  group-hover:shadow-[0_0_25px_rgba(251,191,36,0.85)]
`;

  const handleOpenModal = (tournament) => {
    setSelectedTournament(tournament);
    setOpen(true);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUserTournamentsDetails = async () => {
      if (user?.id) {
        const resp = await fetchUserTournaments(user.id);
        if (isMounted && resp) {
          setUserJoinedTournaments(resp);
        }
      }
    };

    const fetchUpcomingTournaments = async () => {
      setLoading(true);
      try {
        let tournamentData = [];
        const cached = await getCache("upcomingTournament");
        if (
          cached?.status &&
          Array.isArray(cached.data) &&
          cached.data.length > 0
        ) {
          tournamentData = cached.data;
        } else {
          const res = await getUpcomingTournament();
          if (res.ok) {
            tournamentData = res.data;
            await setCache("upcomingTournament", res.data, 300);
          }
        }

        if (!isMounted) return;
        setTournaments(tournamentData);

        if (tournamentData.length > 0) {
          const tournamentIds = tournamentData.map((t) => t.id);
          const joinersRes = await getJoinersByTournamentIdList(tournamentIds);

          if (joinersRes.ok) {
            const counts = joinersRes.data.reduce((acc, joiner) => {
              if (joiner && joiner.tournamentId) {
                acc[joiner.tournamentId] = (acc[joiner.tournamentId] || 0) + 1;
              }
              return acc;
            }, {});

            if (isMounted) {
              setJoinerCounts(counts);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch tournaments:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUpcomingTournaments();
    fetchUserTournamentsDetails();

    return () => {
      isMounted = false;
    };
  }, [user]);
  // console.log(userJoinedTournaments);
  const userJoinedTournamentName = useMemo(
    () => userJoinedTournaments?.map((t) => t.tournamentName) || [],
    [userJoinedTournaments],
  );

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

  const CountdownTimer = ({ targetDate }) => {
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

  return (
    <section
      id="tournaments"
      className={`min-h-screen flex flex-col items-center justify-center pt-10 md:pt-0 transition-colors duration-300 ${isDarkMode ? "bg-[#021311] text-slate-100" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Gaming-style decorative background: neon grid, scanlines, blobs, particles, and icons */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 overflow-hidden pointer-events-none"
      >
        {/* Neon grid */}
        <div className="neon-grid" />

        {/* Subtle scanlines for retro/gaming feel */}
        <div className="scanlines" />

        {/* Animated blurred color blobs (kept from previous design) */}
        <div
          className="blob"
          style={{
            left: "-12%",
            top: "-10%",
            width: "48rem",
            height: "48rem",
            background: isDarkMode
              ? "radial-gradient(circle at 30% 30%, rgba(14,211,8,0.12), transparent 28%), radial-gradient(circle at 70% 70%, rgba(14,165,233,0.06), transparent 30%)"
              : "radial-gradient(circle at 30% 30%, rgba(255,179,71,0.18), transparent 28%), radial-gradient(circle at 70% 70%, rgba(6,182,212,0.08), transparent 30%)",
          }}
        />

        <div
          className="blob"
          style={{
            right: "-14%",
            bottom: "-8%",
            width: "36rem",
            height: "36rem",
            background: isDarkMode
              ? "radial-gradient(circle at 40% 40%, rgba(255,179,0,0.08), transparent 40%)"
              : "radial-gradient(circle at 60% 60%, rgba(99,102,241,0.12), transparent 40%)",
            animationDelay: "4s",
          }}
        />

        {/* Tiny moving particles for energy */}
        <div className="particles">
          <span className="particle p1" />
          <span className="particle p2" />
          <span className="particle p3" />
          <span className="particle p4" />
          <span className="particle p5" />
          <span className="particle p6" />
        </div>

        {/* Low-opacity gamepad icons to reinforce gaming theme */}
        <Gamepad2
          className="game-icons"
          color={isDarkMode ? "rgba(14,211,8,0.2)" : "rgba(14,165,233,0.2)"}
          strokeWidth={1}
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 w-full h-full -z-10"
          style={{
            background: `linear-gradient(90deg, ${
              isDarkMode ? "rgba(2, 27, 18, 0.12)" : "rgba(255, 250, 240, 0.12)"
            } 0%, ${isDarkMode ? "rgba(1, 16, 12, 0.06)" : "rgba(240, 255, 255, 0.06)"} 100%)`,
          }}
        />

        <style jsx>{`
          .neon-grid {
            position: absolute;
            inset: 0;
            background-image:
              linear-gradient(rgba(0, 0, 0, 0) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0) 1px, transparent 1px),
              linear-gradient(0deg, rgba(0, 0, 0, 0), transparent);
            background-size:
              40px 40px,
              40px 40px,
              100% 100%;
            background-position:
              0 0,
              0 0,
              0 0;
            opacity: ${isDarkMode ? "0.15" : "0.22"};
            mix-blend-mode: ${isDarkMode ? "screen" : "overlay"};
            transform: translateZ(0);
            will-change: background-position;
            animation: gridMove 18s linear infinite;
            filter: blur(8px) saturate(120%);
          }

          @keyframes gridMove {
            0% {
              background-position:
                0 0,
                0 0,
                0 0;
            }
            50% {
              background-position:
                -120px -80px,
                120px 80px,
                0 0;
            }
            100% {
              background-position:
                0 0,
                0 0,
                0 0;
            }
          }

          .scanlines {
            position: absolute;
            inset: 0;
            background-image: repeating-linear-gradient(
              180deg,
              rgba(255, 255, 255, ${isDarkMode ? "0.01" : "0.02"}) 0px,
              rgba(255, 255, 255, ${isDarkMode ? "0.01" : "0.02"}) 1px,
              transparent 2px
            );
            mix-blend-mode: ${isDarkMode ? "overlay" : "soft-light"};
            pointer-events: none;
          }

          .blob {
            position: absolute;
            border-radius: 48%;
            filter: blur(80px);
            opacity: 0.6;
            transform-origin: center;
            animation: blobMove 12s infinite ease-in-out;
            will-change: transform, opacity;
          }

          @keyframes blobMove {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(28px, -36px) scale(1.06);
            }
            66% {
              transform: translate(-36px, 24px) scale(0.96);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }

          .particles {
            position: absolute;
            inset: 0;
            pointer-events: none;
          }
          .particle {
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.85);
            opacity: 0.06;
            box-shadow: 0 0 12px rgba(0, 0, 0, 0.6);
          }
          .p1 {
            left: 12%;
            top: 22%;
            animation: particleMove 6s infinite ease-in-out;
            background: ${isDarkMode
              ? "rgba(14,211,8,0.9)"
              : "rgba(14,165,233,0.9)"};
          }
          .p2 {
            left: 42%;
            top: 12%;
            animation: particleMove 8s 0.6s infinite ease-in-out;
            background: ${isDarkMode
              ? "rgba(6,182,212,0.9)"
              : "rgba(255,179,71,0.9)"};
          }
          .p3 {
            left: 72%;
            top: 36%;
            animation: particleMove 7s 1.2s infinite ease-in-out;
            background: ${isDarkMode
              ? "rgba(255,179,0,0.9)"
              : "rgba(99,102,241,0.9)"};
          }
          .p4 {
            left: 22%;
            top: 72%;
            animation: particleMove 9s 0.2s infinite ease-in-out;
            background: ${isDarkMode
              ? "rgba(56,189,248,0.9)"
              : "rgba(6,182,212,0.9)"};
          }
          .p5 {
            left: 58%;
            top: 68%;
            animation: particleMove 5s 0.4s infinite ease-in-out;
            background: ${isDarkMode
              ? "rgba(99,102,241,0.9)"
              : "rgba(14,165,233,0.9)"};
          }
          .p6 {
            left: 86%;
            top: 18%;
            animation: particleMove 10s 0.9s infinite ease-in-out;
            background: ${isDarkMode
              ? "rgba(255,102,102,0.9)"
              : "rgba(255,179,71,0.9)"};
          }

          @keyframes particleMove {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0.06;
            }
            50% {
              transform: translateY(-18px) scale(1.25);
              opacity: 0.18;
            }
            100% {
              transform: translateY(0) scale(1);
              opacity: 0.06;
            }
          }

          .game-icons {
            position: absolute;
            right: -6%;
            top: 6%;
            width: 36%;
            height: 36%;
            opacity: 0.06;
            transform-origin: center;
            animation: iconsFloat 14s infinite ease-in-out;
          }
          @keyframes iconsFloat {
            0% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-10px) rotate(2deg);
            }
            100% {
              transform: translateY(0) rotate(0deg);
            }
          }
        `}</style>
      </div>
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
            className={`grid grid-cols-1 md:grid-cols-${tournaments.length % 2 == 0 ? 2 : 1} lg:grid-cols-${tournaments.length % 3 == 0 ? 3 : 2} gap-6 md:gap-7`}
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
                    ${isDarkMode ? "bg-linear-to-br from-[#020814] via-[#050d18] to-[#050b14]" : "bg-linear-to-br from-white via-gray-50 to-white"}
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
                      onClick={() => handleOpenModal(tournament)}
                      className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-colors duration-200 group-hover:border-cyan-300 group-hover:text-cyan-300 ${isDarkMode ? "border-slate-600/60 bg-slate-900/60 text-slate-300" : "border-gray-300 bg-gray-100 text-gray-600"}`}
                      aria-label="Join Tournament"
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
                        <CountdownTimer targetDate={tournament.dateTime} />
                      </div>
                    </div>
                    <div className="flex items-center">
                      {!userJoinedTournamentName.includes(
                        tournament.tournamentName,
                      ) ? (
                        <button
                          type="button"
                          onClick={() => handleOpenModal(tournament)}
                          className={buttonStyles}
                        >
                          <span className="relative z-10 flex items-center space-x-1">
                            <span>Join Now</span>
                            <span className="text-xs">▶</span>
                          </span>

                          {/* Animated Sweep Effect */}
                          <span className="absolute inset-0 -translate-x-full opacity-0 transition-all duration-400 ease-out bg-linear-to-r from-transparent via-white/60 to-transparent group-hover:translate-x-full group-hover:opacity-100" />
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

      {selectedTournament && (
        <MatchJoiningForm
          open={open}
          setOpen={setOpen}
          tournament={selectedTournament}
        />
      )}
    </section>
  );
};

export default UpcomingMatches;
