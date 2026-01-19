"use client";

import React, { lazy, Suspense, useContext, useState, useCallback } from "react";
import { SkeletonChart } from "../skeleton/Skeleton";
import Login from "./Login.jsx";
import { ThemeContext } from "../Library/ThemeContext";

const Signup = lazy(() => import("./Signup"));

// Extract styles to avoid re-allocation on every render
const INLINE_STYLES = `
  @keyframes glow-pulse { 0%,100%{box-shadow:0 0 15px rgba(0,229,255,0.6),0 0 5px rgba(255,65,112,0.6);} 50%{box-shadow:0 0 25px rgba(0,229,255,0.8),0 0 10px rgba(255,65,112,0.8);} }
  .neon-glow-frame { animation: glow-pulse 5s infinite alternate; border:2px solid; border-image: linear-gradient(to right,#00E5FF,#FF4170) 1; border-radius:1rem }
  .forms-viewport { perspective:1200px; backface-visibility: hidden; }
  .form-visible { opacity:1; transform: translateX(0) rotateY(0deg) scale(1); z-index:2; pointer-events:auto; transition: transform 700ms cubic-bezier(.2,.9,.3,1), opacity 600ms ease; }
  .form-hidden-left { opacity:0; transform: translateX(-18%) rotateY(18deg) scale(.98); z-index:1; pointer-events:none; transition: transform 700ms cubic-bezier(.2,.9,.3,1), opacity 600ms ease; }
  .form-hidden-right { opacity:0; transform: translateX(18%) rotateY(-18deg) scale(.98); z-index:1; pointer-events:none; transition: transform 700ms cubic-bezier(.2,.9,.3,1), opacity 600ms ease; }
  .arrow-pulse { animation: arrowPulse 1.6s infinite; }
  @keyframes arrowPulse { 0%{transform:translateX(0);opacity:.9}50%{transform:translateX(4px);opacity:1}100%{transform:translateX(0);opacity:.9} }
  .group:focus-within svg, .group:hover svg { filter: drop-shadow(0 6px 18px rgba(0,229,255,0.12)); transform: translateY(-1px); transition: all .24s ease; }
`;

export default function Page() {
  const [mode, setMode] = useState("login");
  const [signupLoaded, setSignupLoaded] = useState(false); // Track if signup has been requested
  const isLogin = mode === "login";

  // Get theme context
  const themeContext = useContext(ThemeContext);
  const { isDarkMode } = themeContext || { isDarkMode: true };

  // Memoize switch handler to prevent unnecessary re-renders of children
  const handleSwitch = useCallback((newMode) => {
    setMode(newMode);
    if (newMode === "signup") {
      setSignupLoaded(true);
    }
  }, []);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 antialiased relative
	 ${
     isDarkMode
       ? "bg-[radial-gradient(ellipse_at_top_left,#0f172a_0%,#1e293b_60%)]"
       : "bg-[radial-gradient(ellipse_at_top_left,#93c5fd_0%,#fef9c3_90%)]"
   }`}
    >
      <style>{INLINE_STYLES}</style>

      <div className="absolute inset-0 bg-black/30 z-0"></div>

      <div className="w-full max-w-md mx-auto relative  top-10">
        <div
          className={`relative w-full  ${
            isDarkMode
              ? "bg-black/30 neon-glow-frame"
              : "bg-white/30 shadow-slate-500 shadow-inner"
          } transition-all 
          duration-500 ease-in-out rounded-xl ${
            isLogin ? "min-h-[420px] p-3" : "min-h-[500px]"
          }`}
        >
          <div className="relative w-full overflow-visible">
            <div
              className={`absolute top-0 w-full forms-viewport ${
                isLogin ? "form-visible" : "form-hidden-left"
              }`}
            >
              <Login onSwitch={handleSwitch} isDarkMode={isDarkMode} />
            </div>
            <div
              className={`absolute top-0 w-full forms-viewport ${
                !isLogin ? "form-visible" : "form-hidden-right"
              }`}
            >
              {/* Only render Suspense/Signup if user has navigated to it, saving initial bandwidth */}
              {(signupLoaded || !isLogin) && (
                <Suspense fallback={<SkeletonChart />}>
                  <Signup onSwitch={handleSwitch} />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
