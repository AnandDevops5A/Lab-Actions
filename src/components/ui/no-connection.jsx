"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export const NoConnection = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Ensure code runs only in browser
    if (typeof window === "undefined") return;

    // Set initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md">
      <div className="text-center space-y-6 p-8 border border-[#FF0055] bg-gray-900/90 shadow-[0_0_30px_rgba(255,0,85,0.4)] rounded-xl max-w-md mx-4 relative overflow-hidden">
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%]" />

        <div className="relative z-10">
          <WifiOff className="w-20 h-20 mx-auto text-[#FF0055] animate-pulse mb-4" />

          <h2 className="text-3xl font-black tracking-widest text-[#00E5FF] drop-shadow-[0_0_5px_#00E5FF] mb-2">
            OFFLINE
          </h2>

          <p className="text-gray-400 font-mono text-sm mb-6">
            Network uplink severed. Check your connection module.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-[#FF0055] hover:bg-[#D40046] text-white font-bold uppercase tracking-wider transition-all hover:shadow-[0_0_15px_#FF0055] cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            RECONNECT
          </button>
        </div>
      </div>
    </div>
  );
};
