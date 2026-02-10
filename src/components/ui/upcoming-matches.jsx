"use client";
import React, { useEffect, useState, useContext, useMemo } from "react";
import {
  getUpcomingTournament,
  getJoinersByTournamentIdList,
} from "../../lib/api/backend-api";
import { getCache, setCache } from "../../lib/utils/action-redis";
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
const buttonStyles = `
  relative overflow-hidden rounded-full px-4 py-2 font-semibold tracking-wide
  text-[11px] md:text-[12px] transition-all duration-300 ease-out
  bg-cyan-400/10 text-slate-100 border border-cyan-400/60
  group-hover:bg-amber-400 group-hover:text-slate-900 group-hover:border-amber-300
  group-hover:shadow-[0_0_25px_rgba(251,191,36,0.85)]
`;

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
  // console.log(userJoinedTournaments &&userJoinedTournamentIds);
  // const filteredTournaments = useMemo(() => {
  //   if (filter === "ALL") return tournaments;
  //   return tournaments.filter((t) => {
  //     const isJoined = userJoinedTournamentIds.includes(t._id) || userJoinedTournamentIds.includes(t.id);
  //     return filter === "JOINED" ? isJoined : !isJoined;
  //   });
  // }, [tournaments, filter, userJoinedTournamentIds]);

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
        className={`mt-1 text-[13px] font-semibold ${timeLeft === "STARTED" ? "text-red-500 animate-pulse" : "text-slate-200"}`}
      >
        {timeLeft}
      </p>
    );
  };

  const SkeletonCard = () => (
    <div className="w-[320px] md:w-[360px] h-[150px] rounded-2xl border border-[#101821] bg-linear-to-br from-[#020814] via-[#050d18] to-[#050b14] p-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gray-700"></div>
          <div>
            <div className="h-3 w-20 bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded mt-2"></div>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-700"></div>
      </div>
      <div className="flex items-center justify-between mt-6">
        <div className="h-6 w-24 bg-gray-700 rounded"></div>
        <div className="h-8 w-28 bg-gray-700 rounded-full"></div>
      </div>
    </div>
  );

  return (
    <section
      id="tournaments"
      className="min-h-screen flex flex-col items-center justify-center bg-[#021311] text-slate-100 pt-10 md:pt-0"
    >
      <h1 className="autoblur mb-10 text-[25px] md:text-4xl lg:text-5xl font-extrabold text-amber-300 drop-shadow-[0_0_30px_rgba(14,211,8,0.75)]">
        ⚔ Upcoming Warzones ⚔
      </h1>

      <div className="bg-[#020b0f]/80 rounded-3xl px-6 py-8 md:p-10 shadow-[0_0_60px_rgba(0,0,0,0.95)]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (tournaments.length === 0) ? (
          <div className="text-center py-20 px-10 rounded-2xl border border-dashed border-amber-500/20 bg-black/20  ">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-500/40" />
            <p className="text-xl font-bold text-amber-400/80 tracking-widest">
              No Active Warzones
            </p>
            <p className="text-gray-500 mt-2">
              Good to see you,  soldier 🫡.<br />
              New missions are being assigned. Check back soon...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
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
                    rounded-2xl border border-[#101821] ${style.accent}
                    bg-linear-to-br from-[#020814] via-[#050d18] to-[#050b14]
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
                        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                          {tournament.platform || "Mobile"}
                        </p>
                        <p className="text-[15px] font-semibold tracking-wide text-slate-50 line-clamp-1">
                          {tournament.tournamentName}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenModal(tournament)}
                      className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-600/60 bg-slate-900/60 text-slate-300 text-xs transition-colors duration-200 group-hover:border-cyan-300 group-hover:text-cyan-300"
                      aria-label="Join Tournament"
                    >
                      →
                    </button>
                  </div>

                  <div className="relative z-10 flex items-center justify-between px-5 pb-4 pt-3">
                    <div className="flex space-x-6 text-[11px] md:text-[12px] text-slate-400">
                      <div>
                        <p className="uppercase tracking-[0.2em]">Prize</p>
                        <p className="mt-1 text-[13px] font-semibold text-amber-300">
                          🏆 ₹{tournament.prizePool}
                        </p>
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.2em]">Starts In</p>
                        <CountdownTimer targetDate={tournament.dateTime} />
                      </div>
                    </div>
                    <div className="flex items-center">
                      {!userJoinedTournamentName.includes(tournament.tournamentName)? (
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
                        <div className="flex items-center space-x-2 text-[11px] md:text-[12px] font-medium text-cyan-400/80 uppercase tracking-widest">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          <span>Enrolled</span>
                        </div>
                      )}
                    </div>
                    
                  </div>
                  <hr className="border-slate-800" />
                  <div className="relative z-10 flex items-center justify-between px-5 py-2 text-slate-400 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span className="font-medium">
                        <span className="font-bold text-white">{joinedCount}</span>
                        <span className="text-slate-500"> / </span>
                        <span>{maxPlayers} Joined</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-green-400">
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
