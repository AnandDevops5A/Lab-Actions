"use client";
import React, { useEffect, useState, useContext } from "react";
import { getUpcomingTournament } from "../../lib/api/backend-api";
import { getCache, setCache } from "../../lib/utils/action-redis";
import MatchJoiningForm from "../forms/match-joining-form";
import { Calendar, Trophy, Users, Swords, Zap, Clock } from "lucide-react";
import { ThemeContext } from "../../lib/contexts/theme-context";

const UpcomingMatches = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchUpcomingTournaments = async () => {
      try {
        // 1. Try Cache First for speed
        const cached = await getCache("upcomingTournament");
        if (cached?.status && Array.isArray(cached.data) && cached.data.length > 0) {
          if (isMounted) {
            setTournaments(cached.data);
            setLoading(false);
          }
          return;
        }

        // 2. Fetch from API
        const res = await getUpcomingTournament();
        if (isMounted) {
          if (res.ok) {
            setTournaments(res.data);
            // Update cache in background
            await setCache("upcomingTournament", res.data, 300);
          }
        }
      } catch (err) {
        console.error("Failed to fetch tournaments:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUpcomingTournaments();
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to parse custom YYYYMMDDHHmm format or standard dates
  const parseTournamentDate = (dateVal) => {
    if (!dateVal) return null;
    const dateStr = dateVal.toString();
    // Check if it matches YYYYMMDDHHmm format (12 digits)
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

  // Helper to format date  
  const formatDate = (dateVal) => {
    const date = parseTournamentDate(dateVal);
    if (!date || isNaN(date.getTime())) return "TBA";
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Countdown Component
  const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

    // Calculate time left
    useEffect(() => {
      const calculateTimeLeft = () => {
        const target = parseTournamentDate(targetDate);
        if (!target) return;
        const difference = target.getTime() - new Date().getTime();

        if (difference > 0) {
          setTimeLeft({
            d: Math.floor(difference / (1000 * 60 * 60 * 24)),
            h: Math.floor((difference / (1000 * 60 * 60)) % 24),
            m: Math.floor((difference / 1000 / 60) % 60),
            s: Math.floor((difference / 1000) % 60),
          });
        } else {
          setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        }
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
    }, [targetDate]);

    // Render countdown
    if (timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0) {
      return <span className="text-red-500 font-bold tracking-widest">STARTED</span>;
    }

    return (
      <div className={`flex items-center gap-2 text-xs Rusty Attack ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`}>
        <div className={`px-2 py-1 rounded border ${isDarkMode ? "bg-gray-900/80 border-gray-700" : "bg-gray-100 border-gray-300"}`}>
          <span className={`font-bold ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{String(timeLeft.d).padStart(2, '0')}</span>d
        </div>
        <span className="text-gray-600">:</span>
        <div className={`px-2 py-1 rounded border ${isDarkMode ? "bg-gray-900/80 border-gray-700" : "bg-gray-100 border-gray-300"}`}>
          <span className={`font-bold ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{String(timeLeft.h).padStart(2, '0')}</span>h
        </div>
        <span className="text-gray-600">:</span>
        <div className={`px-2 py-1 rounded border ${isDarkMode ? "bg-gray-900/80 border-gray-700" : "bg-gray-100 border-gray-300"}`}>
          <span className={`font-bold ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{String(timeLeft.m).padStart(2, '0')}</span>m
        </div>
        <span className="text-gray-600">:</span>
        <div className={`px-2 py-1 rounded border ${isDarkMode ? "bg-gray-900/80 border-gray-700" : "bg-gray-100 border-gray-300"}`}>
          <span className={`font-bold ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{String(timeLeft.s).padStart(2, '0')}</span>s
        </div>
      </div>
    );
  };

  return (
    <section
      id="tournaments"
      className={`py-20 border-t border-b relative overflow-hidden transition-colors duration-300 ${isDarkMode ? "bg-gray-950 border-gray-800/50" : "bg-blue-100 border-blue-200"}`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] ${isDarkMode ? "bg-purple-900/10" : "bg-purple-500/5"}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] ${isDarkMode ? "bg-red-900/10" : "bg-red-500/5"}`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ">
        <div className="text-center mb-16">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-red-500 via-orange-500 to-yellow-500 uppercase tracking-wider drop-shadow-sm mb-4">
           ⚔️ Upcoming Warzones
          </h2>
          <div className="h-1 w-24 bg-red-500 mx-auto rounded-full shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
        </div>

        {loading ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${(tournaments.length) % 3} gap-8`}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-80 rounded-2xl border animate-pulse ${isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-gray-200 border-gray-300"}`}
              ></div>
            ))}
          </div>
        ) : tournaments.length === 0 ? (
          <div className={`text-center py-20 rounded-2xl border border-dashed ${isDarkMode ? "bg-gray-900/30 border-gray-800" : "bg-gray-100 border-gray-300"}`}>
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
            <p className={`text-xl Rusty Attack ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              No active tournaments found. Check back later.
            </p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${(tournaments.length) % 3} gap-8`}>
          {tournaments.map((tournament, index) => (
            <div
              key={index}
                className={` group relative backdrop-blur-sm p-1 rounded-2xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] ${isDarkMode ? "bg-gray-900/80" : "bg-white/80 shadow-lg"}`}
            >
                {/* Gradient Border */}
                <div className={`absolute inset-0 bg-linear-to-br rounded-2xl -z-10 transition duration-500 opacity-50 group-hover:opacity-100 ${isDarkMode ? "from-gray-800 via-gray-800 to-gray-700 group-hover:from-red-500 group-hover:via-purple-500 group-hover:to-blue-500" : "from-gray-200 via-gray-100 to-gray-200 group-hover:from-red-400 group-hover:via-purple-400 group-hover:to-blue-400"}`}>

                </div>

                <div className={`h-full rounded-xl p-6 flex flex-col relative overflow-hidden ${isDarkMode ? "bg-gray-950" : "bg-slate-100"}`}>
                  {/* Decorative glow */}
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all animate-pulse" ></div>

                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <Zap size={12} /> Live
                    </span>
                    <span className={`text-xs Rusty Attack border px-2 py-1 rounded ${isDarkMode ? "text-gray-500 border-gray-800" : "text-gray-500 border-gray-200"}`}>
                      {tournament.platform || "MOBILE"}
                    </span>
                  </div>

                  <h3 className={`text-2xl font-bold mb-2 line-clamp-1 transition-colors ${isDarkMode ? "text-slate-100 group-hover:text-red-400" : "text-gray-900 group-hover:text-red-600"}`}>
                    {tournament.tournamentName}
                  </h3>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Prize Pool:</span>
                    <span className={`text-xl font-bold drop-shadow-[0_0_5px_rgba(250,204,21,0.4)] ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                     ₹ {tournament.prizePool}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6 grow">
                    <div className={`flex items-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <Calendar className="w-4 h-4 mr-3 text-blue-400" />
                      <span>{formatDate(tournament.dateTime)}</span>
                    </div>
                    <div className={`flex items-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <Users className="w-4 h-4 mr-3 text-green-400" />
                      <span>
                        {tournament.slot
                          ? `${tournament.slot} Slots`
                          : "Open Slots"}
                      </span>
                    </div>
                    <div className={`flex items-center text-sm pt-2 border-t ${isDarkMode ? "text-gray-400 border-gray-800/50" : "text-gray-600 border-gray-200"}`}>
                      <Clock className="w-4 h-4 mr-3 text-purple-400" />
                      <CountdownTimer targetDate={tournament.dateTime} />
                    </div>
                  </div>

                  {/* <button
                    onClick={() => setOpen(true)}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-slate-100 font-bold uppercase tracking-wider text-sm hover:from-red-500 hover:to-red-600 transition-all shadow-lg shadow-red-900/20 hover:shadow-red-500/40 flex items-center justify-center gap-2 group-hover:scale-[1.02] cursor-pointer"
                  >
                    <Swords size={16} /> Register Now
                  </button> */}
              </div>
            </div>
            ))}
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <MatchJoiningForm open={open} setOpen={setOpen} />
    </section>
  );
};

export default UpcomingMatches;
