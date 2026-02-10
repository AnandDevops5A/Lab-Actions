"use client";

import React, { useContext, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ThemeContext } from "../../lib/contexts/theme-context";
import { SkeletonCard } from "../skeleton/Skeleton";

const Signup = dynamic(() => import("./Signup"), {
  loading: () => <SkeletonCard />,
  ssr: false,
});
const Login = dynamic(() => import("./Login"), {
  loading: () => <SkeletonCard />,
  ssr: false,
});
const ForgotPassword = dynamic(() => import("./ForgotPassword"), {
  loading: () => <SkeletonCard />,
  ssr: false,
});

// Extract styles to avoid re-allocation on every render
const INLINE_STYLES = `
  @keyframes glow-pulse { 0%,100%{box-shadow:0 0 15px rgba(0,229,255,0.6),0 0 5px rgba(255,65,112,0.6);} 50%{box-shadow:0 0 25px rgba(0,229,255,0.8),0 0 10px rgba(255,65,112,0.8);} }
  .neon-glow-frame { animation: glow-pulse 5s infinite alternate; border:2px solid; border-image: linear-gradient(to right,#00E5FF,#FF4170) 1; border-radius:1rem }
  .forms-viewport { perspective: 1200px; }
  .arrow-pulse { animation: arrowPulse 1.6s infinite; }
  @keyframes arrowPulse { 0%{transform:translateX(0);opacity:.9}50%{transform:translateX(4px);opacity:1}100%{transform:translateX(0);opacity:.9} }
  .group:focus-within svg, .group:hover svg { filter: drop-shadow(0 6px 18px rgba(0,229,255,0.12)); transform: translateY(-1px); transition: all .24s ease; }
`;

export default function Page() {
  const [mode, setMode] = useState("login");
  const [loadedForms, setLoadedForms] = useState(["login"]);

  const container = useRef(null);
  const mainContainerRef = useRef(null);

  // Get theme context
  const themeContext = useContext(ThemeContext);
  const { isDarkMode } = themeContext || { isDarkMode: true };

  useGSAP(
    () => {
      gsap.set(container.current.children, {
        autoAlpha: 0,
        rotationY: 90,
        xPercent: 100,
      });
      gsap.set(container.current.children[0], {
        autoAlpha: 1,
        rotationY: 0,
        xPercent: 0,
      });
    },
    { scope: container },
  );

  const handleSwitch = (newMode) => {
    if (newMode === mode) return;

    if (!loadedForms.includes(newMode)) {
      setLoadedForms((prev) => [...prev, newMode]);
    }

    const fromEl =
      mode === "login"
        ? container.current.children[0]
        : mode === "signup"
          ? container.current.children[1]
          : container.current.children[2];
    const toEl =
      newMode === "login"
        ? container.current.children[0]
        : newMode === "signup"
          ? container.current.children[1]
          : container.current.children[2];

    const direction = newMode === "login" ? -1 : 1;
    const newHeight = newMode === "signup" ? 500 : 420;

    gsap.timeline()
      .to(mainContainerRef.current, {
        minHeight: newHeight,
        duration: 0.6,
        ease: "power3.inOut",
      })
      .to(
        fromEl,
        {
          rotationY: -90 * direction,
          xPercent: -100 * direction,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.inOut",
        },
        0,
      )
      .set(
        toEl,
        {
          rotationY: 90 * direction,
          xPercent: 100 * direction,
          autoAlpha: 1,
        },
        0,
      )
      .to(
        toEl,
        {
          rotationY: 0,
          xPercent: 0,
          duration: 0.7,
          ease: "power3.inOut",
        },
        0,
      );

    setMode(newMode);
  };

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

      <div className="w-full max-w-md mx-auto relative top-10 forms-viewport">
        <div
          ref={mainContainerRef}
          className={`relative w-full  ${
            isDarkMode
              ? "bg-black/30 neon-glow-frame"
              : "bg-white/30 shadow-slate-500 shadow-inner"
          } transition-all 
          duration-700 ease-in-out rounded-xl p-3 min-h-[420px]`}
        >
          <div ref={container} className="relative w-full h-full">
            <div className="absolute top-0 left-0 w-full">
              <Login onSwitch={handleSwitch} isDarkMode={isDarkMode} />
            </div>
            <div className="absolute top-0 left-0 w-full">
              {loadedForms.includes("signup") && (
                <Signup onSwitch={handleSwitch} />
              )}
            </div>
            <div className="absolute top-0 left-0 w-full">
              {loadedForms.includes("forgot-password") && (
                <ForgotPassword
                  onSwitch={handleSwitch}
                  isDarkMode={isDarkMode}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
