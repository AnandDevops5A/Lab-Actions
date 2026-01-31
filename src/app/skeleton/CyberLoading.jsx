"use client";

import React from "react";

const CyberLoading = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-950 text-slate-100">
      {/* Hexagon/Cyber Shape Container */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer Rotating Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#00E5FF] border-b-[#00E5FF] animate-spin shadow-[0_0_20px_#00E5FF]"></div>
        
        {/* Inner Counter-Rotating Ring */}
        <div 
          className="absolute inset-4 rounded-full border-4 border-transparent border-l-[#FF0055] border-r-[#FF0055] animate-spin shadow-[0_0_20px_#FF0055]" 
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        ></div>
        
        {/* Center Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-900 rounded-full border border-gray-700 flex items-center justify-center shadow-inner relative overflow-hidden">
             <div className="absolute inset-0 bg-linear-to-t from-[#39ff14]/20 to-transparent animate-pulse"></div>
             <span className="text-[#39ff14] Rusty Attack text-xl font-bold animate-pulse">⚡</span>
          </div>
        </div>
      </div>

      {/* Loading Text & Bar */}
      <div className="mt-8 space-y-3 text-center w-64">
        <h2 className="text-xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-linear-to-r from-[#00E5FF] via-white to-[#FF0055] animate-pulse">
          SYSTEM LOAD
        </h2>
        
        {/* Cyber Progress Bar */}
        <div className="h-2 w-full bg-gray-900 rounded-full border border-gray-800 overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#00E5FF] to-transparent w-1/2 h-full animate-[shimmer_1.5s_infinite_linear]"></div>
        </div>
        
        <p className="text-[10px] Rusty Attack text-gray-500 uppercase tracking-widest">
          Initializing Neural Link...
        </p>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
};

export default CyberLoading;



