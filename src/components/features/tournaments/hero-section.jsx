"use client";
import Image from "next/image";
import { useState, useContext, use, useEffect } from "react";
import reloadingGunAsset from "../../../app/images/image.jpg";
import { ThemeContext } from "../../../lib/contexts/theme-context";
import dynamic from "next/dynamic";
import CyberLoading from "../../../app/skeleton/CyberLoading";
import { UserContext } from "../../../lib/contexts/user-context";
import { askLogin } from "../../../lib/utils/alert";
import { useRouter } from "next/navigation";
import { fetchUpcomingTournament, fetchUserTournaments } from "@/lib/utils/common";
import { ArrowDownNarrowWide } from "lucide-react";
// import MatchJoiningForm from "@/components/forms/match-joining-form";

const MatchJoiningForm = dynamic(() => import("../../forms/match-joining-form"), {
  loading: () => <CyberLoading />,
  ssr: false, // optional: disable SSR
});



//get upcoming tournament details and check if user has joined all tournament or not
const checkJoinedTournament = async (userId) => {
  if (!userId) return false;

  const upcomingTournament = await fetchUpcomingTournament();
  const userTournaments = await fetchUserTournaments(userId);

  if (!upcomingTournament || !Array.isArray(upcomingTournament)) {
    return false;
  }
  if (upcomingTournament.length === 0) {
    return true;
  }

  if (!userTournaments || !Array.isArray(userTournaments)) {
    return false;
  }

  const joinedIds = new Set(userTournaments.map((t) => String(t.tournamentName || t.id)));
  const allJoined = upcomingTournament.every((t) => joinedIds.has(String(t.tournamentName || t.id)));

  return allJoined;
};




const HeroSection = () => {
  const [tournamentStatus, settournamentStatus] = useState(false);
  const themeContext = useContext(ThemeContext);
  const { isDarkMode } = themeContext || { isDarkMode: true };
  const [showForm, setShowForm] = useState(false);
  const { user } = use(UserContext);
  const router = useRouter();
  const [upcomingTournament, setUpcomingTournament] = useState(null);

  const buttonClasses =
    "flex flex-col sm:flex-row justify-center space-x-auto space-y-4 sm:space-y-0 gap-3";
useEffect(() => {
    if (user?.id) {
      checkJoinedTournament(user.id).then((data) => settournamentStatus(data));
    }
  }, [user, showForm]);

useEffect(() => {
    let mounted = true;
    fetchUpcomingTournament().then((res) => {
      if (!mounted) return;
      if (res && Array.isArray(res) && res.length > 0) {
        setUpcomingTournament(res[0]);
      }
    }).catch(() => {});
    return () => { mounted = false };
  }, []);


   
  return (
    <section
      className={`relative  h-[97vh] flex items-center justify-center pt-10 overflow-hidden transition-colors duration-300 ${
        isDarkMode
          ? "bg-linear-to-b from-gray-950 via-slate-950 to-gray-950"
          : "bg-linear-to-b from-blue-300 via-blue-400 to-blue-500"
      }`}
      id="hero"
    >
      {showForm && <MatchJoiningForm open={showForm} setOpen={setShowForm} />}
      {/* Background Visual with Professional Effects */}
      <Image
        src={reloadingGunAsset}
        alt="Animated background showing a gun reloading"
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
        priority
        quality={75}
        placeholder="blur"
        className={`${
          isDarkMode ? "opacity-40" : "opacity-30"
        } saturate-125 brightness-${
          isDarkMode ? "50" : "75"
        } transition-all duration-700 ease-in-out animate-zoomLoop`}
      />

      {/* Professional Overlay with Theme-Aware Gradient */}
      <div
        className={`absolute inset-0 z-0 transition-colors duration-300 ${
          isDarkMode
            ? "bg-linear-to-b from-black/40 via-black/60 to-black/50"
            : "bg-linear-to-b from-white/20 via-white/40 to-white/30"
        }`}
      ></div>

      {/* Animated Accent Lights - Theme Aware */}
      {isDarkMode ? (
        <>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse z-0"></div>
          <div
            className="absolute bottom-25 right-7 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse z-0"
            style={{ animationDelay: "1s" }}
          ></div>
        </>
      ) : (
        <>
          <div className="absolute top-20 left-10 w-72 h-72  rounded-full blur-3xl  z-0"></div>
          <div
            className="absolute bottom-20 right-10 w-72 h-72  rounded-full blur-3xl  z-0"
            style={{ animationDelay: "1s" }}
          ></div>
        </>
      )}

      {/* Hero Content */}
      <div className="relative text-center max-w-4xl px-4 z-10 animate-slideInUp">
        {/* Professional H1 */}
        {tournamentStatus ? (
          <h1
            className={`text-3xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tighter drop-shadow-2xl leading-tight hover-lift duration-500 transition-colors ${
              isDarkMode ? "text-slate-200" : "text-slate-700"
            }`}
          >
            <span
              className={`font-black inline-block mx-2 ` }
            >
                          Grab your <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-pink-500 animate-gradientFlow">Bounty</span>
            </span>
          </h1>
        ) : (
          <h1
            className={`text-[55px] md:text-7xl lg:text-[90px] font-black mb-6 tracking-tighter drop-shadow-2xl leading-tight  transition-colors ${
              isDarkMode ? "text-slate-200" : "text-slate-800"
            }`}
          >
                        Waiting for <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-pink-500 animate-gradientFlow">you</span>

            <span
              className={`inline-block ${
                isDarkMode
                  ? "bg-linear-to-r from-red-500 to-pink-500 bg-clip-text text-transparent"
                  : "bg-linear-to-r from-red-600 to-pink-600 bg-clip-text text-transparent"
              }`}
            ></span>
            <span className="animate-bounce">🎉</span>
          </h1>
        )}

        {/* Professional Subtitle */}
        <div
          className={`mb-4 text-sm md:text-base font-semibold tracking-widest uppercase ${
            isDarkMode ? "text-cyan-400" : "text-blue-600"
          }`}
        >
          Elite Tournament Platform
        </div>

        {/* Professional Description */}
        <p
          className={`animate-slideInDown text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-lg font-light leading-relaxed transition-colors ${
            isDarkMode ? "text-gray-200" : "text-slate-700"
          }`}
        >
          {/* <TypingWrapper> */}
          Unleash your skill into raw Bounty💰.
          <br />
          Dominate {""}
          <span
            className={`font-semibold ${
              isDarkMode ? "text-cyan-300" : "text-blue-600"
            }`}
          >
            official tournaments,
          </span>{" "}
          crush rivals, and carve your legacy in fire.
          {/* </TypingWrapper> */}
        </p>

        {/* Stats Row - Professional Touch */}
        <div
          className={`grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10 p-6 rounded-2xl backdrop-blur-md border transition-all ${
            isDarkMode
              ? "bg-gray-900/40 border-gray-800/50"
              : "bg-white/40 border-white/50"
          }`}
        >
          <div className="text-center">
            <div
              className={`text-3xl font-black mb-2 ${
                isDarkMode ? "text-cyan-400" : "text-blue-600"
              }`}
            >
              1000+
            </div>
            <div
              className={`text-xs font-medium tracking-widest uppercase ${
                isDarkMode ? "text-gray-400" : "text-slate-600"
              }`}
            >
              Players
            </div>
          </div>
          <div
            className="text-center border-l border-r border-opacity-20"
            style={{
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
            }}
          >
            <div
              className={`text-3xl font-black mb-2 ${
                isDarkMode ? "text-purple-400" : "text-indigo-600"
              }`}
            >
              50+
            </div>
            <div
              className={`text-xs font-medium tracking-widest uppercase ${
                isDarkMode ? "text-gray-400" : "text-slate-600"
              }`}
            >
              Tournaments
            </div>
          </div>
          <div className="text-center">
            <div
              className={`text-3xl font-black mb-2 ${
                isDarkMode ? "text-pink-400" : "text-red-600"
              }`}
            >
              10L+
            </div>
            <div
              className={`text-xs font-medium tracking-widest uppercase ${
                isDarkMode ? "text-gray-400" : "text-slate-600"
              }`}
            >
              Prize Pool
            </div>
          </div>
        </div>

        {/* Professional Call to Action Buttons */}
        <div className={`${buttonClasses} justify-center items-center`}>
          <button
            onClick={() => {
              if (user ){ 
                setShowForm(true)}
              else askLogin(router);
              
            }}
            disabled={!tournamentStatus}
            className={`group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold uppercase tracking-widest transition-all duration-300 hover-lift rounded-lg overflow-hidden
               ${tournamentStatus ? (isDarkMode ? "bg-gray-700/50 cursor-not-allowed hover:shadow-none" : "bg-gray-200/50 cursor-not-allowed hover:shadow-none") :
                 (isDarkMode ? "bg-red-600/70 hover:bg-red-600/90" : "bg-red-500/70 hover:bg-red-500/90") }`}
          >
            <div
              className={`absolute inset-0 ${
                isDarkMode
                  ? "bg-linear-to-r from-red-600 to-red-700 shadow-lg shadow-red-500/50 group-hover:shadow-red-500/80"
                  : "bg-linear-to-r from-red-500 to-red-600 shadow-md shadow-red-400/40 group-hover:shadow-red-400/60"
              } transition-all duration-300 rounded-lg`}
            ></div>
            <span className={`relative flex items-center gap-2 text-slate-100 font-bold ${isDarkMode ? "text-cyan-400" : "text-blue-600"} `}>
              {tournamentStatus ? "All Joined ✅🫡" : "Join Tournament 🤺🎮"}
            </span>
          </button>

          <button
            onClick={() => {
              // Navigate to live viewer with tournament query
              const q = upcomingTournament?.tournamentName || upcomingTournament?.id || 'game tournament';
              const tid = upcomingTournament?.id || '';
              router.push(`/live?q=${encodeURIComponent(q)}${tid ? `&tournamentId=${encodeURIComponent(tid)}` : ''}`);
            }}
            className={`group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold uppercase tracking-widest border-2 rounded-lg transition-all duration-300 hover-lift hover-glow ${
              isDarkMode
                ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                : "border-blue-600 text-blue-600 hover:bg-blue-600/10"
            }`}
          >
            Watch Tournament 🖥️
          </button>
        </div>

        {/* Scroll Indicator */}
        <ArrowDownNarrowWide
          className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce transition-colors ${
            isDarkMode ? "text-cyan-400" : "text-blue-600"
          }`}
        />
          
      </div>
    </section>
  );
};

export default HeroSection;
