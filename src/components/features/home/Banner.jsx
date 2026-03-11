import React, { useContext, useEffect, useState } from 'react';
import { Trophy, Users, Calendar, Shield, ChevronRight } from 'lucide-react';
import { ThemeContext } from '@/lib/contexts/theme-context';
import { getLastTournamentTopPlayers } from '@/lib/api/backend-api';
import { errorMessage } from '@/lib/utils/alert';
import CyberLoading from '@/app/skeleton/CyberLoading';
const dummyplayers = [
    { id: 1, name: 'X_PHANTOM_X', rank: '1', score: '15,400', color: 'border-cyan-400', img: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'NEON_KNIGHT', rank: '2', score: '12,100', color: 'border-pink-500', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { id: 3, name: 'CYBER_SAM', rank: '3', score: '11,850', color: 'border-yellow-400', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
    { id: 4, name: 'GLITCH_01', rank: '4', score: '10,200', color: 'border-green-400', img: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80&w=200' },
    { id: 5, name: 'VOID_WALKER', rank: '5', score: '9,900', color: 'border-purple-500', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
  ];
const Banner = () => {
  const{isdarkMode} = useContext(ThemeContext) ;
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadLastTournamentPlayers = async () => {
    try {
      // Simulate API call delay
      const res=await getLastTournamentTopPlayers();
      if(res.status){
        setPlayers(res.data);
      } else {
        setPlayers(dummyplayers);
        errorMessage("Failed to load player data. Displaying dummy data.");
      }
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLastTournamentPlayers();
  },[]);

  if (loading) {
    return <CyberLoading />;
  }

  if (players?.length === 0) {
    return (
      <div className={`h-screen flex items-center justify-center transition-colors duration-500 font-sans ${!isdarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        
        

        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-700 p-4">
          <div className="relative inline-block">
             <div className={`absolute inset-0 blur-xl opacity-50 ${!isdarkMode ? 'bg-cyan-500' : 'bg-pink-500'}`}></div>
             <Shield size={80} className={`relative z-10 ${!isdarkMode ? 'text-cyan-400' : 'text-pink-600'}`} />
          </div>
          
          <div>
            <h2 className={`text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-2 ${!isdarkMode ? 'text-white' : 'text-slate-900'}`}>
              System <span className={!isdarkMode ? 'text-cyan-400' : 'text-pink-600'}>Offline</span>
            </h2>
            <p className={`text-sm font-bold tracking-[0.3em] uppercase ${!isdarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              No Active Players Detected
            </p>
          </div>

          <p className={`max-w-md mx-auto text-lg leading-relaxed ${!isdarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            The grid is silent. Be the first to register and claim your spot on the leaderboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex items-center justify-center transition-colors duration-500 font-sans ${!isdarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      

      <main className="max-w-7xl mx-auto p-4 md:p-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          
          {/* LEFT SECTION: TOURNAMENT DETAILS */}
          <section className="flex-1 flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="relative">
              <div className={`absolute -left-4 top-0 w-1 h-full ${!isdarkMode ? 'bg-cyan-400' : 'bg-pink-500'} animate-pulse`}></div>
              <h2 className={`text-sm font-black tracking-[0.3em] uppercase mb-2 ${!isdarkMode ? 'text-cyan-400' : 'text-pink-600'}`}>
                Active Championship // Sector 07
              </h2>
              <h1 className={`text-6xl md:text-8xl font-black italic uppercase leading-none ${!isdarkMode ? 'text-white' : 'text-slate-900'}`}>
                Neon <br /> <span className={`not-italic ${!isdarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600' : 'text-pink-600'}`}>Assault</span>
              </h1>
            </div>

            <p className={`max-w-md text-lg leading-relaxed ${!isdarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              The ultimate high-stakes digital arena. 64 teams enter, but only one emerges from the grid with the <span className={!isdarkMode ? 'text-cyan-400 font-bold' : 'text-pink-600 font-bold'}>Mainframe Trophy</span>.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Trophy, label: 'Prize Pool', value: '$50,000' },
                { icon: Users, label: 'Registered', value: '48 / 64' },
                { icon: Calendar, label: 'Starts In', value: '02d 14h' },
                { icon: Shield, label: 'Tier', value: 'Diamond' },
              ].map((stat, i) => (
                <div key={i} className={`p-4 border-l-4 transition-all hover:translate-x-2 ${
                  !isdarkMode ? 'bg-slate-900/50 border-cyan-400/50 hover:bg-slate-900' : 'bg-white border-pink-500/50 hover:bg-slate-100 shadow-md'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon size={16} className={!isdarkMode ? 'text-cyan-400' : 'text-pink-500'} />
                    <span className="text-xs uppercase font-bold tracking-widest opacity-60">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-black uppercase italic">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className={`px-8 py-4 font-black uppercase tracking-tighter transition-all hover:-skew-x-12 relative group ${
                !isdarkMode ? 'bg-cyan-400 text-black' : 'bg-slate-900 text-white'
              }`}>
                <span className="relative z-10 flex items-center gap-2">Register Now <ChevronRight size={20} strokeWidth={3} /></span>
                <div className={`absolute inset-0 translate-x-1 translate-y-1 -z-10 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 ${!isdarkMode ? 'bg-pink-500' : 'bg-pink-400'}`}></div>
              </button>
              <button className={`px-8 py-4 font-black uppercase border-2 transition-all hover:bg-white hover:text-black ${
                !isdarkMode ? 'border-white text-white' : 'border-slate-900 text-slate-900'
              }`}>
                Ruleset
              </button>
            </div>
          </section>

          {/* RIGHT SECTION: TOP 5 PLAYERS GALLERY */}
          <section className="flex-1 relative group h-[600px] md:h-auto">
            <div className="h-full flex flex-col gap-2">
              
              {/* Rank 1 (Top 50%) */}
              <div className="relative h-1/2 overflow-hidden clip-path-cyber-1 group/p1">
                <img 
                  src={players[0].img} 
                  alt={players[0].name}
                  className="w-full h-full object-cover grayscale transition-all duration-500 group-hover/p1:grayscale-0 group-hover/p1:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                  <span className={`text-6xl font-black italic leading-none ${!isdarkMode ? 'text-cyan-400' : 'text-pink-500'}`}>#01</span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{players[0].name}</h3>
                  <p className="text-xs font-bold text-white/60 tracking-[0.2em]">{players[0].score} PTS</p>
                </div>
                <div className={`absolute top-4 right-4 px-2 py-1 text-[10px] font-black uppercase -skew-x-12 ${!isdarkMode ? 'bg-cyan-400 text-black' : 'bg-pink-600 text-white'}`}>
                  Current Leader
                </div>
              </div>

              {/* Grid for Ranks 2-5 (Bottom 50%) */}
              <div className="h-1/2 grid grid-cols-2 md:grid-cols-4 gap-2">
                {players.slice(1).map((player, idx) => (
                  <div key={player.id} className="relative overflow-hidden group/px">
                    <img 
                      src={player.img} 
                      alt={player.name}
                      className="w-full h-full object-cover grayscale group-hover/px:grayscale-0 group-hover/px:scale-110 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover/px:bg-black/10 transition-colors"></div>
                    <div className="absolute bottom-2 left-3">
                      <span className="text-xl font-black italic text-white/80">#0{player.rank}</span>
                      <h4 className="text-[10px] font-black text-white uppercase truncate w-24">{player.name}</h4>
                    </div>
                    {/* Decorative corner */}
                    <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${!isdarkMode ? 'border-cyan-400' : 'border-pink-500'}`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Background Glitch Elements */}
            <div className={`absolute -z-10 -right-8 -bottom-8 w-64 h-64 border-8 opacity-10 animate-pulse ${!isdarkMode ? 'border-cyan-400' : 'border-pink-500'}`}></div>
            <div className={`absolute -z-10 top-20 -right-4 text-9xl font-black opacity-5 select-none ${!isdarkMode ? 'text-white' : 'text-slate-900'}`}>LEADERBOARD</div>
          </section>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .clip-path-cyber-1 {
          clip-path: polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%);
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default Banner;
