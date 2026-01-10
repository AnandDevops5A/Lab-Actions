"use client";
import Image from "next/image";
import { useState } from "react";
import reloadingGunAsset from "../images/image.jpg";
import TypingWrapper from "./TypingAnimation";

const HeroSection = () => {
  const { tournamentStatus, registerForTournament } = useState("false");

  const buttonClasses =
    "flex flex-col sm:flex-row justify-center space-x-auto space-y-4 sm:space-y-0 gap-3";

  return (
    <section
      className="relative h-[97vh] flex items-center justify-center pt-10 overflow-hidden"
      id="hero" 
    >
      {/* 🔫 New Background Visual (GIF/Video) */}
      <Image
        src={reloadingGunAsset}
        alt="Animated background showing a gun reloading"
        fill
        style={{ objectFit: "cover" }}
        priority={true}
        // Increased opacity/saturation for better visibility, and a slightly darker tint
        className="opacity-40 saturate-150 brightness-75 transition-all duration-700 ease-in-out  animate-zoomLoop"
      />

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/3 z-0"></div>

      {/* Hero Content */}
      <div className="relative  text-center max-w-4xl px-4">
        {/* Updated H1 to be clean and punchy */}

        {tournamentStatus ? (
          <h1 className=" text-7xl md:text-6xl font-black mb-4 tracking-tight text-white drop-shadow-2xl leading-tight">
            The <span className="text-red-500">WAR</span> on
            <span className="inline-block ml-4 text-cyan-400">FPS</span>
          </h1>
        ) : (
          <h1 className="text-7xl md:text-6xl font-black mb-4 tracking-tight text-white drop-shadow-2xl leading-tight animate-bounce">
            Comming <span className="text-red-500 ">Soon</span> . .
          </h1>
        )}

        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-lg ">
          <TypingWrapper>
          Convert skill to Bounty💰. Compete in **official tournaments**, climb
          the ranks, and earn your legacy.</TypingWrapper>
        </p>

        {/* Primary Call to Action */}
        <div className={buttonClasses}>
          <button
            onClick={() => {
              document.dispatchEvent(new CustomEvent("openJoinForm"));
              // keep the original behaviour of navigating to tournaments
              window.location.hash = "#tournaments";
            }}
            className=" border bg-red-600 hover:bg-red-700 text-white text-md px-8 py-3 rounded-lg font-bold transition duration-300 shadow-2xl shadow-red-500/50 uppercase tracking-widest"
          >
            Join Now 🐱‍👤
          </button>
          <button className="border border-cyan-400 text-cyan-400 hover:bg-cyan-900/50 text-md px-10 py-3 rounded-lg font-bold transition duration-300 uppercase tracking-widest">
            Watch Live 🖥️
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
