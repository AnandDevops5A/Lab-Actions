import React, { useContext, useEffect, useState } from 'react';
import { Trophy, Users, Calendar, Shield, ArrowUpRight, Radio } from 'lucide-react';
import { ThemeContext } from '@/lib/contexts/theme-context';
import { BannerSkeleton } from '@/app/skeleton/Skeleton';
import { loadLastTournamentTopPlayers, FormatDate } from '@/lib/utils/common';

/**
 * Design tokens
 * ------------------------------------------------------------------
 * Dark  : void #0a0710  panel #150f26  cyan #00f0ff  magenta #ff2e6e  amber #ffb627
 * Light : mist #f4f1fb  panel #ffffff  magenta #c4006a  cyan   #007d91  amber #b8790a
 * Display : 'Chakra Petch'  |  Body : 'Inter'  |  Data/HUD : 'JetBrains Mono'
 */

const Banner = () => {
  const { isdarkMode } = useContext(ThemeContext);
  const isDark = !isdarkMode; // preserves existing theme-context polarity
  const [players, setPlayers] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLastTournamentTopPlayers().then(data => {
      if (data) {
        setTournament(data.tournament);
        setPlayers(data.players || []);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <BannerSkeleton />;
  }

  const nameParts = tournament?.tournamentName?.split(' ') || ['Past', 'Tournament'];
  const mainName = nameParts[0];
  const subName = nameParts.slice(1).join(' ');

  const stats = tournament ? [
    { icon: Trophy, label: 'PRIZE_POOL', value: `$${(tournament.prizePool || 0).toLocaleString()}` },
    { icon: Users, label: 'PLAYERS', value: `${tournament.participantsCount || 0}/${tournament.maxPlayers || 0}` },
    { icon: Calendar, label: 'CONCLUDED', value: tournament.dateTime ? <FormatDate dateNum={tournament.dateTime} /> : 'N/A' },
    { icon: Shield, label: 'TIER', value: tournament.tier || 'N/A' },
  ] : [];

  return (
    <div
      className={`relative h-screen overflow-hidden flex items-center justify-center transition-colors duration-500 ${
        isDark ? 'bg-[#0a0710] text-[#f1edf7]' : 'bg-[#f4f1fb] text-[#1a1330]'
      }`}
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Circuit-grid backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(${isDark ? '#00f0ff' : '#c4006a'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#00f0ff' : '#c4006a'} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, transparent 40%, #0a0710 95%)'
            : 'radial-gradient(ellipse at center, transparent 50%, #f4f1fb 95%)',
        }}
      />

      <main className="relative max-w-7xl mx-auto p-4 md:p-8 w-full">
        <div className="flex flex-col lg:flex-row gap-10 items-center">

          {/* LEFT — TOURNAMENT DETAILS */}
          <section className="flex-1 flex flex-col justify-center space-y-7 banner-fade">
            {tournament ? (
              <>
                <div className="flex items-center gap-2">
                  <Radio size={13} className={isDark ? 'text-[#00f0ff]' : 'text-[#c4006a]'} />
                  <span
                    className={`text-[11px] uppercase tracking-[0.35em] ${isDark ? 'text-[#00f0ff]' : 'text-[#c4006a]'}`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Last_Transmission // {tournament.status || 'ARCHIVED'}
                  </span>
                </div>

                <h1
                  className="text-5xl md:text-7xl leading-[0.92] uppercase font-bold tracking-tight"
                  style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                >
                  {mainName}
                  <br />
                  <span className={isDark ? 'text-[#ff2e6e]' : 'text-[#007d91]'}>{subName}</span>
                </h1>

                <p className={`max-w-md text-base leading-relaxed ${isDark ? 'text-[#948dab]' : 'text-[#6b6280]'}`}>
                  {tournament.description || 'Relive the last grid battle — one squad walked away with the Mainframe Trophy.'}
                </p>

                {/* Stat readouts */}
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  {stats.map((stat, i) => (
                    <div
                      key={i}
                      className={`px-4 py-3 border-l-2 transition-colors ${
                        isDark
                          ? 'bg-[#150f26] border-[#00f0ff]/40 hover:border-[#00f0ff]'
                          : 'bg-white border-[#c4006a]/40 hover:border-[#c4006a] shadow-sm'
                      }`}
                    >
                      <div
                        className={`flex items-center gap-1.5 mb-1 text-[10px] tracking-[0.2em] ${isDark ? 'text-[#948dab]' : 'text-[#6b6280]'}`}
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        <stat.icon size={12} className={isDark ? 'text-[#00f0ff]' : 'text-[#c4006a]'} />
                        {stat.label}
                      </div>
                      <div
                        className="text-xl font-bold"
                        style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                      >
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    className={`px-7 py-3.5 text-sm font-bold uppercase tracking-wide transition-transform hover:-translate-y-0.5 flex items-center gap-2 ${
                      isDark ? 'bg-[#00f0ff] text-[#0a0710]' : 'bg-[#1a1330] text-white'
                    }`}
                    style={{ fontFamily: "'Chakra Petch', sans-serif", clipPath: 'polygon(0 0, 100% 0, 100% 70%, 94% 100%, 0 100%)' }}
                  >
                    View Full Recap <ArrowUpRight size={16} strokeWidth={3} />
                  </button>
                  <button
                    className={`px-7 py-3.5 text-sm font-bold uppercase tracking-wide border transition-colors ${
                      isDark ? 'border-[#948dab]/40 text-[#f1edf7] hover:border-[#ff2e6e] hover:text-[#ff2e6e]' : 'border-[#1a1330]/30 hover:border-[#c4006a] hover:text-[#c4006a]'
                    }`}
                    style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                  >
                    Watch VOD
                  </button>
                </div>
              </>
            ) : (
              <div
                className={`border-l-2 pl-6 py-2 ${isDark ? 'border-[#ff2e6e]/50' : 'border-[#c4006a]/50'}`}
              >
                <span
                  className={`text-[11px] uppercase tracking-[0.3em] ${isDark ? 'text-[#ff2e6e]' : 'text-[#c4006a]'}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  No_Signal
                </span>
                <h1
                  className="text-4xl md:text-6xl uppercase font-bold mt-2"
                  style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                >
                  Archive Empty
                </h1>
                <p className={`max-w-md text-base leading-relaxed mt-3 ${isDark ? 'text-[#948dab]' : 'text-[#6b6280]'}`}>
                  No tournament has concluded yet — results will populate here once one wraps.
                </p>
              </div>
            )}
          </section>

          {/* RIGHT — TOP PLAYERS */}
          <section className="flex-1 relative h-[560px] md:h-[600px] w-full">
            {players && players.length > 0 ? (
              <div className="h-full flex flex-col gap-2">
                {/* Rank 1 */}
                {players[0] && (
                  <div className="relative h-1/2 overflow-hidden clip-path-cyber-1 group/p1">
                    <img
                      src={players[0]?.img}
                      alt={players[0]?.name}
                      className="w-full h-full object-cover grayscale transition-all duration-500 group-hover/p1:grayscale-0 group-hover/p1:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

                    {/* HUD corner brackets */}
                    {['top-3 left-3 border-t-2 border-l-2', 'top-3 right-3 border-t-2 border-r-2', 'bottom-3 left-3 border-b-2 border-l-2', 'bottom-3 right-3 border-b-2 border-r-2'].map((pos, idx) => (
                      <div key={idx} className={`absolute w-4 h-4 ${pos} ${isDark ? 'border-[#00f0ff]' : 'border-[#c4006a]'}`} />
                    ))}

                    {/* Scanline sweep — signature motion */}
                    <div
                      className={`absolute left-0 right-0 h-8 opacity-0 group-hover/p1:opacity-100 scanline ${isDark ? 'bg-[#00f0ff]/10' : 'bg-[#c4006a]/10'}`}
                    />

                    <div
                      className={`absolute top-4 right-4 px-2 py-1 text-[10px] tracking-[0.15em] uppercase ${
                        isDark ? 'bg-[#00f0ff] text-[#0a0710]' : 'bg-[#c4006a] text-white'
                      }`}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Target_Lock :: 01
                    </div>

                    <div className="absolute bottom-4 left-6">
                      <span
                        className={`text-5xl font-bold leading-none ${isDark ? 'text-[#ff2e6e]' : 'text-[#ffb627]'}`}
                        style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                      >
                        #{String(players[0].rank).padStart(2, '0')}
                      </span>
                      <h3
                        className="text-2xl text-white uppercase tracking-tight font-bold"
                        style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                      >
                        {players[0]?.name}
                      </h3>
                      <p
                        className="text-xs text-white/70 tracking-[0.2em]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {players[0]?.score} PTS
                      </p>
                    </div>
                  </div>
                )}

                {/* Ranks 2–5 */}
                <div className="h-1/2 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {players.slice(1).map((player) => (
                    <div key={player.id} className="relative overflow-hidden group/px">
                      <img
                        src={player.img}
                        alt={player.name}
                        className="w-full h-full object-cover grayscale group-hover/px:grayscale-0 group-hover/px:scale-105 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-black/45 group-hover/px:bg-black/15 transition-colors" />
                      <div className="absolute bottom-2 left-2.5">
                        <span
                          className="text-lg text-white/85 font-bold"
                          style={{ fontFamily: "'Chakra Petch', sans-serif" }}
                        >
                          #{String(player.rank).padStart(2, '0')}
                        </span>
                        <h4 className="text-[10px] font-bold text-white uppercase truncate w-24">{player.name}</h4>
                      </div>
                      <div className={`absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 ${isDark ? 'border-[#00f0ff]/70' : 'border-[#c4006a]/70'}`} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`h-full flex items-center justify-center text-center p-8 border ${isDark ? 'bg-[#150f26] border-[#948dab]/20' : 'bg-white border-[#1a1330]/10'}`}>
                <p
                  className={`text-sm tracking-widest uppercase ${isDark ? 'text-[#948dab]' : 'text-[#6b6280]'}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  No_Player_Data
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

        .clip-path-cyber-1 {
          clip-path: polygon(0 0, 100% 0, 100% 85%, 92% 100%, 0 100%);
        }
        @keyframes banner-fade-in {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .banner-fade {
          animation: banner-fade-in 0.6s ease-out both;
        }
        @keyframes scanline-sweep {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .scanline {
          top: -10%;
          animation: scanline-sweep 1.8s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .banner-fade, .scanline { animation: none; }
        }
      `}} />
    </div>
  );
};

export default Banner;